/**
 * Waste class - represents the waste pile in Solitaire
 * Cards drawn from stock are placed here face up
 */

import { Card } from '../Card'

export class Waste {
  cards: Card[]

  constructor() {
    this.cards = []
  }

  /**
   * Check if the waste is empty
   */
  isEmpty(): boolean {
    return this.cards.length === 0
  }

  /**
   * Add cards to the waste pile
   * Cards are automatically flipped face up
   */
  addCards(cards: Card[]): void {
    cards.forEach(card => {
      card.isFaceUp = true
      this.cards.push(card)
    })
  }

  /**
   * Get the top card of the waste pile
   */
  topCard(): Card | undefined {
    return this.cards[this.cards.length - 1]
  }

  /**
   * Remove and return the top card
   */
  removeTopCard(): Card | undefined {
    return this.cards.pop()
  }

  /**
   * Clear all cards from waste and return them
   */
  clear(): Card[] {
    const cleared = [...this.cards]
    this.cards = []
    return cleared
  }

  /**
   * Get the number of cards in the waste
   */
  count(): number {
    return this.cards.length
  }
}
