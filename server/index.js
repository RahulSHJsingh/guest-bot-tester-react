// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Choose the model you want
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// or: const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ reply: text });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Gemini API call failed" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Gemini server listening on http://localhost:${PORT}`);
});
