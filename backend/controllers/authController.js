import { registerUser, authenticateUser } from '../services/cognitoService.js';

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await registerUser(email, password);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const tokens = await authenticateUser(email, password);
    res.json(tokens);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
