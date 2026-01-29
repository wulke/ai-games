import { CPUPlayer } from '../CPUPlayer';
import { Card } from '../Card';
import { HeartsGame } from './HeartsGame';

export class HeartsAI extends CPUPlayer {
  async choosePassCards(): Promise<Card[]> {
    // Basic AI pass logic: pass highest value cards
    const sortedHand = [...this.hand].sort((a, b) => {
      // Prioritize passing Queen of Spades
      if (a.suit === 'spades' && a.rank === 'Q') return -1;
      if (b.suit === 'spades' && b.rank === 'Q') return 1;

      // Then high hearts
      if (a.suit === 'hearts' && b.suit !== 'hearts') return -1;
      if (a.suit !== 'hearts' && b.suit === 'hearts') return 1;

      // Then general rank
      return this.getRankValue(b.rank) - this.getRankValue(a.rank);
    });

    return sortedHand.slice(0, 3);
  }

  async choosePlayCard(game: HeartsGame): Promise<Card> {
    const validMoves = this.hand.filter(c => game.isValidMove(this.id, c));

    // Basic AI play logic: try to play the highest card of the led suit that won't win the trick
    // if it contains points, or just play low.
    const leadSuit = game.currentTrick?.leadSuit;

    if (!leadSuit) {
      // Leading: try to lead low non-hearts
      const nonHearts = validMoves.filter(c => c.suit !== 'hearts');
      if (nonHearts.length > 0) {
        return nonHearts.sort((a, b) => this.getRankValue(a.rank) - this.getRankValue(b.rank))[0];
      }
      return validMoves.sort((a, b) => this.getRankValue(a.rank) - this.getRankValue(b.rank))[0];
    }

    // Following: try to stay under the current winner if points are involved
    const sortedMoves = validMoves.sort((a, b) => this.getRankValue(b.rank) - this.getRankValue(a.rank));

    // For now, just play the lowest valid card to be safe
    return sortedMoves[sortedMoves.length - 1];
  }

  private getRankValue(rank: string): number {
    const values: Record<string, number> = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };
    return values[rank] || 0;
  }
}
