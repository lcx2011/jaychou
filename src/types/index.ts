export type Tier = 'S' | 'A' | 'B' | 'C' | 'D';
export type TabName = 'score' | 'rank' | 'charts' | 'compare' | 'data';
export type SortKey = 'total' | 'melody' | 'arrangement' | 'lyrics' | 'vocal' | 'innovation' | 'year' | 'name';

export interface DimensionScores {
  melody: number;
  arrangement: number;
  lyrics: number;
  vocal: number;
  innovation: number;
}

export interface DimensionRemarks {
  melody_remark: string;
  arrangement_remark: string;
  lyrics_remark: string;
  vocal_remark: string;
  innovation_remark: string;
}

export interface Song extends DimensionScores, DimensionRemarks {
  id: number;
  name: string;
  album: string;
  year: number;
  total: number;
  tier: Tier;
}

export type SongFormData = Omit<Song, 'id' | 'total' | 'tier'>;

export interface RankFilters {
  searchQuery: string;
  albumFilter: string;
  tierFilter: Tier | '';
  sortKey: SortKey;
  sortDirection: 'asc' | 'desc';
}

export interface HistoryEntry {
  id: number;
  description: string;
  songs: Song[];
  timestamp: number;
}

export interface ModalState {
  type: 'songDetail' | null;
  songId: number | null;
  isOpen: boolean;
}

export interface AppState {
  songs: Song[];
  form: SongFormData;
  isEditing: boolean;
  editingId: number | null;
  currentTab: TabName;
  rankFilters: RankFilters;
  compareSongIdA: number | null;
  compareSongIdB: number | null;
  modal: ModalState;
  historyStack: HistoryEntry[];
}

export type AppAction =
  | { type: 'ADD_SONG'; payload: Song }
  | { type: 'UPDATE_SONG'; payload: Song }
  | { type: 'DELETE_SONG'; payload: number }
  | { type: 'IMPORT_SONGS'; payload: Song[] }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_FORM_FIELD'; payload: { field: string; value: string | number } }
  | { type: 'POPULATE_FORM'; payload: Song }
  | { type: 'RESET_FORM' }
  | { type: 'SET_TAB'; payload: TabName }
  | { type: 'SET_RANK_FILTERS'; payload: Partial<RankFilters> }
  | { type: 'SET_COMPARE_SONG'; payload: { slot: 'A' | 'B'; songId: number | null } }
  | { type: 'OPEN_MODAL'; payload: { type: 'songDetail'; songId: number } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'PUSH_HISTORY'; payload: { description: string; songs: Song[] } }
  | { type: 'UNDO' };
