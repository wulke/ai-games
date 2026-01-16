/**
 * Foundation class - represents one of the four foundation piles in Solitaire
 * Cards must be built up from Ace to King in the same suit
 */

import { Card, Suit, Rank } from '../Card'

export class Foundation {
  suit: Suit
  cards: Card[]

  constructor(suit: Suit) {
    this.suit = suit
    this.cards = []
  }

  /**
   * Check if the foundation is empty
   */
  isEmpty(): boolean {
    return this.cards.length === 0
  }

  /**
   * Get the top card of the foundation
   */
  topCard(): Card | undefined {
    return this.cards[this.cards.length - 1]
  }

  /**
   * Get the number of cards in the foundation
   */
  count(): number {
    return this.cards.length
  }

  /**
   * Check if a card can be added to this foundation
   */
  canAddCard(card: Card): boolean {
    // Must be the correct suit
    if (card.suit !== this.suit) {
      return false
    }

    // If empty, must be an Ace
    if (this.isEmpty()) {
      return card.rank === 'A'
    }

    // Must be the next rank in sequence
    const top = this.topCard()!
    return this.isNextRank(top.rank, card.rank)
  }

  /**
   * Add a card to the foundation
   * @throws Error if card cannot be added
   */
  addCard(card: Card): void {
    if (!this.canAddCard(card)) {
      throw new Error(`Cannot add ${card.rank} of ${card.suit} to ${this.suit} foundation`)
    }
    this.cards.push(card)
  }

  /**
   * Check if the foundation is complete (has all 13 cards A-K)
   */
  isComplete(): boolean {
    return this.cards.length === 13
  }

  /**
   * Check if cardRank is the next rank after currentRank
   */
  private isNextRank(currentRank: Rank, cardRank: Rank): boolean {
    const rankOrder: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    const currentIndex = rankOrder.indexOf(currentRank)
    const cardIndex = rankOrder.indexOf(cardRank)
    return cardIndex === currentIndex + 1
  }
}
