/**
 * Stock class - represents the draw pile in Solitaire
 * Players draw cards from the stock to the waste pile
 */

import { Card } from '../Card'

export class Stock {
  cards: Card[]

  constructor() {
    this.cards = []
  }

  /**
   * Check if the stock is empty
   */
  isEmpty(): boolean {
    return this.cards.length === 0
  }

  /**
   * Add cards to the stock (used during game setup)
   */
  addCards(cards: Card[]): void {
    this.cards.push(...cards)
  }

  /**
   * Draw cards from the stock
   * @param count Number of cards to draw (default 1)
   * @returns Array of drawn cards
   */
  draw(count: number = 1): Card[] {
    if (this.isEmpty()) {
      return []
    }

    const drawCount = Math.min(count, this.cards.length)
    return this.cards.splice(this.cards.length - drawCount, drawCount)
  }

  /**
   * Reset the stock with cards from waste (when stock is empty)
   * Cards are flipped face down and order is reversed
   */
  reset(cards: Card[]): void {
    this.cards = cards.map(card => {
      card.isFaceUp = false
      return card
    }).reverse()
  }

  /**
   * Get the number of cards in the stock
   */
  count(): number {
    return this.cards.length
  }
}
