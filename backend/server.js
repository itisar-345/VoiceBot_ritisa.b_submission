import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: 'https://5173-firebase-voicebotgit-1749826517908.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Explicit AI routes
app.post('/api/ai/text', (req, res) => {
  const { text, language } = req.body;
  console.log('Text request:', { text, language });
  res.json({ reply: `Echo: ${text}`, language });
});

app.post('/api/ai/voice', (req, res) => {
  const { language } = req.body;
  console.log('Voice request:', { language });
  res.json({ reply: 'Voice response', language, transcript: 'Sample transcript' });
});

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});