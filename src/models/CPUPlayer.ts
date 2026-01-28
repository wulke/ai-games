import { Player } from './Player';

export class CPUPlayer extends Player {
  difficulty: 'easy' | 'medium' | 'hard';

  constructor(id: string, name: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    super(id, name);
    this.difficulty = difficulty;
  }

  // Placeholder for AI logic
  async performMove(gameState: any): Promise<any> {
    console.log(`${this.name} (${this.difficulty}) is thinking...`);
    // Concrete implementations will override this
    return null;
  }
}
