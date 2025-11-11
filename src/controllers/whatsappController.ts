import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// WhatsApp API Configuration
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || "";
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || "849774458223750";
const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || "pharmaeco_2025";
const WHATSAPP_API_URL = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Store conversation history
const conversationHistory = new Map<string, any[]>();

// Webhook verification for Meta
export const verifyWebhook = (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("🔍 Webhook verification:", mode, token);

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully!");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Webhook verification failed");
    res.sendStatus(403);
  }
};

// Handle incoming WhatsApp messages
export const handleIncomingMessage = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (value?.messages?.[0]) {
        const message = value.messages[0];
        const from = message.from;
        const messageBody = message.text?.body;
        const messageType = message.type;

        console.log(`📩 Message from ${from}: ${messageBody}`);

        if (messageType === "text" && messageBody) {
          const aiResponse = await generateAIResponse(from, messageBody);
          await sendWhatsAppMessage(from, aiResponse);
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error handling message:", error);
    res.sendStatus(500);
  }
};

// Generate AI response using Gemini REST API
async function generateAIResponse(
  userId: string,
  userMessage: string
): Promise<string> {
  try {
    let history = conversationHistory.get(userId) || [];

    // Build conversation history string
    const conversationHistoryStr = history
      .slice(-4)
      .map(
        (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    const PHARMAECO_CONTEXT = `You are PharmaEcoBot, the AI assistant for PharmaEco - Nigeria's leading pharmaceutical waste management social enterprise.

IDENTITY:
- You are friendly, helpful, and environmentally conscious
- You guide users on safe pharmaceutical waste disposal
- You promote circular economy and sustainability
- You are available 24/7

CORE SERVICES:
1. Guide users to nearest collection points in Lagos, Nigeria
2. Educate on proper disposal of expired/unused medicines
3. Explain what pharmaceutical waste can be recycled (blister packs, cartons, plastics, tubes, leaflets)
4. Register new households, pharmacies, and hospitals
5. Report improper disposal or environmental hazards
6. Provide health and environmental tips

IMPORTANT GUIDELINES:
- Keep responses concise (2-3 sentences max)
- Be warm and conversational
- Ask one question at a time
- Use simple language, avoid jargon
- For registration, ask for: Name, Location (area in Lagos), User Type (household/pharmacy/hospital), Phone number
- For collection points, mention areas like: Victoria Island, Lekki, Surulere, Ikeja, Yaba, etc.
- Never make up information - if unsure, offer to connect them with the team
- No markdown formatting - plain text only

GREETING (use once per conversation):
"Hi! 👋 I'm PharmaEcoBot, your AI guide for safe pharmaceutical waste disposal in Nigeria. How can I help you today?

You can:
✅ Find collection points near you
✅ Learn how to dispose waste safely
✅ Register with PharmaEco
✅ Report environmental hazards"`;

    const prompt = `${PHARMAECO_CONTEXT}\n\nConversation history:\n${conversationHistoryStr}\n\nUser: ${userMessage}\nAssistant:`;

    // Call Gemini API
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("❌ Gemini API Error:", errorData);
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const botReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    // Update conversation history
    history.push({ role: "user", content: userMessage });
    history.push({ role: "assistant", content: botReply });
    if (history.length > 20) history = history.slice(-20);
    conversationHistory.set(userId, history);

    console.log(`✅ AI response generated for ${userId}`);
    return botReply;
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error);
    return "Sorry, I'm having trouble right now. Please try again in a moment or visit https://pharmaeco.org for more info! 🌱";
  }
}

// Send WhatsApp message
async function sendWhatsAppMessage(to: string, message: string): Promise<void> {
  try {
    const payload = {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: {
        body: message,
      },
    };

    await axios.post(WHATSAPP_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`✅ Message sent to ${to}`);
  } catch (error: any) {
    console.error(
      "❌ Error sending message:",
      error.response?.data || error.message
    );
  }
}
