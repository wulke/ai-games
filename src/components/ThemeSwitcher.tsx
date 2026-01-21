import React from 'react';
import { useTheme } from '../context/ThemeContext';
import type { Theme } from '../context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes: { id: Theme; label: string }[] = [
    { id: 'classic', label: 'Classic Green' },
    { id: 'dark', label: 'Modern Dark' },
    { id: 'blue', label: 'Blue Felt' },
    { id: 'retro', label: 'Retro Teal' },
  ];

  return (
    <li className="nav-item">
      <a href="#" onClick={(e) => e.preventDefault()}>Theme: {themes.find(t => t.id === theme)?.label} ▾</a>
      <div className="dropdown-content">
        {themes.map((t) => (
          <a
            key={t.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setTheme(t.id);
            }}
            style={{ fontWeight: theme === t.id ? 'bold' : 'normal' }}
          >
            {t.label}
          </a>
        ))}
      </div>
    </li>
  );
};

export default ThemeSwitcher;
