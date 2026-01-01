import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppData, Novel, Character, Place, Note, AppSettings } from '@/types/novel';
import * as storage from '@/lib/storage';

interface AppContextType {
  data: AppData;
  // Novel operations
  addNovel: (novel: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNovel: (id: string, updates: Partial<Novel>) => void;
  deleteNovel: (id: string) => void;
  getNovel: (id: string) => Novel | undefined;
  // Character operations
  addCharacter: (character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  getCharacter: (id: string) => Character | undefined;
  getNovelCharacters: (novelId: string) => Character[];
  // Place operations
  addPlace: (place: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePlace: (id: string, updates: Partial<Place>) => void;
  deletePlace: (id: string) => void;
  getPlace: (id: string) => Place | undefined;
  getNovelPlaces: (novelId: string) => Place[];
  // Note operations
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNote: (id: string) => Note | undefined;
  getNovelNotes: (novelId: string) => Note[];
  // Link operations
  linkCharacterToPlace: (characterId: string, placeId: string) => void;
  unlinkCharacterFromPlace: (characterId: string, placeId: string) => void;
  // Settings
  updateSettings: (settings: Partial<AppSettings>) => void;
  // Import/Export
  exportData: () => string;
  importData: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => storage.loadData());

  // Persist data on change
  useEffect(() => {
    storage.saveData(data);
  }, [data]);

  // Apply fullscreen mode
  useEffect(() => {
    if (data.settings.fullscreenMode) {
      document.documentElement.classList.add('fullscreen-mode');
      // Try to enable fullscreen API if available
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      document.documentElement.classList.remove('fullscreen-mode');
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, [data.settings.fullscreenMode]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (data.settings.theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(isDark ? 'dark' : 'light');
    } else {
      root.classList.add(data.settings.theme);
    }
  }, [data.settings.theme]);

  // Novel operations
  const addNovel = useCallback((novel: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>) => {
    setData(prev => storage.createNovel(prev, novel));
  }, []);

  const updateNovelHandler = useCallback((id: string, updates: Partial<Novel>) => {
    setData(prev => storage.updateNovel(prev, id, updates));
  }, []);

  const deleteNovelHandler = useCallback((id: string) => {
    setData(prev => storage.deleteNovel(prev, id));
  }, []);

  const getNovel = useCallback((id: string) => {
    return data.novels.find(n => n.id === id);
  }, [data.novels]);

  // Character operations
  const addCharacter = useCallback((character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => {
    setData(prev => storage.createCharacter(prev, character));
  }, []);

  const updateCharacterHandler = useCallback((id: string, updates: Partial<Character>) => {
    setData(prev => storage.updateCharacter(prev, id, updates));
  }, []);

  const deleteCharacterHandler = useCallback((id: string) => {
    setData(prev => storage.deleteCharacter(prev, id));
  }, []);

  const getCharacter = useCallback((id: string) => {
    return data.characters.find(c => c.id === id);
  }, [data.characters]);

  const getNovelCharacters = useCallback((novelId: string) => {
    return data.characters.filter(c => c.novelId === novelId);
  }, [data.characters]);

  // Place operations
  const addPlace = useCallback((place: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>) => {
    setData(prev => storage.createPlace(prev, place));
  }, []);

  const updatePlaceHandler = useCallback((id: string, updates: Partial<Place>) => {
    setData(prev => storage.updatePlace(prev, id, updates));
  }, []);

  const deletePlaceHandler = useCallback((id: string) => {
    setData(prev => storage.deletePlace(prev, id));
  }, []);

  const getPlace = useCallback((id: string) => {
    return data.places.find(p => p.id === id);
  }, [data.places]);

  const getNovelPlaces = useCallback((novelId: string) => {
    return data.places.filter(p => p.novelId === novelId);
  }, [data.places]);

  // Note operations
  const addNote = useCallback((note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    setData(prev => storage.createNote(prev, note));
  }, []);

  const updateNoteHandler = useCallback((id: string, updates: Partial<Note>) => {
    setData(prev => storage.updateNote(prev, id, updates));
  }, []);

  const deleteNoteHandler = useCallback((id: string) => {
    setData(prev => storage.deleteNote(prev, id));
  }, []);

  const getNote = useCallback((id: string) => {
    return data.notes.find(n => n.id === id);
  }, [data.notes]);

  const getNovelNotes = useCallback((novelId: string) => {
    return data.notes.filter(n => n.novelId === novelId);
  }, [data.notes]);

  // Link operations
  const linkHandler = useCallback((characterId: string, placeId: string) => {
    setData(prev => storage.linkCharacterToPlace(prev, characterId, placeId));
  }, []);

  const unlinkHandler = useCallback((characterId: string, placeId: string) => {
    setData(prev => storage.unlinkCharacterFromPlace(prev, characterId, placeId));
  }, []);

  // Settings
  const updateSettingsHandler = useCallback((settings: Partial<AppSettings>) => {
    setData(prev => storage.updateSettings(prev, settings));
  }, []);

  // Import/Export
  const exportDataHandler = useCallback(() => {
    return storage.exportData(data);
  }, [data]);

  const importDataHandler = useCallback((jsonString: string) => {
    const imported = storage.importData(jsonString);
    if (imported) {
      setData(imported);
      return true;
    }
    return false;
  }, []);

  return (
    <AppContext.Provider
      value={{
        data,
        addNovel,
        updateNovel: updateNovelHandler,
        deleteNovel: deleteNovelHandler,
        getNovel,
        addCharacter,
        updateCharacter: updateCharacterHandler,
        deleteCharacter: deleteCharacterHandler,
        getCharacter,
        getNovelCharacters,
        addPlace,
        updatePlace: updatePlaceHandler,
        deletePlace: deletePlaceHandler,
        getPlace,
        getNovelPlaces,
        addNote,
        updateNote: updateNoteHandler,
        deleteNote: deleteNoteHandler,
        getNote,
        getNovelNotes,
        linkCharacterToPlace: linkHandler,
        unlinkCharacterFromPlace: unlinkHandler,
        updateSettings: updateSettingsHandler,
        exportData: exportDataHandler,
        importData: importDataHandler,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
