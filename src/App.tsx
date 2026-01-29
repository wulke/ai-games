import React, { useState } from 'react'
import Home from './components/Home'
import Solitaire from './components/Solitaire'
import { HeartsView } from './components/hearts/HeartsView'
import { ThemeProvider } from './context/ThemeContext'
import ThemeSwitcher from './components/ThemeSwitcher'

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'solitaire' | 'hearts'>('home')

  return (
    <div className="app-container">
      <nav className="navbar">
        <a href="/" className="nav-brand" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>
          AI Card Games
        </a>
        <ul className="nav-links">
          <ThemeSwitcher />
          <li className="nav-item">
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>Home</a>
          </li>
          <li className="nav-item">
            <a href="#">Games ▾</a>
            <div className="dropdown-content">
              <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('solitaire'); }}>Solitaire</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('hearts'); }}>Hearts</a>
            </div>
          </li>
        </ul>
      </nav>

      <main>
        {currentPage === 'home' ? (
          <Home
            onPlaySolitaire={() => setCurrentPage('solitaire')}
            onPlayHearts={() => setCurrentPage('hearts')}
          />
        ) : currentPage === 'solitaire' ? (
          <Solitaire />
        ) : (
          <HeartsView />
        )}
      </main>
    </div>
  )
}

const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
)

export default App
