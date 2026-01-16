# Project Brief: Alpine.js Card Games

## 1. Project Overview
**Concept:** A lightweight, browser-based application to play card games using a standard 52-card deck.
**Tech Stack:**
- **Frontend:** HTML5, CSS
- **Logic:** TypeScript
- **Framework:** Alpine.js (following best practices for reactivity and state management)
- **Build Tool:** Vite (Recommended for TypeScript + Alpine setup)
- **Design:** Clean, minimalist UI focusing on the card table experience.

## 2. Currently Implemented Features
*   **Project Initialization** - Basic Vite + Alpine.js setup complete.
*   **Workflows** - Resume, Task Implementation, and Brainstorming workflows.
*   **TDD Framework** - Vitest configured with full testing infrastructure.
*   **Core Models** - Card and Deck classes with comprehensive test coverage.

## 3. Upcoming Features Plan

### Phase 1: Foundation & Workflow
-   **Project Setup:** Initialize repository with Vite, TypeScript, and Alpine.js. [DONE]
-   **Resume Workflow:** Develop a `.agent/workflows/resume.md` workflow to help context switching and picking up work efficiently.
-   **Ideation Workflow:** Configure a `.agent/workflows/brainstorming.md` workflow to support ideation and brainstorming sessions.

### Phase 2: TDD Framework & Core Logic
-   **TDD Setup:** Establish a Test Driven Development framework/environment.
-   **Deck Implementation:** Implement `Deck`, `Card`, and `Hand` logic using TDD as the first use case.
-   **Scalability:** ensure architecture supports multiple game types.

### Phase 3: Game Implementation (Solitaire/Generic)
-   **Table Layout:** Design the "Green Felt" area or modern equivalent.
-   **Drag & Drop:** Implement drag-and-drop mechanics for moving cards (essential for many card games).
-   **Rules Engine:** Basic validation for card placement (e.g., standard Solitaire rules).
