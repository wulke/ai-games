import { describe, it, expect, beforeEach } from 'vitest';
import { HeartsGame } from '../src/models/hearts/HeartsGame';
import { Player } from '../src/models/Player';
import { Card } from '../src/models/Card';

describe('HeartsGame', () => {
  let game: HeartsGame;
  let players: Player[];

  beforeEach(() => {
    players = [
      new Player('1', 'Alice'),
      new Player('2', 'Bob'),
      // new Player('3', 'Charlie'),
      // new Player('4', 'David')
      // Actually MultiplayerGame needs the players array
    ];
    // Fill up to 4 players
    while (players.length < 4) {
      players.push(new Player((players.length + 1).toString(), `Player ${players.length + 1}`));
    }
    game = new HeartsGame(players);
  });

  it('should initialize with correct state', () => {
    expect(game.players.length).toBe(4);
    expect(game.phase).toBe('waiting');
    expect(game.passingDirection).toBe('left');
  });

  it('should deal 13 cards to each player', () => {
    game.start();
    game.players.forEach((p: Player) => {
      expect(p.hand.length).toBe(13);
    });
    expect(game.phase).toBe('passing');
  });

  it('should handle passing cards', () => {
    game.start();
    // Assuming game.passCards(playerId, cards[])
    const p1 = game.players[0];
    const cardsToPass = p1.hand.slice(0, 3);

    game.submitPass(p1.id, cardsToPass);
    expect(game.pendingPasses.get(p1.id)).toEqual(cardsToPass);
    expect(p1.hand.length).toBe(13); // Cards shouldn't be removed until all pass
  });

  it('should execute passes and transition to playing', () => {
    game.start();
    game.players.forEach((p: Player) => {
      game.submitPass(p.id, p.hand.slice(0, 3));
    });

    expect(game.phase).toBe('playing');
    game.players.forEach((p: Player) => {
      expect(p.hand.length).toBe(13);
    });
  });

  it('should identify the starting player (2 of Clubs)', () => {
    game.start();
    // Skip passing for test simplicity
    // We need to call determineStarter because we're skipping executePasses
    (game as any).determineStarter();
    game.phase = 'playing';

    // Manual setup for 2 of Clubs
    const starter = game.players.find((p: Player) => p.hand.some((c: Card) => c.suit === 'clubs' && c.rank === '2'));
    expect(game.getCurrentPlayer()).toBe(starter);
  });

  it('should validate 2 of Clubs as first lead', () => {
    game.start();
    game.phase = 'playing';
    (game as any).determineStarter();
    const starter = game.getCurrentPlayer();
    const twoOfClubs = starter.hand.find((c: Card) => c.suit === 'clubs' && c.rank === '2')!;
    const wrongCard = starter.hand.find((c: Card) => !(c.suit === 'clubs' && c.rank === '2'))!;

    expect(game.isValidMove(starter.id, wrongCard)).toBe(false);
    expect(game.isValidMove(starter.id, twoOfClubs)).toBe(true);
  });

  it('should resolve a trick and identify the winner', () => {
    game.start();
    (game as any).determineStarter();
    game.phase = 'playing';

    const players = game.players;
    const starterIndex = game.currentPlayerIndex;
    const starter = players[starterIndex];

    // Play a full trick
    for (let i = 0; i < 4; i++) {
      const currentPlayer = game.getCurrentPlayer();
      const leadSuit = game.currentTrick?.leadSuit;
      let cardToPlay: Card;

      if (i === 0) {
        cardToPlay = currentPlayer.hand.find((c: Card) => c.suit === 'clubs' && c.rank === '2')!;
      } else {
        cardToPlay = currentPlayer.hand.find((c: Card) => c.suit === leadSuit) || currentPlayer.hand[0];
      }

      game.playCard(currentPlayer.id, cardToPlay);
    }
    game.resolveTrick();

    // Trick should be resolved, new trick started or round ended
    expect(game.currentTrick?.playedCards.length).toBe(0);
  });

  it('should score hearts correctly', () => {
    game.start();
    (game as any).determineStarter();
    game.phase = 'playing';

    const p1 = game.players[0];
    const trick = (game as any).currentTrick;
    trick.addPlay(p1, new Card('hearts', 'A'));
    trick.addPlay(game.players[1], new Card('hearts', '2'));
    trick.addPlay(game.players[2], new Card('hearts', '3'));
    trick.addPlay(game.players[3], new Card('hearts', '4'));

    const points = (game as any).calculateTrickPoints(trick);
    expect(points).toBe(4);
  });

  it('should score Queen of Spades correctly', () => {
    game.start();
    (game as any).determineStarter();
    const p1 = game.players[0];
    const trick = (game as any).currentTrick;
    trick.addPlay(p1, new Card('spades', 'Q'));
    trick.addPlay(game.players[1], new Card('spades', '2'));

    const points = (game as any).calculateTrickPoints(trick);
    expect(points).toBe(13);
  });

  it('should detect "Shoot the Moon"', () => {
    game.start();
    (game as any).determineStarter();
    const shooter = game.players[0];
    (shooter as any).roundPoints = 26;
    game.players[1].score = 0;
    game.players[2].score = 0;
    game.players[3].score = 0;

    (game as any).calculateFinalScores();

    expect(shooter.score).toBe(0);
    expect(game.players[1].score).toBe(26);
    expect(game.players[2].score).toBe(26);
    expect(game.players[3].score).toBe(26);

    // Verify lastRoundResults
    expect(game.lastRoundResults.get(shooter.id)).toBe(0);
    expect(game.lastRoundResults.get(game.players[1].id)).toBe(26);
  });

  it('should reset hands and deal new cards on nextRound', () => {
    game.start();
    // Finish a round (simplified)
    game.players.forEach(p => p.clearHand());
    game.phase = 'scoring';

    game.nextRound();

    expect(game.roundNumber).toBe(2);
    expect(game.players[0].hand.length).toBe(13);
    expect(game.phase).toBe('passing');
    expect(game.passingDirection).toBe('right');
  });

  it('should not allow moves if trick is already full', () => {
    game.start();
    (game as any).determineStarter();
    game.phase = 'playing';

    // Simulate 4 cards played
    for (let i = 0; i < 4; i++) {
      game.currentTrick!.addPlay(game.players[i], game.players[i].hand[0]);
    }

    const nextPlayer = game.getCurrentPlayer();
    expect(game.isValidMove(nextPlayer.id, nextPlayer.hand[0])).toBe(false);
  });

  it('should clear currentTrick after round ends', () => {
    game.start();
    (game as any).determineStarter();
    game.players.forEach(p => p.clearHand());

    (game as any).endRound();

    expect(game.phase).toBe('scoring');
    expect(game.currentTrick).toBeNull();
  });
});
