/**
 * Deck class tests - TDD approach
 * Write tests first, then implement the Deck class
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { Deck } from '../src/models/Deck'
import { Card } from '../src/models/Card'

describe('Deck', () => {
  let deck: Deck

  beforeEach(() => {
    deck = new Deck()
  })

  describe('Constructor', () => {
    it('should create a deck with 52 cards', () => {
      expect(deck.cards.length).toBe(52)
    })

    it('should have 13 cards of each suit', () => {
      const suits = ['hearts', 'diamonds', 'clubs', 'spades']
      suits.forEach(suit => {
        const suitCards = deck.cards.filter(card => card.suit === suit)
        expect(suitCards.length).toBe(13)
      })
    })

    it('should have 4 cards of each rank', () => {
      const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
      ranks.forEach(rank => {
        const rankCards = deck.cards.filter(card => card.rank === rank)
        expect(rankCards.length).toBe(4)
      })
    })

    it('should have all cards face down by default', () => {
      const faceUpCards = deck.cards.filter(card => card.isFaceUp)
      expect(faceUpCards.length).toBe(0)
    })
  })

  describe('Shuffle', () => {
    it('should shuffle the deck', () => {
      // Compare actual card positions, not toString (cards are face down)
      const originalOrder = deck.cards.map(card => `${card.suit}-${card.rank}`)
      deck.shuffle()
      const shuffledOrder = deck.cards.map(card => `${card.suit}-${card.rank}`)

      // Very unlikely to be in the same order after shuffling
      expect(originalOrder).not.toEqual(shuffledOrder)
    })

    it('should still have 52 cards after shuffling', () => {
      deck.shuffle()
      expect(deck.cards.length).toBe(52)
    })
  })

  describe('Draw', () => {
    it('should draw a card from the deck', () => {
      const card = deck.draw()
      expect(card).toBeInstanceOf(Card)
      expect(deck.cards.length).toBe(51)
    })

    it('should draw cards from the top of the deck', () => {
      const topCard = deck.cards[deck.cards.length - 1]
      const drawnCard = deck.draw()
      expect(drawnCard).toBe(topCard)
    })

    it('should return undefined when deck is empty', () => {
      // Draw all cards
      for (let i = 0; i < 52; i++) {
        deck.draw()
      }
      const card = deck.draw()
      expect(card).toBeUndefined()
    })

    it('should reduce deck size with each draw', () => {
      expect(deck.cards.length).toBe(52)
      deck.draw()
      expect(deck.cards.length).toBe(51)
      deck.draw()
      expect(deck.cards.length).toBe(50)
    })
  })

  describe('Remaining', () => {
    it('should return the number of remaining cards', () => {
      expect(deck.remaining()).toBe(52)
      deck.draw()
      expect(deck.remaining()).toBe(51)
      deck.draw()
      deck.draw()
      expect(deck.remaining()).toBe(49)
    })
  })

  describe('Reset', () => {
    it('should reset the deck to 52 cards', () => {
      deck.draw()
      deck.draw()
      deck.draw()
      expect(deck.cards.length).toBe(49)

      deck.reset()
      expect(deck.cards.length).toBe(52)
    })

    it('should create a new ordered deck', () => {
      deck.shuffle()
      const shuffledOrder = deck.cards.map(card => `${card.suit}-${card.rank}`)

      deck.reset()
      const resetOrder = deck.cards.map(card => `${card.suit}-${card.rank}`)

      // Reset should return to original order, different from shuffled
      expect(resetOrder).not.toEqual(shuffledOrder)
    })
  })
})
