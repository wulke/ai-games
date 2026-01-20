# User Story: Advanced Card Visuals & Stacking

## #Problem-Statement
Following the React migration, the card rendering meets basic functionality but lacks the "premium" tactile feel and has several visual regressions. Specifically, the vertical fanning in the tableau is mechanical, foundation piles have lost their unique suit indicators, and the waste pile display is incomplete. We need a polished, predictable layout across all piles.

## #Acceptance-Criteria
- [ ] **Proportional Sizing**: Cards maintain a consistent aspect ratio (`2.5 / 3.5`) and scale elegantly with the screen width using CSS variables.
- [ ] **Visual Depth**: Implement tiered shadows and a premium "lift" effect using `@dnd-kit`'s `DragOverlay`.
- [ ] **Correct Tableau Fanning**: Tableau cards must fan downwards with consistent offsets (`--fan-offset-v` and `--fan-offset-v-closed`) and perfect alignment to the pile slot border.
- [ ] **Horizontal Waste Fanning**: The waste pile must display the top 3 cards, fanned horizontally using `--fan-offset-h`.
- [ ] **Drag & Drop Tactility**: Optimize the `@dnd-kit` configuration for a "weighty" and responsive feel. This includes tuning activation constraints, snap-back animations, and collision detection thresholds.

## #Useful-Resources

### 📂 The "Living" Board
*   **[Solitaire.tsx](../../src/components/Solitaire.tsx)**:
    - **`DndContext`**: Central hub for sensors and collision logic.
    - **`DragOverlay`**: Handles the visual stack representation during drag.
    - **`DraggableCard` & `DroppablePile`**: Reactive wrappers for game objects.

### ⚙️ Drag & Drop Tactility (@dnd-kit)
*   **[Sensors Guide](https://docs.dndkit.com/api-reference/sensors)**: Learn how to tune `activationConstraint` (distance/delay) to prevent jitter.
*   **[Modifiers](https://docs.dndkit.com/api-reference/modifiers)**: Use `restrictToWindowEdges` or custom modifiers to keep cards in view.
*   **[Drop Animation](https://docs.dndkit.com/api-reference/drag-overlay/drop-animation)**: Customize the `dropAnimation` prop on `DragOverlay` for smoother snap-back.
*   **[Collision Detection](https://docs.dndkit.com/api-reference/collision-detection-algorithms)**: Switch between `closestCenter` and `rectIntersection` to find the most intuitive drop feel.

### 🎨 The Design System
*   **[solitaire.css](../../src/style/solitaire.css)**:
    - **CSS Variables**: Central source of truth for `--card-width`, `--fan-offset-v`, etc.
    - **Precision**: Ensure `.pile-slot` has no `padding` or `flex` that would interfere with absolute positioning.

### ⚙️ The Game Logic
*   **[SolitaireGame.ts](../../src/models/solitaire/SolitaireGame.ts)**: References for how the `waste` and `tableau` arrays are structured.
*   **[useSolitaire.ts](../../src/hooks/useSolitaire.ts)**: The custom hook managing the game state.
