import express from "express";
import {
  handleIncomingMessage,
  verifyWebhook,
} from "../controllers/whatsappController";

const router = express.Router();

// Webhook verification endpoint (Meta requires this)
router.get("/webhook", verifyWebhook);

// Receive incoming messages
router.post("/webhook", handleIncomingMessage);

export default router;
