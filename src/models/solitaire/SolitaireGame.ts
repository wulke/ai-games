/**
 * SolitaireGame class - Main game state manager for Klondike Solitaire
 * Coordinates all piles and manages game flow
 */

import { Deck } from '../Deck'
import { Foundation } from './Foundation'
import { Tableau } from './Tableau'
import { Stock } from './Stock'
import { Waste } from './Waste'
import type { Card } from '../Card'
import { MoveType, type Move } from './Move'

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
  moveHistory: Move[]
  redoStack: Move[]
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

    // Initialize move history
    this.moveHistory = []
    this.redoStack = []

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

  /**
   * Draw cards from stock to waste (3 at a time)
   * If stock is empty, reset from waste
   */
  drawFromStock(): boolean {
    // If stock is empty, try to reset from waste
    if (this.stock.isEmpty()) {
      if (this.waste.isEmpty()) {
        return false
      }
      const wasteCards = this.waste.clear()
      this.stock.reset(wasteCards)
      this.recordMove({ type: MoveType.DRAW_STOCK, drawnCards: [] })
      return true
    }

    // Draw up to 3 cards
    const drawn = this.stock.draw(3)
    this.waste.addCards(drawn)
    this.recordMove({ type: MoveType.DRAW_STOCK, drawnCards: drawn })
    return true
  }

  /**
   * Move top card from waste to tableau pile
   */
  moveWasteToTableau(tableauIndex: number): boolean {
    if (this.waste.isEmpty()) return false

    const card = this.waste.topCard()!
    if (!this.tableau[tableauIndex].canAddCard(card)) {
      return false
    }

    const movedCard = this.waste.removeTopCard()!
    this.tableau[tableauIndex].addCard(movedCard)
    this.recordMove({
      type: MoveType.WASTE_TO_TABLEAU,
      to: tableauIndex,
      cards: [movedCard]
    })
    return true
  }

  /**
   * Move top card from waste to foundation pile
   */
  moveWasteToFoundation(foundationIndex: number): boolean {
    if (this.waste.isEmpty()) return false

    const card = this.waste.topCard()!
    if (!this.foundations[foundationIndex].canAddCard(card)) {
      return false
    }

    const movedCard = this.waste.removeTopCard()!
    this.foundations[foundationIndex].addCard(movedCard)
    this.recordMove({
      type: MoveType.WASTE_TO_FOUNDATION,
      to: foundationIndex,
      cards: [movedCard]
    })
    return true
  }

  /**
   * Move top card from tableau to foundation
   */
  moveTableauToFoundation(tableauIndex: number, foundationIndex: number): boolean {
    if (this.tableau[tableauIndex].isEmpty()) return false

    const card = this.tableau[tableauIndex].topCard()!
    if (!card.isFaceUp) return false
    if (!this.foundations[foundationIndex].canAddCard(card)) {
      return false
    }

    const movedCards = this.tableau[tableauIndex].removeCards(this.tableau[tableauIndex].count() - 1)
    this.foundations[foundationIndex].addCard(movedCards[0])
    this.recordMove({
      type: MoveType.TABLEAU_TO_FOUNDATION,
      from: tableauIndex,
      to: foundationIndex,
      cards: movedCards
    })
    return true
  }

  /**
   * Move card(s) from one tableau pile to another
   */
  moveTableauToTableau(fromIndex: number, toIndex: number, cardIndex: number): boolean {
    if (this.tableau[fromIndex].isEmpty()) return false

    // Get cards from cardIndex to end
    const cards = this.tableau[fromIndex].cards.slice(cardIndex)

    // Check if first card is face up
    if (!cards[0].isFaceUp) return false

    // Check if can add to destination
    if (!this.tableau[toIndex].canAddCards(cards)) {
      return false
    }

    // Remove cards from source
    const movedCards = this.tableau[fromIndex].removeCards(cardIndex)

    // Add to destination
    movedCards.forEach(card => this.tableau[toIndex].addCard(card))

    this.recordMove({
      type: MoveType.TABLEAU_TO_TABLEAU,
      from: fromIndex,
      to: toIndex,
      cardIndex,
      cards: movedCards
    })
    return true
  }

  /**
   * Undo the last move
   */
  undo(): boolean {
    if (this.moveHistory.length === 0) return false

    const move = this.moveHistory.pop()!
    this.redoStack.push(move)

    // Reverse the move
    switch (move.type) {
      case MoveType.DRAW_STOCK:
        if (move.drawnCards && move.drawnCards.length > 0) {
          // Remove cards from waste and return to stock
          for (let i = 0; i < move.drawnCards.length; i++) {
            this.waste.removeTopCard()
          }
          move.drawnCards.reverse().forEach(card => this.stock.cards.push(card))
        } else {
          // Was a reset, reverse it
          const stockCards = this.stock.cards.splice(0)
          stockCards.reverse().forEach(card => {
            card.isFaceUp = true
            this.waste.cards.push(card)
          })
        }
        break

      case MoveType.WASTE_TO_TABLEAU:
        const card1 = this.tableau[move.to!].removeCards(this.tableau[move.to!].count() - 1)[0]
        this.waste.addCards([card1])
        break

      case MoveType.WASTE_TO_FOUNDATION:
        const card2 = this.foundations[move.to!].cards.pop()!
        this.waste.addCards([card2])
        break

      case MoveType.TABLEAU_TO_FOUNDATION:
        const card3 = this.foundations[move.to!].cards.pop()!
        this.tableau[move.from!].addCard(card3)
        break

      case MoveType.TABLEAU_TO_TABLEAU:
        const cards = this.tableau[move.to!].removeCards(this.tableau[move.to!].count() - move.cards!.length)
        cards.forEach(card => this.tableau[move.from!].addCard(card))
        break
    }

    return true
  }

  /**
   * Redo the last undone move
   */
  redo(): boolean {
    if (this.redoStack.length === 0) return false

    const move = this.redoStack.pop()!

    // Re-execute the move
    switch (move.type) {
      case MoveType.DRAW_STOCK:
        this.drawFromStock()
        break
      case MoveType.WASTE_TO_TABLEAU:
        this.moveWasteToTableau(move.to!)
        break
      case MoveType.WASTE_TO_FOUNDATION:
        this.moveWasteToFoundation(move.to!)
        break
      case MoveType.TABLEAU_TO_FOUNDATION:
        this.moveTableauToFoundation(move.from!, move.to!)
        break
      case MoveType.TABLEAU_TO_TABLEAU:
        this.moveTableauToTableau(move.from!, move.to!, move.cardIndex!)
        break
    }

    return true
  }

  /**
   * Check if any cards can be auto-moved to foundation
   */
  canAutoMove(): boolean {
    // Check waste pile
    if (!this.waste.isEmpty()) {
      const card = this.waste.topCard()!
      for (const foundation of this.foundations) {
        if (foundation.canAddCard(card)) {
          return true
        }
      }
    }

    // Check tableau piles
    for (const tableau of this.tableau) {
      if (!tableau.isEmpty()) {
        const card = tableau.topCard()!
        if (card.isFaceUp) {
          for (const foundation of this.foundations) {
            if (foundation.canAddCard(card)) {
              return true
            }
          }
        }
      }
    }

    return false
  }

  /**
   * Automatically move all eligible cards to foundations
   * Returns number of cards moved
   */
  autoMove(): number {
    let moved = 0
    let foundMove = true

    while (foundMove) {
      foundMove = false

      // Try waste pile
      if (!this.waste.isEmpty()) {
        const card = this.waste.topCard()!
        for (let i = 0; i < this.foundations.length; i++) {
          if (this.foundations[i].canAddCard(card)) {
            this.moveWasteToFoundation(i)
            moved++
            foundMove = true
            break
          }
        }
      }

      if (foundMove) continue

      // Try tableau piles
      for (let t = 0; t < this.tableau.length; t++) {
        if (!this.tableau[t].isEmpty()) {
          const card = this.tableau[t].topCard()!
          if (card.isFaceUp) {
            for (let f = 0; f < this.foundations.length; f++) {
              if (this.foundations[f].canAddCard(card)) {
                this.moveTableauToFoundation(t, f)
                moved++
                foundMove = true
                break
              }
            }
          }
        }
        if (foundMove) break
      }
    }

    return moved
  }

  /**
   * Record a move in history
   */
  private recordMove(move: Move): void {
    this.moveHistory.push(move)
    // Clear redo stack when new move is made
    this.redoStack = []
  }
}
