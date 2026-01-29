import { MultiplayerGame } from '../MultiplayerGame';
import { Player } from '../Player';
import { Card } from '../Card';
import { Trick } from '../Trick';

export type HeartsPhase = 'waiting' | 'dealing' | 'passing' | 'playing' | 'scoring' | 'ended';
export type PassingDirection = 'left' | 'right' | 'across' | 'none';

export class HeartsGame extends MultiplayerGame {
  phase: HeartsPhase;
  passingDirection: PassingDirection;
  pendingPasses: Map<string, Card[]>;
  currentTrick: Trick | null;
  heartsBroken: boolean;
  roundNumber: number;
  lastRoundResults: Map<string, number>;
  takenCards: Map<string, Card[]>;

  constructor(players: Player[]) {
    super(players);
    this.phase = 'waiting';
    this.passingDirection = 'left';
    this.pendingPasses = new Map();
    this.currentTrick = null;
    this.heartsBroken = false;
    this.roundNumber = 1;
    this.lastRoundResults = new Map();
    this.takenCards = new Map();
  }

  start(): void {
    this.deck.reset();
    this.players.forEach(p => p.clearHand());

    this.phase = 'dealing';
    this.deal(13);
    this.updatePassingDirection();

    if (this.passingDirection === 'none') {
      this.phase = 'playing';
      this.determineStarter();
    } else {
      this.phase = 'passing';
    }
  }

  submitPass(playerId: string, cards: Card[]): void {
    if (this.phase !== 'passing') return;
    if (cards.length !== 3) return;

    this.pendingPasses.set(playerId, cards);

    if (this.pendingPasses.size === this.players.length) {
      this.executePasses();
    }
  }

  private executePasses(): void {
    // Basic logic for passing - simplified for initial implementation
    this.players.forEach(player => {
      const passedCards = this.pendingPasses.get(player.id)!;
      passedCards.forEach(c => player.removeCard(c));
    });

    this.players.forEach((player, index) => {
      let targetIndex: number;
      switch (this.passingDirection) {
        case 'left': targetIndex = (index + 1) % 4; break;
        case 'right': targetIndex = (index + 3) % 4; break;
        case 'across': targetIndex = (index + 2) % 4; break;
        default: targetIndex = index;
      }

      const passedCards = this.pendingPasses.get(player.id)!;
      passedCards.forEach(c => this.players[targetIndex].addCard(c));
    });

    this.pendingPasses.clear();
    this.phase = 'playing';
    this.determineStarter();
  }

  private determineStarter(): void {
    const starterIndex = this.players.findIndex(p =>
      p.hand.some(c => c.suit === 'clubs' && c.rank === '2')
    );
    this.currentPlayerIndex = starterIndex;
    this.currentTrick = new Trick();
  }

  isValidMove(playerId: string, card: Card): boolean {
    if (this.phase !== 'playing') return false;
    const player = this.players.find(p => p.id === playerId);
    if (!player) return false;

    // Block if trick is already full (waiting for resolution)
    if (this.currentTrick && this.currentTrick.playedCards.length >= this.players.length) {
      return false;
    }

    // First trick of the round
    const isFirstTrick = player.hand.length === 13;
    const isFirstCardOfTrick = (this.currentTrick?.playedCards.length ?? 0) === 0;

    if (isFirstTrick && isFirstCardOfTrick) {
      return card.suit === 'clubs' && card.rank === '2';
    }

    if (isFirstCardOfTrick) {
      if (card.suit === 'hearts' && !this.heartsBroken) {
        // Can only lead hearts if only hearts are left
        return !player.hand.some(c => c.suit !== 'hearts');
      }
      return true;
    }

    const leadSuit = this.currentTrick!.leadSuit;
    if (card.suit !== leadSuit) {
      // Must follow suit if possible
      const hasLeadSuit = player.hand.some(c => c.suit === leadSuit);
      if (hasLeadSuit) return false;

      // Special rule for first trick: no points allowed
      if (isFirstTrick) {
        if (card.suit === 'hearts' || (card.suit === 'spades' && card.rank === 'Q')) {
          // Exceptions: if only points are left (rare but possible in some variants, usually impossible)
          const onlyPointsLeft = !player.hand.some(c =>
            c.suit !== 'hearts' && !(c.suit === 'spades' && c.rank === 'Q')
          );
          return onlyPointsLeft;
        }
      }
    }

    return true;
  }

  playCard(playerId: string, card: Card): void {
    if (!this.isValidMove(playerId, card)) {
      throw new Error('Invalid move');
    }

    const player = this.players.find(p => p.id === playerId);
    if (!player) return;

    player.removeCard(card);
    this.currentTrick!.addPlay(player, card);

    if (card.suit === 'hearts') {
      this.heartsBroken = true;
    }

    if (this.currentTrick!.playedCards.length !== this.players.length) {
      this.nextTurn();
    }
  }

  isTrickFull(): boolean {
    return (this.currentTrick?.playedCards.length || 0) >= this.players.length;
  }

  resolveTrick(): void {
    if (!this.currentTrick || this.currentTrick.playedCards.length !== this.players.length) {
      return;
    }

    const winner = this.currentTrick.getWinner();
    if (!winner) return;

    // In Hearts, the winner of the trick leads the next one
    this.currentPlayerIndex = this.players.indexOf(winner);

    // Cards remain "in the trick" for now or we can move them to a 'takenCards' pile
    // For scoring, we just need to track points taken per player this round
    const pointsInTrick = this.calculateTrickPoints(this.currentTrick!);
    (winner as any).roundPoints = ((winner as any).roundPoints || 0) + pointsInTrick;

    // Track which cards were taken by this player
    const existingTaken = this.takenCards.get(winner.id) || [];
    this.takenCards.set(winner.id, [...existingTaken, ...this.currentTrick.playedCards.map(pc => pc.card)]);

    if (winner.hand.length === 0) {
      this.endRound();
    } else {
      this.currentTrick = new Trick();
    }
  }

  private calculateTrickPoints(trick: Trick): number {
    let points = 0;
    trick.playedCards.forEach(pc => {
      if (pc.card.suit === 'hearts') points += 1;
      if (pc.card.suit === 'spades' && pc.card.rank === 'Q') points += 13;
    });
    return points;
  }

  private endRound(): void {
    this.phase = 'scoring';
    this.currentTrick = null; // Clear the board for scoring
    this.calculateFinalScores();

    // Check if game ended (usually 100 points)
    if (this.players.some(p => p.score >= 100)) {
      this.phase = 'ended';
    }
  }

  nextRound(): void {
    if (this.phase !== 'scoring') return;

    this.roundNumber++;
    this.players.forEach(p => (p as any).roundPoints = 0);
    this.takenCards.clear();
    this.heartsBroken = false;
    this.start();
  }

  private calculateFinalScores(): void {
    let moonShooter: Player | null = null;
    this.players.forEach(p => {
      if ((p as any).roundPoints === 26) {
        moonShooter = p;
      }
    });

    if (moonShooter) {
      this.players.forEach(p => {
        if (p === moonShooter) {
          this.lastRoundResults.set(p.id, 0);
        } else {
          p.addPoints(26);
          this.lastRoundResults.set(p.id, 26);
        }
      });
    } else {
      this.players.forEach(p => {
        const pts = (p as any).roundPoints || 0;
        p.addPoints(pts);
        this.lastRoundResults.set(p.id, pts);
      });
    }
  }

  private updatePassingDirection(): void {
    const directions: PassingDirection[] = ['left', 'right', 'across', 'none'];
    this.passingDirection = directions[(this.roundNumber - 1) % 4];
  }
}
