# 🃏 AI Card Game Bot - Node.js Template

Welcome! This is a "batteries-included" starter template for building AI bots for the Alpine Card Games platform. This template uses **Node.js** and **Express**.

## 🚀 Quick Start (5 Minutes)

### 1. Clone & Setup
Copy this directory to your own workspace:
```bash
cp -r bots/node-template my-bot
cd my-bot
```

### 2. Implementation
Open `index.js`. The current implementation picks a random move from the `validMoves` array provided by the Game Engine.

Update the `calculateMove` function to add your own secret sauce:
```javascript
function calculateMove(game, state, validMoves) {
  // Your logic here!
  // 'state' is the full game state
  // 'validMoves' are all legal moves you can make
  return validMoves[0]; 
}
```

### 3. Build & Run (Docker)
Build your bot's container:
```bash
docker build -t card-game-bot .
```

Run your bot using **host networking** so the UI can find it at `localhost:8080`:
```bash
docker run -p 8080:8080 --network host card-game-bot
```

### 4. Connect to UI
1. Open the Card Game UI in your browser.
2. Go to **Developer Settings**.
3. Set the Bot URL to `http://localhost:8080`.
4. Start a game and watch your bot play!

---

## 🛠️ Development & Debugging

### Manual Testing (Curl)
You can test your bot's move logic without the UI using `curl`:
```bash
curl -X POST http://localhost:8080/move \
  -H "Content-Type: application/json" \
  -d '{
    "game": "hearts",
    "playerIndex": 1,
    "validMoves": [{"suit": "H", "rank": "10"}, {"suit": "S", "rank": "2"}],
    "state": {}
  }'
```

### Payloads
Check the `test_payloads/` directory for sample JSON objects representing different game states (Hearts, Solitaire, etc.).

### Standard API
**POST `/move`**
Request Body:
- `game`: String (`"solitaire"` | `"hearts"`)
- `playerIndex`: Number
- `state`: Object (Game-specific state)
- `validMoves`: Array (List of legal moves)

Response Body:
- `move`: Object (The move you want to make)
