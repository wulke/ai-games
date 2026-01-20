/**
 * Tableau class - represents one of the seven tableau piles in Solitaire
 * Cards must be built down in descending rank with alternating colors
 */

import { Card } from '../Card'
import type { Rank } from '../Card'

export class Tableau {
  cards: Card[]

  constructor() {
    this.cards = []
  }

  /**
   * Check if the tableau is empty
   */
  isEmpty(): boolean {
    return this.cards.length === 0
  }

  /**
   * Get the top card of the tableau
   */
  topCard(): Card | undefined {
    return this.cards[this.cards.length - 1]
  }

  /**
   * Get the number of cards in the tableau
   */
  count(): number {
    return this.cards.length
  }

  /**
   * Add initial cards to the tableau (used during game setup)
   * Automatically flips the top card face up
   */
  addCards(cards: Card[]): void {
    this.cards.push(...cards)
    // Flip the top card face up
    if (this.cards.length > 0) {
      this.cards[this.cards.length - 1].isFaceUp = true
    }
  }

  /**
   * Check if a single card can be added to this tableau
   */
  canAddCard(card: Card): boolean {
    // If empty, only Kings can be placed
    if (this.isEmpty()) {
      return card.rank === 'K'
    }

    const top = this.topCard()!

    // Must be one rank lower
    if (!this.isOneLowerRank(top.rank, card.rank)) {
      return false
    }

    // Must be opposite color
    return this.isOppositeColor(top, card)
  }

  /**
   * Check if a sequence of cards can be added to this tableau
   */
  canAddCards(cards: Card[]): boolean {
    if (cards.length === 0) return false
    return this.canAddCard(cards[0])
  }

  /**
   * Add a single card to the tableau
   * @throws Error if card cannot be added
   */
  addCard(card: Card): void {
    if (!this.canAddCard(card)) {
      throw new Error(`Cannot add ${card.rank} of ${card.suit} to tableau`)
    }
    this.cards.push(card)
  }

  /**
   * Remove cards from the specified index to the end
   * Returns the removed cards and flips the new top card face up
   * @throws Error if index is invalid
   */
  removeCards(fromIndex: number): Card[] {
    if (fromIndex < 0 || fromIndex >= this.cards.length) {
      throw new Error(`Invalid index: ${fromIndex}`)
    }

    const removed = this.cards.splice(fromIndex)

    // Flip the new top card face up if there are cards remaining
    if (this.cards.length > 0) {
      this.cards[this.cards.length - 1].isFaceUp = true
    }

    return removed
  }

  /**
   * Get all face-up cards in sequence from the first face-up card
   */
  getFaceUpCards(): Card[] {
    const firstFaceUpIndex = this.cards.findIndex(card => card.isFaceUp)
    if (firstFaceUpIndex === -1) {
      return []
    }
    return this.cards.slice(firstFaceUpIndex)
  }

  /**
   * Check if cardRank is one rank lower than currentRank
   */
  private isOneLowerRank(currentRank: Rank, cardRank: Rank): boolean {
    const rankOrder: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    const currentIndex = rankOrder.indexOf(currentRank)
    const cardIndex = rankOrder.indexOf(cardRank)
    return cardIndex === currentIndex - 1
  }

  /**
   * Check if two cards have opposite colors (red vs black)
   */
  private isOppositeColor(card1: Card, card2: Card): boolean {
    const redSuits = ['hearts', 'diamonds']
    const card1IsRed = redSuits.includes(card1.suit)
    const card2IsRed = redSuits.includes(card2.suit)
    return card1IsRed !== card2IsRed
  }
}
