# User Stories: Docker-Based Bot Framework

As the Technical Product Manager, I've drafted the following stories based on our brainstorming session. These stories focus on the **Phase 1: Local POC (Host Networking)** implementation to ensure the best developer experience for bot creators.

---

## Story 1: Node.js Bot Template
**#Problem-Statement**: New bot developers face high friction when starting from scratch. We need a standardized "batteries-included" template to get them running in minutes.

**#Acceptance-Criteria**:
- Create a `bots/node-template` directory.
- Include an `index.js` featuring a basic Express server with a `/move` endpoint.
- Implement "Random Move" logic for both Solitaire and Hearts (based on provided `validMoves`).
- Include a `Dockerfile` that installs dependencies and runs the server.
- Provide a comprehensive `README.md` with step-by-step cloning, building, and running instructions.
- Include a `test_payloads/` directory with sample JSON requests for Solitaire and Hearts.

**#Useful-Resources**:
- [Brainstorming Doc](file:///Users/trevorwulke/workspace/ai-games/docs/brainstorming_docker_bot_framework.md)
- [Project Brief](file:///Users/trevorwulke/workspace/ai-games/docs/project_brief.md)

---

## Story 2: Developer Settings UI
**#Problem-Statement**: Users currently have no way to connect the browser-based UI to a locally running Docker bot. We need a UI interface to manage these connections.

**#Acceptance-Criteria**:
- Add a "Developer Settings" button/tab to the navigation or settings modal.
- Include an input field for "Bot URL" (defaults to `http://localhost:8080`).
- Include a "Connection Test" button that pings the bot and displays its status.
- Persist the Bot URL in `localStorage`.
- Add a toggle to "Enable External Bot" for each player slot in multiplayer games (Hearts).

**#Useful-Resources**:
- [Main UI Component](file:///Users/trevorwulke/workspace/ai-games/src/main.tsx)
- [Theme System (for state persistence patterns)](file:///Users/trevorwulke/workspace/ai-games/src/style/main.css)

---

## Story 3: Game Engine Bot Adapter & Validation
**#Problem-Statement**: The game engine must be able to communicate with the external bot while ensuring that any move returned by the bot is legal and doesn't corrupt the game state.

**#Acceptance-Criteria**:
- Implement a `BotAdapter` class/service to handle `fetch` requests to the external Bot URL.
- Implement move validation logic that checks bot responses against the `game.getValidMoves()` output.
- Implement a timeout mechanism (1000ms) for bot requests.
- Implement fallback logic: if a bot fails, times out, or returns an invalid move, the game should either pick a random valid move or alert the user.

**#Useful-Resources**:
- [Solitaire Game Logic](file:///Users/trevorwulke/workspace/ai-games/src/models/SolitaireGame.ts#L1-L100) (Assumed path)
- [Hearts Game Logic](file:///Users/trevorwulke/workspace/ai-games/src/models/HeartsGame.ts#L1-L100) (Assumed path)

---

## Story 4: Bot Debugger Overlay
**#Problem-Statement**: Developers need visibility into the communication between the UI and their bot to debug issues effectively.

**#Acceptance-Criteria**:
- Create a collapsible "Bot Debugger" overlay in the game view.
- Log all outgoing requests (Payload) and incoming responses (Move) with timestamps.
- Highlight validation errors (e.g., "Bot attempted illegal move: QS on 7D").
- Include a "Replay Last Move" button to re-send the same state to the bot.

**#Useful-Resources**:
- [Solitaire Board Component](file:///Users/trevorwulke/workspace/ai-games/src/components/SolitaireBoard.tsx) (Assumed path)
