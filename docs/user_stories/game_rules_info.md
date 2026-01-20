# User Story: Game Rules Info System

## #Problem-Statement
Players often need quick access to the rules and mechanics of the card game they are playing without navigating away from the table. Currently, there is no in-game guidance, which can lead to confusion for new players or for those unfamiliar with specific variants (like Klondike Solitaire rules).

## #Acceptance-Criteria
- [ ] **Info Button**: A clearly visible "Info" or "?" button is available in the game UI (e.g., in the header or alongside game controls).
- [ ] **Rules Modal**: Clicking the button opens a modern, responsive modal or overlay containing the game rules.
- [ ] **Rich Content**: The rules are presented with clear headings, bullet points, and (ideally) visual aids or diagrams if needed.
- [ ] **Game-Specific**: The system automatically serves the rules for the currently loaded game (Solitaire).
- [ ] **Ease of Use**: The modal can be closed easily by clicking an "X", clicking the background, or pressing the `Escape` key.
- [ ] **State Management**: Uses Alpine.js to manage the visibility and content of the help system.

## #Useful-Resources

### 📂 UI Framework
*   **[solitaire.html](../../src/pages/solitaire.html)**: Add the button to the `.game-header` or `.game-controls`.
*   **[solitaire.css](../../src/style/solitaire.css)**: Style the modal (glassmorphism or premium dark overlay).

### ⚙️ State Logic
*   **[gameStore.ts](../../src/stores/gameStore.ts)**: Add a `helpOpen: false` property to the game instance to toggle visibility.

### 📚 Content
*   **Rules for Klondike Solitaire**: Determine the best way to store and inject the rules (e.g., a constant in the store or a separate JSON/Markdown file).
