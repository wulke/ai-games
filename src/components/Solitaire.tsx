import React, { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useSolitaire } from '../hooks/useSolitaire'
import '../style/solitaire.css'

interface DragData {
  type: 'waste' | 'tableau' | 'foundation'
  index: number
  cardIndex?: number
}

interface DroppablePileProps {
  id: string
  type: string
  index: number
  className?: string
  children: React.ReactNode
}

const DroppablePile: React.FC<DroppablePileProps> = ({ id, type, index, className, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { type, index }
  })

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? 'drag-over' : ''}`}
    >
      {children}
    </div>
  )
}

interface DraggableCardProps {
  id: string
  data: DragData
  className?: string
  style?: React.CSSProperties
  src: string
  alt: string
  disabled?: boolean
  forceHidden?: boolean
}

const DraggableCard: React.FC<DraggableCardProps> = ({ id, data, className, style, src, alt, disabled, forceHidden }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data,
    disabled
  })

  const combinedStyle: React.CSSProperties = {
    ...style,
    visibility: (isDragging || forceHidden) ? 'hidden' : 'visible',
    zIndex: isDragging ? 1000 : style?.zIndex,
    cursor: disabled ? 'default' : 'grab'
  }

  return (
    <img
      ref={setNodeRef}
      className={className}
      src={src}
      alt={alt}
      style={combinedStyle}
      {...listeners}
      {...attributes}
    />
  )
}

const Solitaire: React.FC = () => {
  const {
    game,
    stats,
    isGameWon,
    newGame,
    draw,
    undo,
    autoMove,
    getCardUrl,
    handleMoveSuccess
  } = useSolitaire()

  const [activeDrag, setActiveDrag] = useState<DragData | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveDrag(active.data.current as DragData)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDrag(null)

    if (!over || !game) return

    const from = active.data.current as DragData
    const to = over.data.current as { type: string; index: number }

    let success = false

    if (from.type === 'waste' && to.type === 'tableau') {
      success = game.moveWasteToTableau(to.index)
    } else if (from.type === 'waste' && to.type === 'foundation') {
      success = game.moveWasteToFoundation(to.index)
    } else if (from.type === 'tableau' && to.type === 'tableau') {
      success = game.moveTableauToTableau(from.index, to.index, from.cardIndex!)
    } else if (from.type === 'tableau' && to.type === 'foundation') {
      success = game.moveTableauToFoundation(from.index, to.index)
    }

    if (success) {
      handleMoveSuccess()
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div id="solitaire-app" className="solitaire-container">
        <div className="game-header">
          <h1>Klondike Solitaire</h1>
          <div className="game-stats">
            <span>Score: <span>{stats.score}</span></span>
            <span>Time: <span>{stats.elapsedTime}</span></span>
          </div>
        </div>

        {game && (
          <div className="board">
            <div className="top-row">
              <div className="stock-waste">
                <div id="stock-pile" className="pile-slot stock" onClick={draw}>
                  {game.stock.cards.length > 0 && (
                    <img className="card" src="/cards/Red_Back.svg" alt="Stock Pile" />
                  )}
                </div>
                <DroppablePile
                  id="waste-pile"
                  type="waste"
                  index={0}
                  className="pile-slot waste hhand-compact"
                >
                  {game.waste.cards.slice(-3).map((card, idx) => {
                    const globalIndex = game.waste.cards.length - (game.waste.cards.slice(-3).length - idx);
                    const isTopCard = globalIndex === game.waste.cards.length - 1;
                    return (
                      <DraggableCard
                        key={`${card.suit}-${card.rank}-${globalIndex}`}
                        id={`waste-${globalIndex}`}
                        data={{ type: 'waste', index: 0, cardIndex: globalIndex }}
                        className="card"
                        src={getCardUrl(card)}
                        alt={`${card.rank} of ${card.suit}`}
                        style={{ zIndex: idx, left: `calc(${idx} * var(--fan-offset-h))`, top: 0 }}
                        disabled={!isTopCard}
                      />
                    );
                  })}
                </DroppablePile>
              </div>
              <div className="foundations">
                {game.foundations.map((foundation, fIndex) => (
                  <DroppablePile
                    key={fIndex}
                    id={`foundation-${fIndex}`}
                    type="foundation"
                    index={fIndex}
                    className={`pile-slot foundation foundation-${['hearts', 'diamonds', 'clubs', 'spades'][fIndex]}`}
                  >
                    {foundation.cards.length > 0 && (
                      <DraggableCard
                        id={`foundation-card-${fIndex}`}
                        data={{ type: 'foundation', index: fIndex }}
                        className="card"
                        src={getCardUrl(foundation.topCard())}
                        alt="Foundation Top Card"
                      />
                    )}
                  </DroppablePile>
                ))}
              </div>
            </div>

            <div className="tableau">
              {game.tableau.map((pile, tIndex) => (
                <DroppablePile
                  key={tIndex}
                  id={`tableau-${tIndex}`}
                  type="tableau"
                  index={tIndex}
                  className="pile-slot tableau-pile vhand-compact"
                >
                  {pile.cards.map((card, cIndex) => {
                    const isPartofActiveStack =
                      activeDrag?.type === 'tableau' &&
                      activeDrag.index === tIndex &&
                      cIndex >= activeDrag.cardIndex!

                    const faceDownCount = pile.cards.filter((c, i) => i < cIndex && !c.isFaceUp).length
                    const faceUpCount = pile.cards.filter((c, i) => i < cIndex && c.isFaceUp).length

                    const calcTop = `calc(${faceDownCount} * var(--fan-offset-v-closed) + ${faceUpCount} * var(--fan-offset-v))`

                    return (
                      <DraggableCard
                        key={`${card.suit}-${card.rank}-${cIndex}`}
                        id={`tableau-${tIndex}-${cIndex}`}
                        data={{ type: 'tableau', index: tIndex, cardIndex: cIndex }}
                        className="card"
                        src={getCardUrl(card)}
                        alt={`${card.rank} of ${card.suit}`}
                        style={{
                          zIndex: cIndex,
                          top: calcTop,
                          left: 0
                        }}
                        disabled={!card.isFaceUp}
                        forceHidden={isPartofActiveStack}
                      />
                    )
                  })}
                </DroppablePile>
              ))}
            </div>
          </div>
        )}

        {isGameWon && (
          <div className="win-message">
            <h2>You Won!</h2>
            <button className="btn" onClick={newGame}>Play Again</button>
          </div>
        )}

        <footer className="game-controls">
          <button className="btn" onClick={newGame}>New Game</button>
          <button className="btn" onClick={undo}>Undo</button>
          <button className="btn" onClick={autoMove}>Auto Move</button>
        </footer>
      </div>

      <DragOverlay>
        {activeDrag ? (
          <div className="dragging-stack">
            {activeDrag.type === 'waste' && game?.waste.topCard() && (
              <img className="card" src={getCardUrl(game.waste.topCard())} alt="Dragging card" />
            )}
            {activeDrag.type === 'foundation' && game?.foundations[activeDrag.index].topCard() && (
              <img className="card" src={getCardUrl(game.foundations[activeDrag.index].topCard())} alt="Dragging card" />
            )}
            {activeDrag.type === 'tableau' && game?.tableau[activeDrag.index].cards.slice(activeDrag.cardIndex).map((card, idx) => (
              <img
                key={idx}
                className="card"
                src={getCardUrl(card)}
                style={{
                  position: 'absolute',
                  top: `calc(${idx} * var(--fan-offset-v))`,
                  left: 0
                }}
                alt="Dragging card"
              />
            ))}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default Solitaire
