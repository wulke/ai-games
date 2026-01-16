/**
 * Foundation class tests - TDD approach
 * Foundation piles are where cards are built up from Ace to King by suit
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { Foundation } from '@/models/solitaire/Foundation'
import { Card } from '@/models/Card'

describe('Foundation', () => {
  let foundation: Foundation

  beforeEach(() => {
    foundation = new Foundation('hearts')
  })

  describe('Constructor', () => {
    it('should create an empty foundation for a specific suit', () => {
      expect(foundation.suit).toBe('hearts')
      expect(foundation.cards).toEqual([])
      expect(foundation.isEmpty()).toBe(true)
    })

    it('should create foundations for all suits', () => {
      const hearts = new Foundation('hearts')
      const diamonds = new Foundation('diamonds')
      const clubs = new Foundation('clubs')
      const spades = new Foundation('spades')

      expect(hearts.suit).toBe('hearts')
      expect(diamonds.suit).toBe('diamonds')
      expect(clubs.suit).toBe('clubs')
      expect(spades.suit).toBe('spades')
    })
  })

  describe('canAddCard', () => {
    it('should accept Ace on empty foundation', () => {
      const ace = new Card('hearts', 'A', true)
      expect(foundation.canAddCard(ace)).toBe(true)
    })

    it('should reject non-Ace on empty foundation', () => {
      const two = new Card('hearts', '2', true)
      const king = new Card('hearts', 'K', true)

      expect(foundation.canAddCard(two)).toBe(false)
      expect(foundation.canAddCard(king)).toBe(false)
    })

    it('should reject card of wrong suit', () => {
      const aceHearts = new Card('hearts', 'A', true)
      foundation.addCard(aceHearts)

      const twoSpades = new Card('spades', '2', true)
      expect(foundation.canAddCard(twoSpades)).toBe(false)
    })

    it('should accept next rank in sequence', () => {
      const ace = new Card('hearts', 'A', true)
      foundation.addCard(ace)

      const two = new Card('hearts', '2', true)
      expect(foundation.canAddCard(two)).toBe(true)
    })

    it('should reject non-sequential rank', () => {
      const ace = new Card('hearts', 'A', true)
      foundation.addCard(ace)

      const three = new Card('hearts', '3', true)
      const king = new Card('hearts', 'K', true)

      expect(foundation.canAddCard(three)).toBe(false)
      expect(foundation.canAddCard(king)).toBe(false)
    })

    it('should build complete sequence A-K', () => {
      const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const

      for (const rank of ranks) {
        const card = new Card('hearts', rank, true)
        expect(foundation.canAddCard(card)).toBe(true)
        foundation.addCard(card)
      }

      expect(foundation.isComplete()).toBe(true)
    })
  })

  describe('addCard', () => {
    it('should add valid card to foundation', () => {
      const ace = new Card('hearts', 'A', true)
      foundation.addCard(ace)

      expect(foundation.cards.length).toBe(1)
      expect(foundation.topCard()).toBe(ace)
      expect(foundation.isEmpty()).toBe(false)
    })

    it('should throw error when adding invalid card', () => {
      const two = new Card('hearts', '2', true)
      expect(() => foundation.addCard(two)).toThrow()
    })
  })

  describe('topCard', () => {
    it('should return undefined for empty foundation', () => {
      expect(foundation.topCard()).toBeUndefined()
    })

    it('should return the top card', () => {
      const ace = new Card('hearts', 'A', true)
      const two = new Card('hearts', '2', true)

      foundation.addCard(ace)
      foundation.addCard(two)

      expect(foundation.topCard()).toBe(two)
    })
  })

  describe('isComplete', () => {
    it('should return false for incomplete foundation', () => {
      expect(foundation.isComplete()).toBe(false)

      foundation.addCard(new Card('hearts', 'A', true))
      expect(foundation.isComplete()).toBe(false)
    })

    it('should return true when all 13 cards are placed', () => {
      const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const

      for (const rank of ranks) {
        foundation.addCard(new Card('hearts', rank, true))
      }

      expect(foundation.isComplete()).toBe(true)
      expect(foundation.cards.length).toBe(13)
    })
  })

  describe('count', () => {
    it('should return number of cards in foundation', () => {
      expect(foundation.count()).toBe(0)

      foundation.addCard(new Card('hearts', 'A', true))
      expect(foundation.count()).toBe(1)

      foundation.addCard(new Card('hearts', '2', true))
      expect(foundation.count()).toBe(2)
    })
  })
})
