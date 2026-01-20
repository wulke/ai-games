# Pull Request: Solitaire Interactivity Refinements (Stack Dragging & Alignment)

**Branch:** `feature/solitaire-interactivity` → `main`
**Date:** 2026-01-20

## 📋 Task Description
This PR addresses several critical visual and interactive bugs in the Solitaire game following the `@dnd-kit` migration. It focuses on pixel-perfect card alignment, robust stack fanning in the Tableau, and fixing the "ghosting" effect when dragging multi-card stacks.

## 🔨 Changes Implemented
### Modified Files
- **[Solitaire.tsx](file:///Users/trevorwulke/workspace/vibes/ai-games/src/components/Solitaire.tsx)**:
    - Implemented `forceHidden` logic in `DraggableCard` to hide entire stacks during drag.
    - Refactored Tableau mapping to use a precise `calcTop` formula based on face-up/face-down counts.
    - Fixed structural JSX issues and cleaned up unused logic.
- **[solitaire.css](file:///Users/trevorwulke/workspace/vibes/ai-games/src/style/solitaire.css)**:
    - Enforced global `box-sizing: border-box`.
    - Added comprehensive resets for library-injected styles (`padding` and `margin` from CardJS).
    - Standardized card dimensions and fanning offsets (`45px` face-up, `20px` face-down).
    - Refined pile-slot visuals with dashed borders and adjusted card anchoring (`top: -2px; left: -2px`).
- **[bug_tracker.md](file:///Users/trevorwulke/workspace/vibes/ai-games/docs/bug_tracker.md)**: Marked BUG-002, BUG-003, and BUG-005 as Fixed.
- **[action_items.md](file:///Users/trevorwulke/workspace/vibes/ai-games/docs/action_items.md)**: Updated progress on Solitaire interactivity and polish.

## ✅ Test Cases
- [x] **Stack Dragging**: Grab a card in the middle of a tableau pile; verify all cards below it follow the cursor and hide from the source pile.
- [x] **Alignment**: Verify cards perfectly cover the dashed boundaries of the `pile-slot` placeholders.
- [x] **Waste Pile**: Verify no top/right padding displacement appears on waste pile cards.
- [x] **Fanning**: Verify face-down and face-up cards have distinct, predictable vertical offsets.

## 🎯 Impact Assessment
- **Risk level**: Low
- **Breaking changes**: None.
- **Benefits**: Significant improvement in visual polish and tactile feel. Eliminates library-injected styling conflicts.

## ✍️ Review Checklist
- [x] All tests passing
- [x] Documentation updated
- [x] Clean commit history
- [x] Ready to merge
