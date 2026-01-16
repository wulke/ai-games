/**
 * SolitaireGame class - Main game state manager for Klondike Solitaire
 * Coordinates all piles and manages game flow
 */

import { Deck } from '../Deck'
import { Foundation } from './Foundation'
import { Tableau } from './Tableau'
import { Stock } from './Stock'
import { Waste } from './Waste'
import type { Suit } from '../Card'

export interface GameState {
  foundations: Foundation[]
  tableau: Tableau[]
  stockCount: number
  wasteCount: number
  isWon: boolean
}

export class SolitaireGame {
  foundations: Foundation[]
  tableau: Tableau[]
  stock: Stock
  waste: Waste
  private deck: Deck

  constructor() {
    // Initialize 4 foundation piles (one for each suit)
    this.foundations = [
      new Foundation('hearts'),
      new Foundation('diamonds'),
      new Foundation('clubs'),
      new Foundation('spades')
    ]

    // Initialize 7 tableau piles
    this.tableau = Array.from({ length: 7 }, () => new Tableau())

    // Initialize stock and waste
    this.stock = new Stock()
    this.waste = new Waste()

    // Initialize deck
    this.deck = new Deck()
  }

  /**
   * Start a new game
   * Shuffles deck and deals cards to tableau and stock
   */
  newGame(): void {
    // Reset all piles
    this.foundations.forEach(f => f.cards = [])
    this.tableau.forEach(t => t.cards = [])
    this.stock.cards = []
    this.waste.cards = []

    // Shuffle deck
    this.deck.reset()
    this.deck.shuffle()

    // Deal cards to tableau
    // Pile 1 gets 1 card, pile 2 gets 2 cards, ..., pile 7 gets 7 cards
    for (let i = 0; i < 7; i++) {
      const cards = []
      for (let j = 0; j <= i; j++) {
        const card = this.deck.draw()
        if (card) {
          cards.push(card)
        }
      }
      this.tableau[i].addCards(cards)
    }

    // Remaining cards go to stock
    const remainingCards = []
    let card = this.deck.draw()
    while (card) {
      remainingCards.push(card)
      card = this.deck.draw()
    }
    this.stock.addCards(remainingCards)
  }

  /**
   * Check if the game is won
   * Game is won when all 4 foundations are complete
   */
  isWon(): boolean {
    return this.foundations.every(f => f.isComplete())
  }

  /**
   * Get the current game state
   */
  getGameState(): GameState {
    return {
      foundations: this.foundations,
      tableau: this.tableau,
      stockCount: this.stock.count(),
      wasteCount: this.waste.count(),
      isWon: this.isWon()
    }
  }
}
