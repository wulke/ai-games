import { Player } from './Player';
import { Deck } from './Deck';

export abstract class MultiplayerGame {
  players: Player[];
  currentPlayerIndex: number;
  deck: Deck;
  status: 'waiting' | 'playing' | 'ended';

  constructor(players: Player[]) {
    this.players = players;
    this.currentPlayerIndex = 0;
    this.deck = new Deck();
    this.status = 'waiting';
  }

  abstract start(): void;

  nextTurn(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  deal(cardsPerPlayer: number): void {
    this.deck.shuffle();
    for (let i = 0; i < cardsPerPlayer; i++) {
      for (const player of this.players) {
        const card = this.deck.draw();
        if (card) {
          player.addCard(card);
        }
      }
    }
  }

  reset(): void {
    for (const player of this.players) {
      player.clearHand();
    }
    this.deck = new Deck();
    this.currentPlayerIndex = 0;
    this.status = 'waiting';
  }
}
