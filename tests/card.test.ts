/**
 * Card class tests - TDD approach
 * Write tests first, then implement the Card class
 */

import { describe, it, expect } from 'vitest'
import { Card, Suit, Rank } from '../src/models/Card'

describe('Card', () => {
  describe('Constructor', () => {
    it('should create a card with suit and rank', () => {
      const card = new Card('hearts', 'A')
      expect(card.suit).toBe('hearts')
      expect(card.rank).toBe('A')
    })

    it('should create a card that is face down by default', () => {
      const card = new Card('spades', 'K')
      expect(card.isFaceUp).toBe(false)
    })

    it('should allow creating a face up card', () => {
      const card = new Card('diamonds', '7', true)
      expect(card.isFaceUp).toBe(true)
    })
  })

  describe('Flip', () => {
    it('should flip a face down card to face up', () => {
      const card = new Card('clubs', '3')
      card.flip()
      expect(card.isFaceUp).toBe(true)
    })

    it('should flip a face up card to face down', () => {
      const card = new Card('hearts', 'Q', true)
      card.flip()
      expect(card.isFaceUp).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return string representation of face up card', () => {
      const card = new Card('hearts', 'A', true)
      expect(card.toString()).toBe('A of hearts')
    })

    it('should return "Face Down" for face down cards', () => {
      const card = new Card('spades', 'K')
      expect(card.toString()).toBe('Face Down')
    })

    it('should return card value for face up cards', () => {
      const card = new Card('diamonds', '10', true)
      expect(card.toString()).toBe('10 of diamonds')
    })
  })

  describe('Valid suits and ranks', () => {
    it('should accept all valid suits', () => {
      const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
      suits.forEach(suit => {
        const card = new Card(suit, 'A')
        expect(card.suit).toBe(suit)
      })
    })

    it('should accept all valid ranks', () => {
      const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
      ranks.forEach(rank => {
        const card = new Card('hearts', rank)
        expect(card.rank).toBe(rank)
      })
    })
  })
})
