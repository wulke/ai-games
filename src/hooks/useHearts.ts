import { useState, useCallback, useEffect, useRef } from 'react';
import { HeartsGame } from '../models/hearts/HeartsGame';
import { Player } from '../models/Player';
import { HeartsAI } from '../models/hearts/HeartsAI';
import { Card } from '../models/Card';

export const useHearts = () => {
  const [game, setGame] = useState<HeartsGame | null>(null);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [tick, setTick] = useState(0);
  const isThinkingRef = useRef(false);

  const forceUpdate = useCallback(() => setTick(t => t + 1), []);

  const startNewGame = useCallback(() => {
    const players = [
      new Player('1', 'You'),
      new HeartsAI('2', 'Bob'),
      new HeartsAI('3', 'Charlie'),
      new HeartsAI('4', 'David')
    ];
    const newGame = new HeartsGame(players);
    newGame.start();
    setGame(newGame);
    forceUpdate();
  }, [forceUpdate]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleAITurns = useCallback(async () => {
    if (!game || isThinkingRef.current) return;
    isThinkingRef.current = true;

    try {
      while (game.phase === 'playing' && game.currentPlayerIndex !== 0) {
        const currentPlayer = game.getCurrentPlayer();
        if (currentPlayer instanceof HeartsAI) {
          // Add a small delay for "thinking"
          await new Promise(resolve => setTimeout(resolve, 800));
          const card = await currentPlayer.choosePlayCard(game);
          game.playCard(currentPlayer.id, card);
          forceUpdate();

          if (game.currentTrick?.playedCards.length === game.players.length) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            game.resolveTrick();
            forceUpdate();
          }
        } else {
          break;
        }
      }
    } finally {
      isThinkingRef.current = false;
    }
  }, [game, forceUpdate]);

  useEffect(() => {
    if (game && game.phase === 'playing' && game.currentPlayerIndex !== 0) {
      handleAITurns();
    }
  }, [game, tick, handleAITurns]);

  const selectCard = useCallback((card: Card) => {
    if (!game) return;

    if (game.phase === 'passing') {
      setSelectedCards(prev => {
        const isSelected = prev.some(c => c.suit === card.suit && c.rank === card.rank);
        if (isSelected) {
          return prev.filter(c => !(c.suit === card.suit && c.rank === card.rank));
        }
        if (prev.length < 3) {
          return [...prev, card];
        }
        return prev;
      });
    } else if (game.phase === 'playing') {
      if (game.currentPlayerIndex === 0 && game.isValidMove('1', card)) {
        game.playCard('1', card);
        forceUpdate();

        if (game.currentTrick?.playedCards.length === game.players.length) {
          setTimeout(() => {
            game.resolveTrick();
            forceUpdate();
            handleAITurns();
          }, 1500);
        } else {
          handleAITurns();
        }
      }
    }
  }, [game, forceUpdate, handleAITurns]);

  const submitPass = useCallback(() => {
    if (!game || selectedCards.length !== 3) return;

    game.submitPass('1', selectedCards);

    // Let AIs pass
    game.players.forEach(p => {
      if (p instanceof HeartsAI) {
        p.choosePassCards().then(cards => {
          game.submitPass(p.id, cards);
          forceUpdate();
        });
      }
    });

    setSelectedCards([]);
    forceUpdate();
  }, [game, selectedCards, forceUpdate]);

  const startNextRound = useCallback(() => {
    if (game) {
      game.nextRound();
      forceUpdate();
    }
  }, [game, forceUpdate]);

  return {
    game,
    selectedCards,
    selectCard,
    submitPass,
    startNewGame,
    startNextRound
  };
};
