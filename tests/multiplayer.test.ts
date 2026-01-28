import { describe, it, expect, beforeEach } from 'vitest';
import { Player } from '../src/models/Player';
import { CPUPlayer } from '../src/models/CPUPlayer';
import { Trick } from '../src/models/Trick';
import { MultiplayerGame } from '../src/models/MultiplayerGame';
import { Card } from '../src/models/Card';

// Mock implementation of MultiplayerGame
class MockGame extends MultiplayerGame {
  start(): void {
    this.status = 'playing';
    this.deal(5);
  }
}

describe('Multi-Player Framework', () => {
  describe('Player & CPUPlayer', () => {
    it('should initialize a player correctly', () => {
      const player = new Player('p1', 'Alice');
      expect(player.id).toBe('p1');
      expect(player.name).toBe('Alice');
      expect(player.hand).toEqual([]);
      expect(player.score).toBe(0);
    });

    it('should add and remove cards from hand', () => {
      const player = new Player('p1', 'Alice');
      const card = new Card('hearts', 'A');
      player.addCard(card);
      expect(player.hand.length).toBe(1);
      player.removeCard(card);
      expect(player.hand.length).toBe(0);
    });

    it('should track scores', () => {
      const player = new Player('p1', 'Alice');
      player.addPoints(10);
      expect(player.score).toBe(10);
      player.resetScore();
      expect(player.score).toBe(0);
    });

    it('should initialize a CPU player', () => {
      const cpu = new CPUPlayer('c1', 'Bot', 'hard');
      expect(cpu.name).toBe('Bot');
      expect(cpu.difficulty).toBe('hard');
    });
  });

  describe('Trick', () => {
    let trick: Trick;
    let p1: Player, p2: Player, p3: Player, p4: Player;

    beforeEach(() => {
      trick = new Trick();
      p1 = new Player('1', 'P1');
      p2 = new Player('2', 'P2');
      p3 = new Player('3', 'P3');
      p4 = new Player('4', 'P4');
    });

    it('should track lead suit', () => {
      trick.addPlay(p1, new Card('clubs', '2'));
      expect(trick.leadSuit).toBe('clubs');
      trick.addPlay(p2, new Card('hearts', 'A'));
      expect(trick.leadSuit).toBe('clubs'); // Lead suit stays the same
    });

    it('should determine winner by rank in same suit', () => {
      trick.addPlay(p1, new Card('spades', '10'));
      trick.addPlay(p2, new Card('spades', 'J'));
      trick.addPlay(p3, new Card('spades', '9'));
      expect(trick.getWinner()).toBe(p2);
    });

    it('should ignore other suits if no trump is set', () => {
      trick.addPlay(p1, new Card('diamonds', 'K'));
      trick.addPlay(p2, new Card('hearts', 'A'));
      trick.addPlay(p3, new Card('diamonds', '2'));
      expect(trick.getWinner()).toBe(p1); // P1 led diamonds
    });

    it('should respect trump suit', () => {
      trick = new Trick('hearts');
      trick.addPlay(p1, new Card('spades', 'A'));
      trick.addPlay(p2, new Card('hearts', '2')); // Trump!
      trick.addPlay(p3, new Card('spades', 'K'));
      expect(trick.getWinner()).toBe(p2);
    });

    it('should handle multiple trumps by rank', () => {
      trick = new Trick('hearts');
      trick.addPlay(p1, new Card('hearts', '10'));
      trick.addPlay(p2, new Card('hearts', 'Q'));
      trick.addPlay(p3, new Card('spades', 'A'));
      expect(trick.getWinner()).toBe(p2);
    });
  });

  describe('MultiplayerGame', () => {
    let game: MockGame;
    let players: Player[];

    beforeEach(() => {
      players = [
        new Player('1', 'P1'),
        new Player('2', 'P2'),
        new Player('3', 'P3')
      ];
      game = new MockGame(players);
    });

    it('should cycle turns correctly', () => {
      expect(game.currentPlayerIndex).toBe(0);
      game.nextTurn();
      expect(game.currentPlayerIndex).toBe(1);
      game.nextTurn();
      expect(game.currentPlayerIndex).toBe(2);
      game.nextTurn();
      expect(game.currentPlayerIndex).toBe(0);
    });

    it('should deal cards to all players', () => {
      game.start();
      players.forEach(p => {
        expect(p.hand.length).toBe(5);
      });
      expect(game.deck.cards.length).toBe(52 - (3 * 5));
    });

    it('should reset the game', () => {
      game.start();
      game.reset();
      expect(game.status).toBe('waiting');
      expect(players[0].hand.length).toBe(0);
      expect(game.deck.cards.length).toBe(52);
    });
  });
});
