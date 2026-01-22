import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Preset, DEFAULT_PRESETS } from '@/types';

interface PresetContextValue {
  presets: Preset[];
  savePresets: (newPresets: Preset[]) => void;
  isLoading: boolean;
}

const PresetContext = createContext<PresetContextValue | undefined>(undefined);

const STORAGE_KEY = 'rollbar-pro-presets';

export function PresetProvider({ children }: { children: React.ReactNode }) {
  const [presets, setPresets] = useState<Preset[]>(DEFAULT_PRESETS);
  const [isLoading, setIsLoading] = useState(true);

  // Load presets from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Preset[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPresets(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load presets from localStorage:', error);
      // Keep default presets on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const savePresets = useCallback((newPresets: Preset[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPresets));
      setPresets(newPresets);
    } catch (error) {
      console.error('Failed to save presets to localStorage:', error);
      throw error;
    }
  }, []);

  return (
    <PresetContext.Provider value={{ presets, savePresets, isLoading }}>
      {children}
    </PresetContext.Provider>
  );
}

export function usePresets() {
  const context = useContext(PresetContext);
  if (!context) {
    throw new Error('usePresets must be used within a PresetProvider');
  }
  return context;
}
