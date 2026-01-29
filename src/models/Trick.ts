import { Card } from './Card';
import type { Suit, Rank } from './Card';
import { Player } from './Player';

export interface PlayedCard {
  player: Player;
  card: Card;
}

export class Trick {
  playedCards: PlayedCard[];
  leadSuit: Suit | null;
  trumpSuit: Suit | null;

  constructor(trumpSuit: Suit | null = null) {
    this.playedCards = [];
    this.leadSuit = null;
    this.trumpSuit = trumpSuit;
  }

  addPlay(player: Player, card: Card): void {
    if (this.playedCards.length === 0) {
      this.leadSuit = card.suit;
    }
    this.playedCards.push({ player, card });
  }

  getWinner(): Player | null {
    if (this.playedCards.length === 0) return null;

    let winningPlay = this.playedCards[0];

    for (let i = 1; i < this.playedCards.length; i++) {
      const currentPlay = this.playedCards[i];

      // If trump is played
      if (this.trumpSuit) {
        if (currentPlay.card.suit === this.trumpSuit && winningPlay.card.suit !== this.trumpSuit) {
          winningPlay = currentPlay;
          continue;
        }
        if (currentPlay.card.suit === this.trumpSuit && winningPlay.card.suit === this.trumpSuit) {
          if (this.compareRanks(currentPlay.card.rank, winningPlay.card.rank) > 0) {
            winningPlay = currentPlay;
          }
          continue;
        }
      }

      // If no trump or same suit as winner
      if (currentPlay.card.suit === winningPlay.card.suit) {
        if (this.compareRanks(currentPlay.card.rank, winningPlay.card.rank) > 0) {
          winningPlay = currentPlay;
        }
      }
    }

    return winningPlay.player;
  }

  private compareRanks(a: Rank, b: Rank): number {
    const rankOrder: Record<Rank, number> = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };
    return rankOrder[a] - rankOrder[b];
  }

  clear(): void {
    this.playedCards = [];
    this.leadSuit = null;
  }
}
