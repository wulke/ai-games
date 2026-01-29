import React from 'react';
import { useHearts } from '../../hooks/useHearts';
import { MultiplayerTable } from '../MultiplayerTable';
import { Card } from '../../models/Card';
import '../../style/hearts.css';

export const HeartsView: React.FC = () => {
  const {
    game,
    selectedCards,
    selectCard,
    submitPass,
    startNewGame,
    startNextRound
  } = useHearts();

  const [expandedPlayers, setExpandedPlayers] = React.useState<Set<string>>(new Set());

  if (!game) return <div>Loading...</div>;

  const togglePlayerExpansion = (playerId: string) => {
    const newExpanded = new Set(expandedPlayers);
    if (newExpanded.has(playerId)) {
      newExpanded.delete(playerId);
    } else {
      newExpanded.add(playerId);
    }
    setExpandedPlayers(newExpanded);
  };

  return (
    <div className="hearts-view">
      <div className="hearts-header">
        <h2>Hearts</h2>
        <div className="hearts-stats">
          <span>Round: {game.roundNumber}</span>
          <span>Pass: {game.passingDirection}</span>
        </div>
      </div>

      <MultiplayerTable
        players={game.players}
        currentPlayerIndex={game.currentPlayerIndex}
        currentTrick={game.currentTrick}
        onCardClick={selectCard}
        selectedCards={selectedCards}
      />

      {game.phase === 'passing' && (
        <div className="passing-control">
          <div className="passing-message">
            <h3>Select 3 cards to pass {game.passingDirection}</h3>
            <p>{selectedCards.length} / 3 selected</p>
          </div>
          <button
            className="btn"
            disabled={selectedCards.length !== 3}
            onClick={submitPass}
          >
            Pass Cards
          </button>
        </div>
      )}

      {game.phase === 'scoring' && (
        <div className="game-over-overlay">
          <div className="game-over-modal scoring-modal">
            <h2>Round {game.roundNumber} Results</h2>
            <div className="final-scores">
              {game.players.map(p => {
                const isExpanded = expandedPlayers.has(p.id);
                const allTakenCards = game.lastRoundResults.get(p.id) ? (game.takenCards.get(p.id) || []) : [];
                const cards = allTakenCards.filter(c =>
                  c.suit === 'hearts' || (c.suit === 'spades' && c.rank === 'Q')
                );

                return (
                  <div key={p.id} className="score-row-container">
                    <div
                      className={`score-row expandable ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => togglePlayerExpansion(p.id)}
                    >
                      <div className="player-id-section">
                        <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                        <span>{p.name}:</span>
                      </div>
                      <div className="score-details">
                        {game.lastRoundResults.get(p.id) === 0 && (p as any).roundPoints === 26 && (
                          <span className="moon-badge">SHOT THE MOON!</span>
                        )}
                        <span className="round-pts">+{game.lastRoundResults.get(p.id)} pts</span>
                        <span className="total-pts">(Total: {p.score})</span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="taken-cards-breakdown">
                        {cards.length > 0 ? (
                          <div className="mini-card-grid">
                            {(Card.sort(cards)).map((card: Card, i: number) => (
                              <div key={i} className={`mini-card ${card.suit}`}>
                                {card.rank}{card.suit === 'hearts' ? '♥' : card.suit === 'spades' ? '♠' : card.suit === 'clubs' ? '♣' : '♦'}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="no-cards-msg">No point cards taken this round.</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <button className="btn" onClick={startNextRound}>Next Hand</button>
          </div>
        </div>
      )}

      {game.phase === 'ended' && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2>Game Over</h2>
            <div className="final-scores">
              {game.players.map(p => (
                <div key={p.id} className="score-row">
                  <span>{p.name}:</span>
                  <span>{p.score}</span>
                </div>
              ))}
            </div>
            <button className="btn" onClick={startNewGame}>New Game</button>
          </div>
        </div>
      )}

      <div className="player-hand-container">
        {/* 
                    The MultiplayerTable handles the actual rendering of the hand in the layout,
                    but we might want a focused "player view" here or just let the table handle it.
                */}
      </div>
    </div>
  );
};
