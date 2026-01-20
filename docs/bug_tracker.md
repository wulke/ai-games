# Bug Tracker

This document tracks bugs, glitches, and visual issues discovered during development and testing of the Solitaire game.

## Bug List

| ID | Description | Severity | Status | Related Action Item |
|:---|:---|:---|:---|:---|
| BUG-001 | Draw pile only displays the top card (should have slight overlap) | Medium | Open | #10 |
| BUG-002 | Card graphics not fully lining up with containers | Medium | Fixed | #11 |
| BUG-003 | Ghost cards remaining during stack drag (tail cards don't hide) | Medium | Fixed | #11 |
| BUG-004 | Foundation (prize) piles all show the same suit | Medium | Open | #10 |
| BUG-005 | Subsequent cards in piles have inconsistent stacking offsets | Medium | Fixed | #11 |

---

## Bug Details

### [BUG-001] Draw pile display incomplete
...
### [BUG-004] Foundation piles uniform suit
- **Problem**: All four foundation piles appear to accept or show the same suit instead of one for each (Hearts, Diamonds, Clubs, Spades).
- **Expected Behavior**: Each of the four foundation piles should be designated for a specific suit.
- **Possible Fix**: Ensure `SolitaireGame` initialization assigns distinct suits to foundations and the UI reflects this (e.g., via background icons or labels).
- **Problem**: The waste pile only shows the top card of the draw, losing the visual stack context.
- **Expected Behavior**: Cards in the waste pile should be visible with a slight horizontal overlap.
- **Possible Fix**: Use `hhand-compact` logic or custom CSS offsets in `solitaire.html`.

### [BUG-002] Card alignment inaccuracies
- **Problem**: Card SVGs/images do not perfectly fill or align with their `.pile-slot` containers, exhibiting strange padding or whitespace. Interestingly, they align correctly in the `DragOverlay`.
- **Expected Behavior**: Pixel-perfect alignment within the slots, matching the visual of the `DragOverlay`.
- **Possible Fix**: Ensure `.card` styles are identical between board and overlay; check container constraints on `.pile-slot`.

### [BUG-003] Stack Drag Ghosting
- **Problem**: When dragging a stack of cards from the Tableau, only the card directly under the cursor is hidden. The "tail" of the stack remains visible in the original location.
- **Expected Behavior**: All cards in the dragged stack (from the picked index downwards) should be hidden from the original pile.
- **Possible Fix**: Check `activeDrag` state in `Solitaire.tsx` to conditionally hide cards in the stack.

### [BUG-005] Inconsistent Stacking Offsets
- **Problem**: When multiple cards are in a pile, the offsets seem "weird" and not correctly anchored to the first card's position.
- **Expected Behavior**: Stacking should be predictable and perfectly aligned, with subsequent offsets based strictly on the first card.
- **Possible Fix**: Refactor `top` and `left` calculations in `Solitaire.tsx` to ensure absolute alignment.

---

## How to Report
When you find a bug, add a new row to the table above and create a corresponding "Bug Detail" section. Use `Critical`, `High`, `Medium`, or `Low` for Severity.
