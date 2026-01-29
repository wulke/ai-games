import React, { createContext, useContext, useState } from 'react';

interface DeveloperSettings {
  botUrl: string;
  isExternalBotEnabled: boolean;
  botPlayerIndices: number[]; // Array of indices where bots are playing (e.g. [1, 2, 3] for Hearts)
}

interface DeveloperSettingsContextType {
  settings: DeveloperSettings;
  updateSettings: (updates: Partial<DeveloperSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: DeveloperSettings = {
  botUrl: 'http://localhost:8080',
  isExternalBotEnabled: false,
  botPlayerIndices: [],
};

const DeveloperSettingsContext = createContext<DeveloperSettingsContextType | undefined>(undefined);

export const DeveloperSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<DeveloperSettings>(() => {
    const saved = localStorage.getItem('developer-settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse developer settings', e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (updates: Partial<DeveloperSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      localStorage.setItem('developer-settings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('developer-settings');
  };

  return (
    <DeveloperSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </DeveloperSettingsContext.Provider>
  );
};

export const useDeveloperSettings = () => {
  const context = useContext(DeveloperSettingsContext);
  if (context === undefined) {
    throw new Error('useDeveloperSettings must be used within a DeveloperSettingsProvider');
  }
  return context;
};
