/**
 * Stock and Waste classes tests - TDD approach
 * Stock is the draw pile, Waste is where drawn cards go
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { Stock } from '@/models/solitaire/Stock'
import { Waste } from '@/models/solitaire/Waste'
import { Card } from '@/models/Card'
import { Deck } from '@/models/Deck'

describe('Stock', () => {
  let stock: Stock

  beforeEach(() => {
    stock = new Stock()
  })

  describe('Constructor', () => {
    it('should create an empty stock', () => {
      expect(stock.cards).toEqual([])
      expect(stock.isEmpty()).toBe(true)
    })
  })

  describe('addCards', () => {
    it('should add cards to stock', () => {
      const cards = [
        new Card('hearts', 'A', false),
        new Card('spades', 'K', false)
      ]
      stock.addCards(cards)

      expect(stock.cards.length).toBe(2)
      expect(stock.isEmpty()).toBe(false)
    })
  })

  describe('draw', () => {
    it('should draw cards from stock', () => {
      stock.addCards([
        new Card('hearts', 'A', false),
        new Card('spades', 'K', false),
        new Card('diamonds', 'Q', false)
      ])

      const drawn = stock.draw(1)
      expect(drawn.length).toBe(1)
      expect(drawn[0].rank).toBe('Q')
      expect(stock.count()).toBe(2)
    })

    it('should draw multiple cards', () => {
      stock.addCards([
        new Card('hearts', 'A', false),
        new Card('spades', 'K', false),
        new Card('diamonds', 'Q', false)
      ])

      const drawn = stock.draw(2)
      expect(drawn.length).toBe(2)
      expect(stock.count()).toBe(1)
    })

    it('should return empty array when stock is empty', () => {
      const drawn = stock.draw(1)
      expect(drawn).toEqual([])
    })

    it('should draw all remaining cards if count exceeds available', () => {
      stock.addCards([
        new Card('hearts', 'A', false),
        new Card('spades', 'K', false)
      ])

      const drawn = stock.draw(5)
      expect(drawn.length).toBe(2)
      expect(stock.isEmpty()).toBe(true)
    })
  })

  describe('reset', () => {
    it('should add cards back to stock from waste', () => {
      const cards = [
        new Card('hearts', 'A', true),
        new Card('spades', 'K', true)
      ]
      stock.reset(cards)

      expect(stock.count()).toBe(2)
      // Cards should be face down and in reverse order
      expect(stock.cards[0].isFaceUp).toBe(false)
      expect(stock.cards[1].isFaceUp).toBe(false)
    })
  })

  describe('count', () => {
    it('should return number of cards in stock', () => {
      expect(stock.count()).toBe(0)

      stock.addCards([new Card('hearts', 'A', false)])
      expect(stock.count()).toBe(1)
    })
  })
})

describe('Waste', () => {
  let waste: Waste

  beforeEach(() => {
    waste = new Waste()
  })

  describe('Constructor', () => {
    it('should create an empty waste pile', () => {
      expect(waste.cards).toEqual([])
      expect(waste.isEmpty()).toBe(true)
    })
  })

  describe('addCards', () => {
    it('should add cards to waste', () => {
      const cards = [
        new Card('hearts', 'A', false),
        new Card('spades', 'K', false)
      ]
      waste.addCards(cards)

      expect(waste.cards.length).toBe(2)
      expect(waste.isEmpty()).toBe(false)
    })

    it('should flip cards face up when adding', () => {
      const cards = [
        new Card('hearts', 'A', false),
        new Card('spades', 'K', false)
      ]
      waste.addCards(cards)

      expect(waste.cards[0].isFaceUp).toBe(true)
      expect(waste.cards[1].isFaceUp).toBe(true)
    })
  })

  describe('topCard', () => {
    it('should return undefined for empty waste', () => {
      expect(waste.topCard()).toBeUndefined()
    })

    it('should return the top card', () => {
      const ace = new Card('hearts', 'A', false)
      const king = new Card('spades', 'K', false)

      waste.addCards([ace, king])

      expect(waste.topCard()).toBe(king)
      expect(waste.topCard()!.isFaceUp).toBe(true)
    })
  })

  describe('removeTopCard', () => {
    it('should remove and return the top card', () => {
      waste.addCards([
        new Card('hearts', 'A', false),
        new Card('spades', 'K', false)
      ])

      const removed = waste.removeTopCard()
      expect(removed!.rank).toBe('K')
      expect(waste.count()).toBe(1)
    })

    it('should return undefined when waste is empty', () => {
      const removed = waste.removeTopCard()
      expect(removed).toBeUndefined()
    })
  })

  describe('clear', () => {
    it('should remove all cards and return them', () => {
      waste.addCards([
        new Card('hearts', 'A', false),
        new Card('spades', 'K', false),
        new Card('diamonds', 'Q', false)
      ])

      const cleared = waste.clear()
      expect(cleared.length).toBe(3)
      expect(waste.isEmpty()).toBe(true)
    })
  })

  describe('count', () => {
    it('should return number of cards in waste', () => {
      expect(waste.count()).toBe(0)

      waste.addCards([new Card('hearts', 'A', false)])
      expect(waste.count()).toBe(1)
    })
  })
})
