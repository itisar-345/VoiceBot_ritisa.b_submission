// controllers/chatController.js
import { getChats } from '../services/dynamoService.js';

export const getChatHistory = async (req, res) => {
  try {
    const email = req.query.email;
    const chats = await getChats(email);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
