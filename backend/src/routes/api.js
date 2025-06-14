import express from 'express';
import { processQuery } from '../services/nlpService.js';
import fs from 'fs/promises';
import path from 'path';
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

router.get('/data', async (req, res) => {
  const data = {};
  const filesToRead = [
    { name: 'documentData', path: '../services/documentdata.py' },
    { name: 'platformData', path: '../services/platformdata.py' },
    { name: 'profileData', path: '../services/profiledata.py' },
  ];

  for (const file of filesToRead) {
    const absolutePath = path.resolve(__dirname, file.path);
    try {
      const fileContent = await fs.readFile(absolutePath, 'utf-8');
      // Simple regex to find top-level variable assignments that look like JSON
      const match = fileContent.match(/\w+\s*=\s*({.*?}|\[.*?\])/s);

      if (match && match[1]) {
        // Attempt to parse the matched string as JSON.
        // Note: This is a basic approach and might fail for complex Python structures
        // or if the Python data is not valid JSON syntax.
        try {
          data[file.name] = JSON.parse(match[1]);
        } catch (parseError) {
          console.error(`Error parsing data from ${file.path}:`, parseError);
          data[file.name] = null; // Indicate failure for this file
        }
      } else {
        console.warn(`Could not extract data from ${file.path}`);
        data[file.name] = null; // Indicate failure for this file
      }
    } catch (error) {
      console.error(`Error reading file ${file.path}:`, error);
      data[file.name] = null; // Indicate failure for this file
    }
  }
  res.json(data);
});

export default router;