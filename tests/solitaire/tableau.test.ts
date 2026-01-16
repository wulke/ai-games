/**
 * Tableau class tests - TDD approach
 * Tableau piles are the seven main playing piles where cards are built down in alternating colors
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { Tableau } from '@/models/solitaire/Tableau'
import { Card } from '@/models/Card'

describe('Tableau', () => {
  let tableau: Tableau

  beforeEach(() => {
    tableau = new Tableau()
  })

  describe('Constructor', () => {
    it('should create an empty tableau', () => {
      expect(tableau.cards).toEqual([])
      expect(tableau.isEmpty()).toBe(true)
    })
  })

  describe('addCards', () => {
    it('should add cards to empty tableau', () => {
      const cards = [
        new Card('hearts', 'K', false),
        new Card('diamonds', 'Q', false)
      ]
      tableau.addCards(cards)

      expect(tableau.cards.length).toBe(2)
      expect(tableau.isEmpty()).toBe(false)
    })

    it('should flip the top card face up when adding to empty tableau', () => {
      const cards = [
        new Card('hearts', 'K', false),
        new Card('diamonds', 'Q', false),
        new Card('clubs', 'J', false)
      ]
      tableau.addCards(cards)

      expect(tableau.cards[0].isFaceUp).toBe(false)
      expect(tableau.cards[1].isFaceUp).toBe(false)
      expect(tableau.topCard()!.isFaceUp).toBe(true)
    })
  })

  describe('canAddCard', () => {
    it('should accept King on empty tableau', () => {
      const king = new Card('hearts', 'K', true)
      expect(tableau.canAddCard(king)).toBe(true)
    })

    it('should reject non-King on empty tableau', () => {
      const queen = new Card('hearts', 'Q', true)
      const ace = new Card('hearts', 'A', true)

      expect(tableau.canAddCard(queen)).toBe(false)
      expect(tableau.canAddCard(ace)).toBe(false)
    })

    it('should accept card one rank lower with opposite color', () => {
      tableau.addCards([new Card('hearts', 'K', true)])

      const blackQueen = new Card('spades', 'Q', true)
      expect(tableau.canAddCard(blackQueen)).toBe(true)
    })

    it('should reject card of same color', () => {
      tableau.addCards([new Card('hearts', 'K', true)])

      const redQueen = new Card('diamonds', 'Q', true)
      expect(tableau.canAddCard(redQueen)).toBe(false)
    })

    it('should reject card not one rank lower', () => {
      tableau.addCards([new Card('hearts', 'K', true)])

      const jack = new Card('spades', 'J', true)
      const king = new Card('spades', 'K', true)

      expect(tableau.canAddCard(jack)).toBe(false)
      expect(tableau.canAddCard(king)).toBe(false)
    })

    it('should build descending sequence with alternating colors', () => {
      tableau.addCards([new Card('hearts', 'K', true)])
      tableau.addCard(new Card('spades', 'Q', true))
      tableau.addCard(new Card('diamonds', 'J', true))
      tableau.addCard(new Card('clubs', '10', true))

      expect(tableau.cards.length).toBe(4)
      expect(tableau.topCard()!.rank).toBe('10')
    })
  })

  describe('canAddCards', () => {
    it('should accept valid sequence of cards', () => {
      tableau.addCards([new Card('hearts', 'K', true)])

      const sequence = [
        new Card('spades', 'Q', true),
        new Card('diamonds', 'J', true)
      ]

      expect(tableau.canAddCards(sequence)).toBe(true)
    })

    it('should reject invalid sequence', () => {
      tableau.addCards([new Card('hearts', 'K', true)])

      const invalidSequence = [
        new Card('diamonds', 'Q', true), // Same color as K
        new Card('clubs', 'J', true)
      ]

      expect(tableau.canAddCards(invalidSequence)).toBe(false)
    })
  })

  describe('addCard', () => {
    it('should add valid card to tableau', () => {
      tableau.addCards([new Card('hearts', 'K', true)])
      tableau.addCard(new Card('spades', 'Q', true))

      expect(tableau.cards.length).toBe(2)
      expect(tableau.topCard()!.rank).toBe('Q')
    })

    it('should throw error when adding invalid card', () => {
      tableau.addCards([new Card('hearts', 'K', true)])
      const invalidCard = new Card('diamonds', 'Q', true)

      expect(() => tableau.addCard(invalidCard)).toThrow()
    })
  })

  describe('removeCards', () => {
    beforeEach(() => {
      tableau.addCards([
        new Card('hearts', 'K', false),
        new Card('spades', 'Q', false),
        new Card('diamonds', 'J', false),
        new Card('clubs', '10', false)
      ])
    })

    it('should remove cards from specified index', () => {
      const removed = tableau.removeCards(2)

      expect(removed.length).toBe(2)
      expect(removed[0].rank).toBe('J')
      expect(removed[1].rank).toBe('10')
      expect(tableau.cards.length).toBe(2)
    })

    it('should flip top card face up after removal', () => {
      tableau.removeCards(2)
      expect(tableau.topCard()!.isFaceUp).toBe(true)
    })

    it('should throw error for invalid index', () => {
      expect(() => tableau.removeCards(10)).toThrow()
      expect(() => tableau.removeCards(-1)).toThrow()
    })
  })

  describe('topCard', () => {
    it('should return undefined for empty tableau', () => {
      expect(tableau.topCard()).toBeUndefined()
    })

    it('should return the top card', () => {
      const king = new Card('hearts', 'K', true)
      const queen = new Card('spades', 'Q', true)

      tableau.addCards([king])
      tableau.addCard(queen)

      expect(tableau.topCard()).toBe(queen)
    })
  })

  describe('getFaceUpCards', () => {
    it('should return all face up cards from first face up card', () => {
      tableau.addCards([
        new Card('hearts', 'K', false),
        new Card('spades', 'Q', false),
        new Card('diamonds', 'J', true),
        new Card('clubs', '10', true)
      ])

      const faceUp = tableau.getFaceUpCards()
      expect(faceUp.length).toBe(2)
      expect(faceUp[0].rank).toBe('J')
      expect(faceUp[1].rank).toBe('10')
    })

    it('should return empty array if no face up cards', () => {
      tableau.addCards([
        new Card('hearts', 'K', false),
        new Card('spades', 'Q', false)
      ])
      // Manually set all cards face down (override the auto flip-up)
      tableau.cards.forEach((card: Card) => card.isFaceUp = false)

      expect(tableau.getFaceUpCards()).toEqual([])
    })
  })

  describe('count', () => {
    it('should return number of cards in tableau', () => {
      expect(tableau.count()).toBe(0)

      tableau.addCards([new Card('hearts', 'K', true)])
      expect(tableau.count()).toBe(1)

      tableau.addCard(new Card('spades', 'Q', true))
      expect(tableau.count()).toBe(2)
    })
  })
})
