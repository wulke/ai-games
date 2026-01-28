import { Card } from './Card';

export class Player {
  id: string;
  name: string;
  hand: Card[];
  score: number;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.hand = [];
    this.score = 0;
  }

  addCard(card: Card): void {
    this.hand.push(card);
  }

  removeCard(card: Card): void {
    const index = this.hand.findIndex(c => c.suit === card.suit && c.rank === card.rank);
    if (index !== -1) {
      this.hand.splice(index, 1);
    }
  }

  clearHand(): void {
    this.hand = [];
  }

  addPoints(points: number): void {
    this.score += points;
  }

  resetScore(): void {
    this.score = 0;
  }
}
