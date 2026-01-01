export interface Novel {
  id: string;
  title: string;
  author?: string;
  coverImage?: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Character {
  id: string;
  novelId: string;
  name: string;
  aliases?: string[];
  description?: string;
  images: string[];
  linkedPlaceIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Place {
  id: string;
  novelId: string;
  name: string;
  description?: string;
  linkedCharacterIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Note {
  id: string;
  novelId: string;
  title: string;
  content: string;
  linkedCharacterIds: string[];
  linkedPlaceIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  fullscreenMode: boolean;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
}

export interface AppData {
  novels: Novel[];
  characters: Character[];
  places: Place[];
  notes: Note[];
  settings: AppSettings;
  version: string;
}
