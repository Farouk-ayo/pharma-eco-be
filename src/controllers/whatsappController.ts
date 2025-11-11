import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Configuration
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || "";
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || "780541721820176";
const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || "pharmaeco_2025";
const WHATSAPP_API_URL = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-2.5-flash-lite";

// Rate Limiter
class RateLimiter {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;
  private requestCount = 0;
  private lastResetTime = Date.now();
  private readonly MAX_RPM = 8;

  async addToQueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      if (now - this.lastResetTime > 60000) {
        this.requestCount = 0;
        this.lastResetTime = now;
      }

      if (this.requestCount >= this.MAX_RPM) {
        const waitTime = 60000 - (now - this.lastResetTime);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        this.requestCount = 0;
        this.lastResetTime = Date.now();
      }

      const task = this.queue.shift();
      if (task) {
        this.requestCount++;
        await task();
      }
    }

    this.processing = false;
  }
}

const rateLimiter = new RateLimiter();
const conversationHistory = new Map<string, any[]>();

// Webhook verification
export const verifyWebhook = (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Webhook verification failed");
    res.sendStatus(403);
  }
};

// Handle incoming messages
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
          const aiResponse = await generateAIResponseWithRetry(
            from,
            messageBody
          );
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

// Generate AI response with retry
async function generateAIResponseWithRetry(
  userId: string,
  userMessage: string,
  maxRetries = 3
): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await rateLimiter.addToQueue(() =>
        generateAIResponse(userId, userMessage)
      );
    } catch (error: any) {
      const errorData = error.response?.data || error;

      if (errorData.error?.code === 429 || error.status === 429) {
        const waitSeconds = 22; // From error message
        console.log(`⏳ Quota exceeded. Waiting ${waitSeconds}s...`);

        if (attempt < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, waitSeconds * 1000)
          );
        } else {
          return "I'm experiencing high demand right now. Please try again in a few moments! 🙏";
        }
      } else {
        throw error;
      }
    }
  }

  return "Sorry, I'm temporarily unavailable. Please try again later or visit https://pharmaeco.org";
}

// Generate AI response
async function generateAIResponse(
  userId: string,
  userMessage: string
): Promise<string> {
  try {
    let history = conversationHistory.get(userId) || [];

    const conversationHistoryStr = history
      .slice(-2) // Only last 2 exchanges
      .map((msg) => `${msg.role === "user" ? "U" : "A"}: ${msg.content}`)
      .join("\n");

    const PHARMAECO_CONTEXT = `You are PharmaEcoBot for PharmaEco Nigeria. Help with pharmaceutical waste disposal.

Services:
1. Find collection points in Lagos
2. Disposal guidelines
3. Registration
4. Report hazards

Keep responses under 80 words. Be friendly and concise.`;

    const prompt = `${PHARMAECO_CONTEXT}\n\n${conversationHistoryStr}\nU: ${userMessage}\nA:`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 256,
          },
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("❌ Gemini API Error:", errorData);
      throw { status: res.status, response: { data: errorData } };
    }

    const data = await res.json();
    const botReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    // Update history
    history.push({ role: "user", content: userMessage });
    history.push({ role: "assistant", content: botReply });
    if (history.length > 10) history = history.slice(-10);
    conversationHistory.set(userId, history);

    console.log(`✅ Response generated for ${userId}`);
    return botReply;
  } catch (error: any) {
    console.error("❌ AI Error:", error);
    throw error;
  }
}

// Send WhatsApp message
async function sendWhatsAppMessage(to: string, message: string): Promise<void> {
  try {
    const payload = {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: message },
    };

    await axios.post(WHATSAPP_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`✅ Message sent to ${to}`);
  } catch (error: any) {
    console.error("❌ Send error:", error.response?.data || error.message);
  }
}
