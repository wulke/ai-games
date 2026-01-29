import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

/**
 * Main move endpoint.
 * Receives the current game state and returns a move.
 */
app.post('/move', (req, res) => {
  const { game, playerIndex, state, validMoves } = req.body;

  console.log(`[${new Date().toISOString()}] Received request for ${game} (Player ${playerIndex})`);

  if (!validMoves || validMoves.length === 0) {
    return res.status(400).json({ error: 'No valid moves provided' });
  }

  // --- BOT LOGIC START ---
  // Currently implements a simple "Random Move" strategy.
  // This is where users will implement their own algorithms.
  
  const move = calculateMove(game, state, validMoves);
  
  // --- BOT LOGIC END ---

  res.json({ move });
});

/**
 * Simple random move selector.
 */
function calculateMove(game, state, validMoves) {
  const randomIndex = Math.floor(Math.random() * validMoves.length);
  const selectedMove = validMoves[randomIndex];

  console.log(`Selecting random move:`, JSON.stringify(selectedMove));
  return selectedMove;
}

/**
 * Health check endpoint for the UI to verify connectivity.
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', engine: 'node-bot-template' });
});

app.listen(PORT, () => {
  console.log(`Bot template running at http://localhost:${PORT}`);
  console.log(`Standardized endpoint: POST http://localhost:${PORT}/move`);
});
