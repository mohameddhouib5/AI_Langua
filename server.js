import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const app = express();
const port = 3000;

const endpoint = process.env.AZURE_INFERENCE_ENDPOINT;
const key = process.env.AZURE_INFERENCE_KEY;




// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());

const client = ModelClient(endpoint, new AzureKeyCredential(key));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/translate", async (req, res) => {
  const { text, language } = req.body;

  if (!text || !language) {
    return res.status(400).json({ error: "Missing input." });
  }

  const messages = [
    {
      role: "system",
      content: `You are a translator. Translate the user's English text to ${language}`,
    },
    {
      role: "user",
      content: text,
    },
  ];

  try {
    const response = await client.path("/chat/completions").post({
      body: {
        model: "openai/gpt-4.1-mini", // This is the GitHub model slug
        messages,
        temperature: 0.7,
        top_p: 1
      }
    });

    if (isUnexpected(response)) {
      console.error("Unexpected response:", response.body.error);
      return res.status(500).json({ error: "Model request failed." });
    }

    const result = response.body.choices?.[0]?.message?.content?.trim();
    res.json({ translated: result || "No response" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Translation failed." });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
