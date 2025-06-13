import express from 'express';
import { processQuery } from '../services/nlpService.js';

const router = express.Router();

router.post('/process', async (req, res) => {
  try {
    const { query, messages } = req.body;
    const response = await processQuery(query, messages);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;