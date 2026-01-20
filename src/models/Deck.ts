/**
 * Deck class - represents a standard 52-card deck
 */

import { Card } from './Card'
import type { Suit, Rank } from './Card'

export class Deck {
  cards: Card[]

  constructor() {
    this.cards = []
    this.reset()
  }

  /**
   * Reset the deck to a full 52-card deck in order
   */
  reset(): void {
    this.cards = []
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
    const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

    for (const suit of suits) {
      for (const rank of ranks) {
        this.cards.push(new Card(suit, rank))
      }
    }
  }

  /**
   * Shuffle the deck using Fisher-Yates algorithm
   */
  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
    }
  }

  /**
   * Draw a card from the top of the deck
   * @returns The drawn card, or undefined if deck is empty
   */
  draw(): Card | undefined {
    return this.cards.pop()
  }

  /**
   * Get the number of remaining cards in the deck
   * @returns Number of cards remaining
   */
  remaining(): number {
    return this.cards.length
  }
}
