# Project Brief: Alpine.js Card Games

## 1. Project Overview
**Concept:** A lightweight, browser-based card games platform using a standard 52-card deck. The platform is designed to support multiple card games, with Klondike Solitaire being the first game to be implemented.
**Current Focus:** Implementing Klondike Solitaire as the initial game
**Tech Stack:**
- **Frontend:** HTML5, CSS
- **Logic:** TypeScript
- **Framework:** Alpine.js (following best practices for reactivity and state management)
- **Build Tool:** Vite (Recommended for TypeScript + Alpine setup)
- **Testing:** Vitest (TDD approach)
- **Design:** Clean, minimalist UI focusing on the card table experience.

## 2. Currently Implemented Features
*   **Project Initialization** - Basic Vite + Alpine.js setup complete.
*   **Workflows** - Resume, Task Implementation, and Brainstorming workflows.
*   **TDD Framework** - Vitest configured with full testing infrastructure.
*   **Core Models** - Card and Deck classes with comprehensive test coverage (26 tests passing).

## 3. Current Phase: First Game Implementation - Solitaire

The project is now focused on implementing Solitaire (Klondike variant) as the first complete, playable game. This will establish patterns and components that can be reused for future card games. The implementation is broken down into 5 action items covering game logic, move validation, UI design, interactivity, and final integration.

### Phase 3: First Game Implementation - Solitaire (Klondike)
Implement classic Klondike Solitaire as the first complete game. This phase will establish reusable patterns for future card games, broken down into logical components:

#### 3.1 Core Game Logic
-   **Game Models:** `SolitaireGame`, `Tableau`, `Foundation`, `Stock`, and `Waste` classes
-   **State Management:** Track all pile states, move history, and game status
-   **TDD Approach:** Write comprehensive tests before implementation

#### 3.2 Move Validation & Mechanics
-   **Legal Moves:** Validate tableau-to-tableau, tableau-to-foundation, stock-to-waste, waste-to-tableau, etc.
-   **Auto-Move:** Detect and execute automatic foundation moves
-   **Undo/Redo:** Full move history with undo capability
-   **Win Detection:** Automatically detect when game is won

#### 3.3 UI Layout & Styling
-   **Premium Design:** Modern green felt table with gradients and shadows
-   **Card Layouts:** Seven tableau piles, four foundation piles, stock and waste piles
-   **Responsive:** Adapt to different screen sizes
-   **Card Design:** Beautiful card visuals with smooth animations
-   **Visual Polish:** Micro-animations, hover effects, and transitions

#### 3.4 Interactivity (Alpine.js)
-   **Drag & Drop:** Intuitive card movement with visual feedback
-   **Click Interactions:** Stock pile cycling, double-click auto-move
-   **Game Controls:** New game, undo, hint buttons
-   **State Binding:** Alpine.js reactive state management
-   **Animations:** Smooth card movements and transitions

#### 3.5 Integration & Polish
-   **End-to-End Testing:** Verify complete game flow
-   **Performance:** Optimize for smooth 60fps animations
-   **Accessibility:** Keyboard navigation and screen reader support
-   **Optional Features:** Sound effects, statistics, leaderboard

---

## Completed Phases

<details>
<summary>View Completed Phases</summary>

### Phase 1: Foundation & Workflow [COMPLETED]
-   **Project Setup:** Initialize repository with Vite, TypeScript, and Alpine.js. ✅
-   **Resume Workflow:** Develop a `.agent/workflows/resume.md` workflow to help context switching and picking up work efficiently. ✅
-   **Ideation Workflow:** Configure a `.agent/workflows/brainstorming.md` workflow to support ideation and brainstorming sessions. ✅

### Phase 2: TDD Framework & Core Logic [COMPLETED]
-   **TDD Setup:** Establish a Test Driven Development framework/environment. ✅
-   **Deck Implementation:** Implement `Deck`, `Card`, and `Hand` logic using TDD as the first use case. ✅
-   **Scalability:** Ensure architecture supports multiple game types. ✅

</details>
