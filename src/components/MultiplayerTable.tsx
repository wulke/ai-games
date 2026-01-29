import React from 'react';
import { Player } from '../models/Player';
import { Card } from '../models/Card';
import { Trick } from '../models/Trick';
import type { PlayedCard } from '../models/Trick';
import { CardUI } from './CardUI';
import { useDeveloperSettings } from '../context/DeveloperSettingsContext';
import '../style/multiplayer.css';
import '../style/developer_settings.css';

interface MultiplayerTableProps {
  players: Player[];
  currentPlayerIndex: number;
  currentTrick: Trick | null;
  onCardClick?: (card: Card) => void;
  selectedCards?: Card[];
}

export const MultiplayerTable: React.FC<MultiplayerTableProps> = ({
  players,
  currentPlayerIndex,
  currentTrick,
  onCardClick,
  selectedCards
}) => {
  const { settings, updateSettings } = useDeveloperSettings();
  // Ensure we have 4 players for the layout, fill with placeholders if needed
  const displayPlayers = [...players];
  while (displayPlayers.length < 4) {
    displayPlayers.push(new Player(`empty-${displayPlayers.length}`, 'Waiting...'));
  }

  // Position mapping: 0: South (User), 1: West, 2: North, 3: East
  // This assumes players[0] is always the human player
  const positions = ['south', 'west', 'north', 'east'];

  const getPlayedCardForPlayer = (playerId: string): PlayedCard | undefined => {
    return currentTrick?.playedCards.find(pc => pc.player.id === playerId);
  };

  return (
    <div className="multiplayer-table">
      {displayPlayers.map((player, index) => (
        <div key={player.id} className={`player-area player-${positions[index]} ${currentPlayerIndex === index ? 'active' : ''}`}>
          <div className="player-info">
            <div className="player-name-section">
              <span className="player-name">{player.name}</span>
              {settings.isExternalBotEnabled && (
                <label className="bot-toggle-mini" title="Enable Bot for this player">
                  <input
                    type="checkbox"
                    checked={settings.botPlayerIndices.includes(index)}
                    onChange={(e) => {
                      const newIndices = e.target.checked
                        ? [...settings.botPlayerIndices, index]
                        : settings.botPlayerIndices.filter(i => i !== index);
                      updateSettings({ botPlayerIndices: newIndices });
                    }}
                  />
                  <span className="bot-toggle-label">BOT</span>
                </label>
              )}
            </div>
            <span className="player-score">Score: {player.score}</span>
          </div>

          <div className="player-hand">
            {(index === 0 ? Card.sort(player.hand) : player.hand).map((card, cardIndex) => {
              const isSelected = selectedCards?.some((c: Card) => c.suit === card.suit && c.rank === card.rank);
              const cardOffsetTop = isSelected ? -20 : 0;

              return (
                <div
                  key={`${card.suit}-${card.rank}-${cardIndex}`}
                  className={`card-wrapper ${isSelected ? 'selected' : ''}`}
                  onClick={() => index === 0 && onCardClick && onCardClick(card)}
                  style={{
                    zIndex: cardIndex,
                    left: index === 0 || index === 2 ? `${cardIndex * 30}px` : '0',
                    top: index === 1 || index === 3 ? `calc(${cardIndex * 20}px + ${cardOffsetTop}px)` : `${cardOffsetTop}px`
                  }}
                >
                  <CardUI
                    card={card}
                    isFaceUp={index === 0} // Only show human player's hand face up
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="trick-area">
        <div className="trick-center">
          {displayPlayers.map((player, index) => {
            const played = getPlayedCardForPlayer(player.id);
            if (!played) return null;

            return (
              <div key={player.id} className={`played-card-slot slot-${positions[index]}`}>
                <CardUI card={played.card} isFaceUp={true} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
