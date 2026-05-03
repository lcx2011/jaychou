import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react';
import type { AppState, AppAction, Song, SongFormData, RankFilters } from '../types';
import { loadSongs, saveSongs } from '../utils/storage';
import { calculateTotal, calculateTier } from '../utils/scoring';
import { pushToHistory } from '../utils/history';

const EMPTY_FORM: SongFormData = {
  name: '', album: '', year: new Date().getFullYear(),
  melody: 0, melody_remark: '',
  arrangement: 0, arrangement_remark: '',
  lyrics: 0, lyrics_remark: '',
  vocal: 0, vocal_remark: '',
  innovation: 0, innovation_remark: '',
};

const INITIAL_FILTERS: RankFilters = {
  searchQuery: '',
  albumFilter: '',
  tierFilter: '',
  sortKey: 'total',
  sortDirection: 'desc',
};

function createInitialState(): AppState {
  return {
    songs: loadSongs(),
    form: { ...EMPTY_FORM },
    isEditing: false,
    editingId: null,
    currentTab: 'score',
    rankFilters: { ...INITIAL_FILTERS },
    compareSongIdA: null,
    compareSongIdB: null,
    modal: { type: null, songId: null, isOpen: false },
    historyStack: [],
  };
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_SONG': {
      const desc = `添加歌曲《${action.payload.name}》`;
      return {
        ...state,
        songs: [...state.songs, action.payload],
        historyStack: pushToHistory(state.historyStack, desc, state.songs),
      };
    }
    case 'UPDATE_SONG': {
      const desc = `修改歌曲《${action.payload.name}》评分`;
      return {
        ...state,
        songs: state.songs.map(s => s.id === action.payload.id ? action.payload : s),
        historyStack: pushToHistory(state.historyStack, desc, state.songs),
      };
    }
    case 'DELETE_SONG': {
      const target = state.songs.find(s => s.id === action.payload);
      const desc = `删除歌曲《${target?.name ?? '未知'}》`;
      return {
        ...state,
        songs: state.songs.filter(s => s.id !== action.payload),
        historyStack: pushToHistory(state.historyStack, desc, state.songs),
      };
    }
    case 'IMPORT_SONGS': {
      const desc = `导入 ${action.payload.length} 首歌曲数据`;
      return {
        ...state,
        songs: action.payload,
        historyStack: pushToHistory(state.historyStack, desc, state.songs),
      };
    }
    case 'CLEAR_ALL': {
      return {
        ...state,
        songs: [],
        historyStack: pushToHistory(state.historyStack, '清空所有数据', state.songs),
      };
    }
    case 'SET_FORM_FIELD':
      return { ...state, form: { ...state.form, [action.payload.field]: action.payload.value } };
    case 'POPULATE_FORM':
      return {
        ...state,
        form: {
          name: action.payload.name,
          album: action.payload.album,
          year: action.payload.year,
          melody: action.payload.melody,
          melody_remark: action.payload.melody_remark,
          arrangement: action.payload.arrangement,
          arrangement_remark: action.payload.arrangement_remark,
          lyrics: action.payload.lyrics,
          lyrics_remark: action.payload.lyrics_remark,
          vocal: action.payload.vocal,
          vocal_remark: action.payload.vocal_remark,
          innovation: action.payload.innovation,
          innovation_remark: action.payload.innovation_remark,
        },
        isEditing: true,
        editingId: action.payload.id,
        currentTab: 'score',
      };
    case 'RESET_FORM':
      return { ...state, form: { ...EMPTY_FORM }, isEditing: false, editingId: null };
    case 'SET_TAB':
      return { ...state, currentTab: action.payload };
    case 'SET_RANK_FILTERS':
      return { ...state, rankFilters: { ...state.rankFilters, ...action.payload } };
    case 'SET_COMPARE_SONG':
      return {
        ...state,
        ...(action.payload.slot === 'A' ? { compareSongIdA: action.payload.songId } : { compareSongIdB: action.payload.songId }),
      };
    case 'OPEN_MODAL':
      return { ...state, modal: { ...action.payload, isOpen: true } };
    case 'CLOSE_MODAL':
      return { ...state, modal: { type: null, songId: null, isOpen: false } };
    case 'PUSH_HISTORY':
      return {
        ...state,
        historyStack: pushToHistory(state.historyStack, action.payload.description, action.payload.songs),
      };
    case 'UNDO': {
      if (state.historyStack.length === 0) return state;
      const newStack = [...state.historyStack];
      const entry = newStack.pop()!;
      return { ...state, songs: entry.songs, historyStack: newStack };
    }
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  saveSong: () => void;
  deleteSong: (id: number) => void;
  cancelEdit: () => void;
  undo: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, createInitialState);

  useEffect(() => {
    saveSongs(state.songs);
  }, [state.songs]);

  const saveSong = useCallback(() => {
    if (!state.form.name.trim()) return;
    const total = calculateTotal({
      melody: state.form.melody,
      arrangement: state.form.arrangement,
      lyrics: state.form.lyrics,
      vocal: state.form.vocal,
      innovation: state.form.innovation,
    });
    const tier = calculateTier(total);
    const song: Song = {
      ...state.form,
      id: state.editingId ?? Date.now(),
      total,
      tier,
    };

    if (state.isEditing) {
      dispatch({ type: 'UPDATE_SONG', payload: song });
    } else {
      dispatch({ type: 'ADD_SONG', payload: song });
    }
    dispatch({ type: 'RESET_FORM' });
  }, [state.form, state.isEditing, state.editingId]);

  const deleteSong = useCallback((id: number) => {
    dispatch({ type: 'DELETE_SONG', payload: id });
  }, []);

  const cancelEdit = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, saveSong, deleteSong, cancelEdit, undo }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
