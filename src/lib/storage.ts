import { AppData, Novel, Character, Place, Note, AppSettings } from '@/types/novel';

const STORAGE_KEY = 'novel-companion-data';
const APP_VERSION = '1.0.0';

const defaultSettings: AppSettings = {
  fullscreenMode: false,
  theme: 'light',
  fontSize: 'medium',
};

const getDefaultData = (): AppData => ({
  novels: [],
  characters: [],
  places: [],
  notes: [],
  settings: defaultSettings,
  version: APP_VERSION,
});

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as AppData;
      return { ...getDefaultData(), ...data };
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  return getDefaultData();
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Novel operations
export const createNovel = (data: AppData, novel: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>): AppData => {
  const now = Date.now();
  const newNovel: Novel = {
    ...novel,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  return { ...data, novels: [...data.novels, newNovel] };
};

export const updateNovel = (data: AppData, id: string, updates: Partial<Novel>): AppData => {
  return {
    ...data,
    novels: data.novels.map(n => 
      n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
    ),
  };
};

export const deleteNovel = (data: AppData, id: string): AppData => {
  return {
    ...data,
    novels: data.novels.filter(n => n.id !== id),
    characters: data.characters.filter(c => c.novelId !== id),
    places: data.places.filter(p => p.novelId !== id),
    notes: data.notes.filter(n => n.novelId !== id),
  };
};

// Character operations
export const createCharacter = (data: AppData, character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>): AppData => {
  const now = Date.now();
  const newCharacter: Character = {
    ...character,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  return { ...data, characters: [...data.characters, newCharacter] };
};

export const updateCharacter = (data: AppData, id: string, updates: Partial<Character>): AppData => {
  return {
    ...data,
    characters: data.characters.map(c => 
      c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
    ),
  };
};

export const deleteCharacter = (data: AppData, id: string): AppData => {
  // Also remove references from places
  const updatedPlaces = data.places.map(p => ({
    ...p,
    linkedCharacterIds: p.linkedCharacterIds.filter(cid => cid !== id),
  }));
  
  return {
    ...data,
    characters: data.characters.filter(c => c.id !== id),
    places: updatedPlaces,
  };
};

// Place operations
export const createPlace = (data: AppData, place: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>): AppData => {
  const now = Date.now();
  const newPlace: Place = {
    ...place,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  return { ...data, places: [...data.places, newPlace] };
};

export const updatePlace = (data: AppData, id: string, updates: Partial<Place>): AppData => {
  return {
    ...data,
    places: data.places.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
    ),
  };
};

export const deletePlace = (data: AppData, id: string): AppData => {
  // Also remove references from characters
  const updatedCharacters = data.characters.map(c => ({
    ...c,
    linkedPlaceIds: c.linkedPlaceIds.filter(pid => pid !== id),
  }));
  
  return {
    ...data,
    places: data.places.filter(p => p.id !== id),
    characters: updatedCharacters,
  };
};

// Note operations
export const createNote = (data: AppData, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): AppData => {
  const now = Date.now();
  const newNote: Note = {
    ...note,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  return { ...data, notes: [...data.notes, newNote] };
};

export const updateNote = (data: AppData, id: string, updates: Partial<Note>): AppData => {
  return {
    ...data,
    notes: data.notes.map(n => 
      n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
    ),
  };
};

export const deleteNote = (data: AppData, id: string): AppData => {
  return {
    ...data,
    notes: data.notes.filter(n => n.id !== id),
  };
};

// Link operations
export const linkCharacterToPlace = (data: AppData, characterId: string, placeId: string): AppData => {
  const updatedCharacters = data.characters.map(c => {
    if (c.id === characterId && !c.linkedPlaceIds.includes(placeId)) {
      return { ...c, linkedPlaceIds: [...c.linkedPlaceIds, placeId], updatedAt: Date.now() };
    }
    return c;
  });

  const updatedPlaces = data.places.map(p => {
    if (p.id === placeId && !p.linkedCharacterIds.includes(characterId)) {
      return { ...p, linkedCharacterIds: [...p.linkedCharacterIds, characterId], updatedAt: Date.now() };
    }
    return p;
  });

  return { ...data, characters: updatedCharacters, places: updatedPlaces };
};

export const unlinkCharacterFromPlace = (data: AppData, characterId: string, placeId: string): AppData => {
  const updatedCharacters = data.characters.map(c => {
    if (c.id === characterId) {
      return { ...c, linkedPlaceIds: c.linkedPlaceIds.filter(id => id !== placeId), updatedAt: Date.now() };
    }
    return c;
  });

  const updatedPlaces = data.places.map(p => {
    if (p.id === placeId) {
      return { ...p, linkedCharacterIds: p.linkedCharacterIds.filter(id => id !== characterId), updatedAt: Date.now() };
    }
    return p;
  });

  return { ...data, characters: updatedCharacters, places: updatedPlaces };
};

// Settings
export const updateSettings = (data: AppData, settings: Partial<AppSettings>): AppData => {
  return {
    ...data,
    settings: { ...data.settings, ...settings },
  };
};

// Export/Import
export const exportData = (data: AppData): string => {
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonString: string): AppData | null => {
  try {
    const parsed = JSON.parse(jsonString) as AppData;
    // Validate structure
    if (parsed.novels && parsed.characters && parsed.places && parsed.notes) {
      return { ...getDefaultData(), ...parsed };
    }
  } catch (error) {
    console.error('Error importing data:', error);
  }
  return null;
};
