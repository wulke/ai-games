# Brainstorming: Docker-Based Bot Framework

**Topic:** Enhancing the "Alpine.js Card Games" project to support user-submitted bots running in Docker.
**Date:** 2026-01-29

## 📋 Initial Requirements & Goals
- **Standardization**: Use Docker to encapsulate bot logic.
- **Multilingual Support**: Users should be able to write bots in any language that can run in Docker (Python, Java, Go, etc.).
- **Game Engine Orchestration**: The main game engine (current React/TypeScript app) should manage interactions between multiple bots.
- **Testing Interface**: Users need a way to test their local Docker images directly against the UI.
- **Security**: Isolation of bot code from the host machine and other bots.

## 🧐 Exploration Areas

## 🏗️ Phased Roadmap

### Phase 1: Local POC (Host Networking)
- **Goal**: Allow users to test bots against the UI with minimal friction.
- **Implementation**:
  - The UI provides a "Developer Settings" panel to input a `localhost` URL and Port.
  - The user runs their Docker container with `--network host`.
  - The UI makes direct `fetch()` requests to `http://localhost:[PORT]/move`.
- **Pros**: Zero backend infra needed initially.
- **Use Case**: Individual bot developers testing their logic against the existing UI.

### Phase 2: Production/Long-term (Sidecar Orchestrator)
- **Goal**: A fully managed environment for hosting tournaments or multi-bot sessions.
- **Implementation**:
  - A Node.js backend manages the Docker lifecycle (pulling images, spawning containers in isolated networks).
  - The backend proxies communication to ensure security and prevent direct browser-to-container access.
  - Supports multiple bots in the same game instance without port conflicts.

## 📜 API Specification (v1)

To ensure game state safety, the **Game Engine** is the source of truth. It passes the current state to the bot and validates the returned move before applying it.

### Standard Request Format
```json
{
  "game": "solitaire" | "hearts",
  "playerIndex": number,
  "state": { ... },
  "validMoves": [ ... ] 
}
```
*Note: Sending `validMoves` simplifies bot development, but bots can also calculate them from `state`.*

### Game-Specific States

#### 1. Solitaire (Klondike)
**State**:
- `tableau`: array of 7 piles (cards with `suit`, `rank`, `isFaceUp`)
- `foundation`: array of 4 piles
- `stock`: number of cards remaining
- `waste`: top card(s) visible

**Response**:
```json
{
  "action": "move",
  "source": { "pile": "tableau", "index": 2, "cardIndex": 5 },
  "destination": { "pile": "foundation", "index": 0 }
}
```

#### 2. Hearts
**State**:
- `hand`: array of cards
- `currentTrick`: array of cards already played in this trick
- `scores`: current round and total scores
- `playedCards`: history of cards played in previous tricks

**Response**:
```json
{
  "action": "play",
  "card": { "suit": "H", "rank": "10" }
}
```

## �️ Validation & Safety
- **Host Validation**: The Game Engine checks the bot's response against the `validMoves` list.
- **Timeout**: Bots must respond within a configurable limit (e.g., 1000ms).
- **Error Handling**: If a bot returns an invalid move or times out, the engine defaults to a "fallback" move (e.g., first valid card) or skips the turn.

## 🧑‍� Developer Experience (DX)

The goal is to provide a "Zero to Bot" experience in under 5 minutes.

### 1. Bot Templates
We will provide official templates for popular languages, starting with **Node.js**. Each template will be a standalone directory designed to be cloned or copied.

**Template Structure**:
- `index.js`: The bot logic (using Express or similar).
- `package.json`: Dependencies.
- `Dockerfile`: Standardized environment for the bot.
- `README.md`: Step-by-step setup guide.
- `.env.example`: Configuration templates.
- `test_payloads/`: Sample JSON requests for offline testing.

### 2. The Onboarding Flow (The "5-Minute" Guide)
1. **Clone the Template**:
   ```bash
   cp -r bots/node-template my-awesome-bot
   cd my-awesome-bot
   ```
2. **Implement Logic**:
   Open `index.js` and modify the `calculateMove` function.
3. **Build & Run**:
   ```bash
   docker build -t my-bot .
   docker run -p 8080:8080 --network host my-bot
   ```
4. **Test in UI**:
   Open the Game UI, go to **Developer Settings**, and point it to `http://localhost:8080`.

### 3. Detailed Documentation Requirements
Each template must include a `README.md` with:
- **Hello World**: A simple "random move" implementation in Node.js.
- **API Breakdown**: Explanation of the `state` object and `response` format.
- **Local Debugging**: How to send a manual `curl` request to the bot to verify logic without the UI.
- **Best Practices**: Handling timeouts, basic strategy tips for the specific game.

## 🚀 Next Steps (Action Items)
1. Create `bots/node-template` with full README and basic random-move logic.
2. Implement "Developer Settings" in the React UI to support custom Bot URLs.
3. Implement `MoveValidator` in the Game Engine to verify Bot responses.
4. Add a "Bot Debugger" overlay in the UI to show request/response logs.
