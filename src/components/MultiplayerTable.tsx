import React from 'react';
import { Player } from '../models/Player';
import { Card } from '../models/Card';
import { Trick, PlayedCard } from '../models/Trick';
import { CardUI } from './CardUI';
import '../style/multiplayer.css';

interface MultiplayerTableProps {
  players: Player[];
  currentPlayerIndex: number;
  currentTrick: Trick | null;
  onCardClick?: (card: Card) => void;
}

export const MultiplayerTable: React.FC<MultiplayerTableProps> = ({
  players,
  currentPlayerIndex,
  currentTrick,
  onCardClick
}) => {
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
            <span className="player-name">{player.name}</span>
            <span className="player-score">Score: {player.score}</span>
          </div>

          <div className="player-hand">
            {player.hand.map((card, cardIndex) => (
              <div
                key={`${card.suit}-${card.rank}-${cardIndex}`}
                className="card-wrapper"
                onClick={() => index === 0 && onCardClick && onCardClick(card)}
                style={{
                  zIndex: cardIndex,
                  left: index === 0 || index === 2 ? `${cardIndex * 30}px` : '0',
                  top: index === 1 || index === 3 ? `${cardIndex * 20}px` : '0'
                }}
              >
                <CardUI
                  card={card}
                  isFaceUp={index === 0} // Only show human player's hand face up
                />
              </div>
            ))}
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
