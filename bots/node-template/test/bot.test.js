import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app, { calculateMove } from '../index.js';

describe('Bot Template Core Logic', () => {
  it('calculateMove should return a valid move from the list', () => {
    const game = 'hearts';
    const state = {};
    const validMoves = [
      { suit: 'H', rank: '10' },
      { suit: 'S', rank: 'Q' }
    ];

    const result = calculateMove(game, state, validMoves);

    expect(validMoves).toContainEqual(result);
  });
});

describe('Bot Template API', () => {
  it('GET /health should return 200 and ok status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', engine: 'node-bot-template' });
  });

  it('POST /move should return a valid move', async () => {
    const payload = {
      game: 'hearts',
      playerIndex: 1,
      validMoves: [{ suit: 'C', rank: '2' }],
      state: {}
    };

    const response = await request(app)
      .post('/move')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.move).toEqual({ suit: 'C', rank: '2' });
  });

  it('POST /move should return 400 if no valid moves provided', async () => {
    const payload = {
      game: 'hearts',
      playerIndex: 1,
      validMoves: [],
      state: {}
    };

    const response = await request(app)
      .post('/move')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});
