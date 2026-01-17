/**
 * Move validation tests for SolitaireGame
 * Tests all move types: stock→waste, waste→tableau, waste→foundation, 
 * tableau→foundation, tableau→tableau, and undo/redo
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { SolitaireGame } from '@/models/solitaire/SolitaireGame'
import { Card } from '@/models/Card'

describe('SolitaireGame - Move Validation', () => {
  let game: SolitaireGame

  beforeEach(() => {
    game = new SolitaireGame()
    game.newGame()
  })

  describe('drawFromStock', () => {
    it('should draw 3 cards from stock to waste', () => {
      const initialStock = game.stock.count()
      const initialWaste = game.waste.count()

      game.drawFromStock()

      expect(game.stock.count()).toBe(initialStock - 3)
      expect(game.waste.count()).toBe(initialWaste + 3)
    })

    it('should draw remaining cards if less than 3 left', () => {
      // Empty stock except for 2 cards
      while (game.stock.count() > 2) {
        game.stock.draw(1)
      }

      game.drawFromStock()
      expect(game.stock.count()).toBe(0)
      expect(game.waste.count()).toBeGreaterThan(0)
    })

    it('should reset stock from waste when stock is empty', () => {
      // Empty the stock
      while (!game.stock.isEmpty()) {
        game.drawFromStock()
      }

      const wasteCount = game.waste.count()
      game.drawFromStock() // Should reset

      expect(game.stock.count()).toBe(wasteCount)
      expect(game.waste.count()).toBe(0)
    })

    it('should return false if both stock and waste are empty', () => {
      game.stock.cards = []
      game.waste.cards = []

      const result = game.drawFromStock()
      expect(result).toBe(false)
    })
  })

  describe('moveWasteToTableau', () => {
    it('should move card from waste to valid tableau pile', () => {
      // Set up: put a black Queen on tableau[0]
      game.tableau[0].cards = []
      game.tableau[0].addCards([new Card('spades', 'Q', true)])

      // Put a red Jack in waste
      game.waste.cards = []
      game.waste.addCards([new Card('hearts', 'J', false)])

      const result = game.moveWasteToTableau(0)

      expect(result).toBe(true)
      expect(game.waste.count()).toBe(0)
      expect(game.tableau[0].topCard()!.rank).toBe('J')
    })

    it('should reject invalid move', () => {
      // Set up: put a red Queen on tableau[0]
      game.tableau[0].cards = []
      game.tableau[0].addCards([new Card('hearts', 'Q', true)])

      // Put a red Jack in waste (same color - invalid)
      game.waste.cards = []
      game.waste.addCards([new Card('diamonds', 'J', false)])

      const result = game.moveWasteToTableau(0)

      expect(result).toBe(false)
      expect(game.waste.count()).toBe(1)
    })

    it('should return false if waste is empty', () => {
      game.waste.cards = []
      const result = game.moveWasteToTableau(0)
      expect(result).toBe(false)
    })
  })

  describe('moveWasteToFoundation', () => {
    it('should move Ace from waste to empty foundation', () => {
      // Put Ace of hearts in waste
      game.waste.cards = []
      game.waste.addCards([new Card('hearts', 'A', false)])

      const result = game.moveWasteToFoundation(0) // hearts foundation

      expect(result).toBe(true)
      expect(game.waste.count()).toBe(0)
      expect(game.foundations[0].topCard()!.rank).toBe('A')
    })

    it('should move sequential card to foundation', () => {
      // Set up foundation with Ace
      game.foundations[0].addCard(new Card('hearts', 'A', true))

      // Put 2 of hearts in waste
      game.waste.cards = []
      game.waste.addCards([new Card('hearts', '2', false)])

      const result = game.moveWasteToFoundation(0)

      expect(result).toBe(true)
      expect(game.foundations[0].topCard()!.rank).toBe('2')
    })

    it('should reject wrong suit', () => {
      game.foundations[0].addCard(new Card('hearts', 'A', true))
      game.waste.cards = []
      game.waste.addCards([new Card('spades', '2', false)])

      const result = game.moveWasteToFoundation(0)
      expect(result).toBe(false)
    })
  })

  describe('moveTableauToFoundation', () => {
    it('should move card from tableau to foundation', () => {
      // Set up tableau with Ace on top
      game.tableau[0].cards = []
      game.tableau[0].addCards([new Card('hearts', 'A', true)])

      const result = game.moveTableauToFoundation(0, 0)

      expect(result).toBe(true)
      expect(game.tableau[0].isEmpty()).toBe(true)
      expect(game.foundations[0].topCard()!.rank).toBe('A')
    })

    it('should reject if top card is face down', () => {
      game.tableau[0].cards = []
      game.tableau[0].cards.push(new Card('hearts', 'A', false)) // Face down

      const result = game.moveTableauToFoundation(0, 0)
      expect(result).toBe(false)
    })
  })

  describe('moveTableauToTableau', () => {
    it('should move single card between tableau piles', () => {
      // Source: black Queen
      game.tableau[0].cards = []
      game.tableau[0].addCards([new Card('spades', 'Q', true)])

      // Dest: red King
      game.tableau[1].cards = []
      game.tableau[1].addCards([new Card('hearts', 'K', true)])

      const result = game.moveTableauToTableau(0, 1, 0)

      expect(result).toBe(true)
      expect(game.tableau[0].isEmpty()).toBe(true)
      expect(game.tableau[1].topCard()!.rank).toBe('Q')
    })

    it('should move sequence of cards', () => {
      // Source: K, Q, J (all face up)
      game.tableau[0].cards = []
      game.tableau[0].addCards([
        new Card('hearts', 'K', true),
        new Card('spades', 'Q', true),
        new Card('diamonds', 'J', true)
      ])

      // Dest: empty
      game.tableau[1].cards = []

      // Move from index 0 (the King)
      const result = game.moveTableauToTableau(0, 1, 0)

      expect(result).toBe(true)
      expect(game.tableau[0].isEmpty()).toBe(true)
      expect(game.tableau[1].count()).toBe(3)
    })

    it('should reject moving face-down cards', () => {
      game.tableau[0].cards = []
      game.tableau[0].cards.push(new Card('hearts', 'K', false)) // Face down

      const result = game.moveTableauToTableau(0, 1, 0)
      expect(result).toBe(false)
    })
  })

  describe('undo', () => {
    it('should undo last move', () => {
      // Make a move: draw from stock
      const initialStock = game.stock.count()
      game.drawFromStock()

      // Undo
      const result = game.undo()

      expect(result).toBe(true)
      expect(game.stock.count()).toBe(initialStock)
    })

    it('should return false if no moves to undo', () => {
      const result = game.undo()
      expect(result).toBe(false)
    })

    it('should undo multiple moves in sequence', () => {
      game.drawFromStock()
      game.drawFromStock()

      game.undo()
      game.undo()

      expect(game.moveHistory.length).toBe(0)
    })
  })

  describe('redo', () => {
    it('should redo last undone move', () => {
      game.drawFromStock()
      const wasteAfterDraw = game.waste.count()

      game.undo()
      game.redo()

      expect(game.waste.count()).toBe(wasteAfterDraw)
    })

    it('should return false if no moves to redo', () => {
      const result = game.redo()
      expect(result).toBe(false)
    })
  })

  describe('canAutoMove', () => {
    it('should detect when card can auto-move to foundation', () => {
      // Put Ace on tableau
      game.tableau[0].cards = []
      game.tableau[0].addCards([new Card('hearts', 'A', true)])

      const canMove = game.canAutoMove()
      expect(canMove).toBe(true)
    })

    it('should return false when no auto-moves available', () => {
      // Set up game state with no valid foundation moves
      game.tableau.forEach(t => t.cards = [])
      game.waste.cards = []

      const canMove = game.canAutoMove()
      expect(canMove).toBe(false)
    })
  })

  describe('autoMove', () => {
    it('should automatically move eligible cards to foundation', () => {
      // Put Ace on tableau
      game.tableau[0].cards = []
      game.tableau[0].addCards([new Card('hearts', 'A', true)])

      const moved = game.autoMove()

      expect(moved).toBeGreaterThan(0)
      expect(game.foundations[0].count()).toBeGreaterThan(0)
    })
  })
})
