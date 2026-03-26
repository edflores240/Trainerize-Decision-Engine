import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Target the logic-matrix file inside src/engine/
const MATRIX_PATH = join(__dirname, 'src', 'engine', 'logic-matrix.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GET: Read current rules
app.get('/api/rules', (req, res) => {
  try {
    const data = readFileSync(MATRIX_PATH, 'utf-8');
    const matrix = JSON.parse(data);
    res.json(matrix);
  } catch (err) {
    console.error('Error reading generic rule matrix:', err);
    res.status(500).json({ error: 'Failed to read rule matrix.' });
  }
});

// POST: Save updated rules
app.post('/api/rules', (req, res) => {
  try {
    const newRules = req.body.rules;
    if (!newRules || !Array.isArray(newRules)) {
      return res.status(400).json({ error: 'Invalid payload: rules array expected.' });
    }

    // Read the current file to maintain engine_version
    const data = readFileSync(MATRIX_PATH, 'utf-8');
    const existingMatrix = JSON.parse(data);

    const updatedMatrix = {
      ...existingMatrix,
      rules: newRules,
    };

    writeFileSync(MATRIX_PATH, JSON.stringify(updatedMatrix, null, 4));
    res.json({ success: true, message: 'Rules updated successfully.' });
  } catch (err) {
    console.error('Error writing rule matrix:', err);
    res.status(500).json({ error: 'Failed to write rule matrix.' });
  }
});

app.listen(PORT, () => {
  console.log(`[Admin Backend] Rules API server running on http://localhost:${PORT}`);
});
