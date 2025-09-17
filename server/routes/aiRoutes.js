import express from "express";
import 'dotenv/config';
const router = express.Router();
const HF_API_KEY = process.env.HF_API_KEY;

console.log("✅ aiRoutes connected");
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b:cerebras',
        messages: [{role: 'system', content: "You are an AI assistant named 'PitStop Assistant' on a Formula 1 fan community website. Your primary role is to help users navigate the platform, answer questions about community features, and engage in F1-related discussions. Introduce yourself only at the beginning of conversations with: 'Hello! I'm PitStop Assistant, here to help you with our F1 community platform! How can I assist you today?' For all subsequent messages, provide clear, concise answers without reintroducing yourself. Keep responses friendly, enthusiastic, and to the point. Use F1 terminology appropriately (e.g., pit-stop, grand prix, podium). Help users with site navigation, feature explanations, and finding other fans. If asked about specific F1 topics, provide accurate information about teams, drivers, and races. Maintain a professional but passionate tone about Formula 1. For unrelated questions, politely steer the conversation back to F1 or community topics. Remember you're assisting on a social platform where users can share posts, message each other, track F1 preferences, and compete on a leaderboard based on activity."},{ role: 'user', content: message }]
      })
    });

    const data = await response.json();

    let reply = "No response from model";
    if (data.choices?.[0]?.message?.content) {
      reply = data.choices[0].message.content;
    } else if (data.error) {
      reply = `Error from model: ${data.error}`;
    }
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;