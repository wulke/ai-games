import React from 'react';
import { Card } from '../models/Card';

interface CardUIProps {
  card: Card | null;
  className?: string;
  style?: React.CSSProperties;
  backSrc?: string;
  isFaceUp?: boolean;
}

export const CardUI: React.FC<CardUIProps> = ({
  card,
  className = 'card',
  style,
  backSrc = '/cards/Red_Back.svg',
  isFaceUp
}) => {
  const getCardUrl = (card: Card | null) => {
    // If isFaceUp prop is provided, override the card's internal state
    const showingFace = isFaceUp !== undefined ? isFaceUp : (card?.isFaceUp ?? false);

    if (!card || !showingFace) return backSrc;

    const rankMap: Record<string, string> = { '10': 'T' };
    const rank = rankMap[card.rank] || card.rank;
    const suit = card.suit[0].toUpperCase();
    return `/cards/${rank}${suit}.svg`;
  };

  return (
    <img
      className={className}
      src={getCardUrl(card)}
      alt={card ? `${card.rank} of ${card.suit}` : 'Card Back'}
      style={style}
      draggable={false}
    />
  );
};
