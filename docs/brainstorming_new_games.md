# Brainstorming: New Card Games Implementation

**Date:** 2026-01-28
**Topic:** Planning the addition of Euchre, Cribbage, Rummy, Hearts, and Spades to the AI-Games platform.

## 1. Overview & Analysis

The goal is to expand the platform beyond Solitaire. While Solitaire is a single-player game, the new requested games are primarily multi-player (played against AI in this context).

### Game Breakdown

| Game | Type | Players | Deck | Key Mechanics |
| :--- | :--- | :--- | :--- | :--- |
| **Euchre** | Trick-taking | 4 (Partners) | 24 cards (9-A) | Trump suit, "Bidding", Bowers |
| **Hearts** | Trick-taking | 4 (Solo) | 52 cards | Avoid points (Hearts & Q♠), Passing cards |
| **Spades** | Trick-taking | 4 (Partners) | 52 cards | Spades are always trump, Bidding tricks |
| **Cribbage** | Strategy/Counting | 2 | 52 cards | Pegging board, "The Crib", Scoring hands |
| **Rummy** | Matching (Meld) | 2-4 | 52 cards | Melds (Sets/Runs), Discard pile |

## 2. Shared Architecture Opportunities

### Trick-Taking Framework
Euchre, Hearts, and Spades can share a core `TrickTakingGame` model:
- `currentTrick`: Tracking cards played in the current round.
- `trumpSuit`: Dynamic or static trump identification.
- `turnOrder`: Managing who plays next.
- `trickWinner`: Logic to determine who won the trick.

### AI/Bot Player Framework
Since these are multi-player games, we need a way to support:
- `CPUPlayer`: Basic to advanced decision-making.
- `TurnManager`: Orchestrating moves between the USER and AI.
- `GameStateVisibility`: Controlling what the player sees vs. what the AI "knows" (hidden hands).

### Card Selection & Dealing
- `Euchre` requires a 24-card deck (9 through Ace).
- `Hearts` requires passing logic (3 cards every round except 4th).

## 3. Potential Challenges

1.  **AI Complexity**: Cribbage and Rummy have more complex optimal strategies than simple trick-taking.
2.  **UI Layout**: Multi-player games require a different board layout than Solitaire (typically North, South, East, West positions).
3.  **State Management**: Handling turns asynchronously and ensuring the UI updates correctly as the AI "thinks" or plays.

## 4. Proposed Roadmap

1.  **Phase 4: Multi-Player Framework & Trick-Taking Core**
    - Develop `Trick` and `Player` base classes.
    - Implement basic AI turn wait/play loop.
    - Create a "Multi-player Table" UI layout.

2.  **Phase 5: Hearts or Spades (Solo Trick-Taking)**
    - Hearts is a good first candidate as it's solo play (no partners) and uses the full deck.
    - Spades adds bidding, which is a good follow-up.

3.  **Phase 6: Euchre (Partners & Deck Modifiers)**
    - Introduce partnership logic.
    - Implement trump bidding and the "left/right bower" logic.

4.  **Phase 7: Rummy (Meld Mechanics)**
    - Implement "Runs" and "Sets" logic.
    - Handle complex discard/draw interactions.

5.  **Phase 8: Cribbage (Pegging & Board UI)**
    - This is the most unique UI (the board).
    - Complex scoring engine for hands and pegging.

## 5. Converting to Action Items

Suggested next steps for the `action_items.md`:
1.  Define the `MultiplayerGame` model interface.
2.  Create a `TrickTakingEngine` that can be reused.
3.  Prototype the "Four Seats" UI layout.
