/**
 * Move types and interfaces for Solitaire game moves
 */

import type { Card } from '../Card'

export const MoveType = {
  DRAW_STOCK: 'DRAW_STOCK',
  WASTE_TO_TABLEAU: 'WASTE_TO_TABLEAU',
  WASTE_TO_FOUNDATION: 'WASTE_TO_FOUNDATION',
  TABLEAU_TO_FOUNDATION: 'TABLEAU_TO_FOUNDATION',
  TABLEAU_TO_TABLEAU: 'TABLEAU_TO_TABLEAU',
  FOUNDATION_TO_TABLEAU: 'FOUNDATION_TO_TABLEAU'
} as const

export type MoveType = typeof MoveType[keyof typeof MoveType]

export interface Move {
  type: MoveType
  from?: number
  to?: number
  cardIndex?: number
  cards?: Card[]
  drawnCards?: Card[]
}
