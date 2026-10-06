const express = require("express");
const { generateReply, MAX_MESSAGE_LENGTH } = require("../services/aiService");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const trimmed = message.trim();
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: `Message is too long. Max ${MAX_MESSAGE_LENGTH} characters.`,
      });
    }

    if (history != null && !Array.isArray(history)) {
      return res.status(400).json({ error: "History must be an array." });
    }

    if (Array.isArray(history) && history.length > 20) {
      return res.status(400).json({ error: "History is too long." });
    }

    const result = await generateReply({
      message: trimmed,
      history: Array.isArray(history) ? history : [],
    });

    return res.json({
      reply: result.reply,
      actions: result.actions || [],
      source: result.source,
    });
  } catch (error) {
    console.error("[chat] unexpected error:", error.message);
    return res.status(500).json({
      error: "Unable to process your question right now.",
    });
  }
});

module.exports = router;
