/**
 * Card class - represents a single playing card
 */

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export class Card {
  suit: Suit
  rank: Rank
  isFaceUp: boolean

  constructor(suit: Suit, rank: Rank, isFaceUp: boolean = false) {
    this.suit = suit
    this.rank = rank
    this.isFaceUp = isFaceUp
  }

  flip(): void {
    this.isFaceUp = !this.isFaceUp
  }

  toString(): string {
    if (!this.isFaceUp) {
      return 'Face Down'
    }
    return `${this.rank} of ${this.suit}`
  }
}
