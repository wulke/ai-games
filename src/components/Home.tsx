import React from 'react'

interface HomeProps {
  onPlaySolitaire: () => void
  onPlayHearts: () => void
}

const Home: React.FC<HomeProps> = ({ onPlaySolitaire, onPlayHearts }) => {
  return (
    <main className="hero">
      <h1>Welcome to the Card Table</h1>
      <p>High-quality, browser-based card games built with React and TypeScript.</p>

      <div className="game-grid">
        <div className="game-card" onClick={onPlaySolitaire} style={{ cursor: 'pointer' }}>
          <h3>Klondike Solitaire</h3>
          <p>The classic single-player card game. Test your patience and strategy.</p>
        </div>
        <div className="game-card" onClick={onPlayHearts} style={{ cursor: 'pointer' }}>
          <h3>Hearts</h3>
          <p>Avoid points and the Queen of Spades in this classic trick-taking game.</p>
        </div>
      </div>
    </main>
  )
}

export default Home
