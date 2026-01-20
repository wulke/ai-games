import { useState, useEffect, useCallback, useRef } from 'react'
import { SolitaireGame } from '../models/solitaire/SolitaireGame'

export const useSolitaire = () => {
  const [game, setGame] = useState<SolitaireGame | null>(null)
  const [, setTick] = useState(0) // Used to force re-renders on game mutations
  const [stats, setStats] = useState({
    score: 0,
    moves: 0,
    elapsedTime: '00:00'
  })
  const [isGameWon, setIsGameWon] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const timerIntervalRef = useRef<any>(null)

  const forceUpdate = useCallback(() => setTick(t => t + 1), [])

  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    startTimeRef.current = Date.now()
    timerIntervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const seconds = Math.floor((Date.now() - startTimeRef.current) / 1000)
        const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
        const ss = String(seconds % 60).padStart(2, '0')
        setStats(prev => ({ ...prev, elapsedTime: `${mm}:${ss}` }))
      }
    }, 1000)
  }, [])

  const newGame = useCallback(() => {
    const newGameInstance = new SolitaireGame()
    newGameInstance.newGame()
    setGame(newGameInstance)
    setStats({ score: 0, moves: 0, elapsedTime: '00:00' })
    setIsGameWon(false)
    startTimer()
    forceUpdate()
  }, [startTimer, forceUpdate])

  useEffect(() => {
    newGame()
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    }
  }, [newGame])

  const checkWinCondition = useCallback(() => {
    if (game && game.isWon()) {
      setIsGameWon(true)
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    }
  }, [game])

  const draw = useCallback(() => {
    if (game && game.drawFromStock()) {
      setStats(prev => ({ ...prev, moves: prev.moves + 1 }))
      checkWinCondition()
      forceUpdate()
    }
  }, [game, checkWinCondition, forceUpdate])

  const undo = useCallback(() => {
    if (game && game.undo()) {
      setStats(prev => ({ ...prev, moves: prev.moves + 1 }))
      forceUpdate()
    }
  }, [game, forceUpdate])

  const autoMove = useCallback(() => {
    if (game) {
      const movedCount = game.autoMove()
      if (movedCount > 0) {
        setStats(prev => ({ ...prev, moves: prev.moves + movedCount }))
        checkWinCondition()
        forceUpdate()
      }
    }
  }, [game, checkWinCondition, forceUpdate])

  const handleMoveSuccess = useCallback(() => {
    setStats(prev => ({ ...prev, moves: prev.moves + 1 }))
    checkWinCondition()
    forceUpdate()
  }, [checkWinCondition, forceUpdate])

  const getCardUrl = useCallback((card: any) => {
    if (!card || !card.isFaceUp) return '/cards/Red_Back.svg'
    const rankMap: Record<string, string> = { '10': 'T' }
    const rank = rankMap[card.rank] || card.rank
    const suit = card.suit[0].toUpperCase()
    return `/cards/${rank}${suit}.svg`
  }, [])

  return {
    game,
    stats,
    isGameWon,
    newGame,
    draw,
    undo,
    autoMove,
    getCardUrl,
    handleMoveSuccess
  }
}
