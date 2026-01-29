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

  static sort(cards: Card[]): Card[] {
    const SUIT_ORDER: Record<Suit, number> = {
      'clubs': 0,
      'diamonds': 1,
      'spades': 2,
      'hearts': 3
    };

    const RANK_ORDER: Record<Rank, number> = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };

    return [...cards].sort((a, b) => {
      if (a.suit !== b.suit) {
        return SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit];
      }
      return RANK_ORDER[a.rank] - RANK_ORDER[b.rank];
    });
  }
}
