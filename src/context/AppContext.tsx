import { createContext, useContext, useReducer, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { AppAction, AppState, Song, SongFormData, RankFilters } from '../types';
import { calculateTotal, calculateTier } from '../utils/scoring';
import { pushToHistory } from '../utils/history';
import * as api from '../lib/api';            // 新增 API 操作
import { loadSongs } from '../utils/storage'; // 异步版本

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
    songs: [], // 不再从本地同步加载，改为异步初始化
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
    case 'LOAD_SONGS': {
      // 内部初始化动作，不记录历史
      return { ...state, songs: action.payload };
    }
    case 'LOAD_HISTORY': {
      return { ...state, historyStack: action.payload };
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
  const [state, baseDispatch] = useReducer(appReducer, undefined, createInitialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  // 支持异步同步的 dispatch 封装
  const dispatch = useCallback(async (action: AppAction) => {
    // UNDO 需要先取出恢复前的快照，因为 baseDispatch 会同时更新 historyStack
    if (action.type === 'UNDO') {
      const current = stateRef.current;
      if (current.historyStack.length === 0) return;
      const lastEntry = current.historyStack[current.historyStack.length - 1];
      const restoredSongs = lastEntry.songs;
      baseDispatch(action);
      // 将恢复后的全量歌曲写回数据库，并弹出历史记录
      await api.importSongs(restoredSongs).catch(e => console.error('undo importSongs error', e));
      await api.popHistory().catch(e => console.error('undo popHistory error', e));
      return;
    }

    // 其他 action 先更新状态
    baseDispatch(action);

    // 然后同步数据库
    switch (action.type) {
      case 'ADD_SONG':
        api.addSong(action.payload).catch(e => console.error('addSong sync error', e));
        break;
      case 'UPDATE_SONG':
        api.updateSong(action.payload).catch(e => console.error('updateSong sync error', e));
        break;
      case 'DELETE_SONG':
        api.deleteSong(action.payload).catch(e => console.error('deleteSong sync error', e));
        break;
      case 'IMPORT_SONGS':
        api.importSongs(action.payload).catch(e => console.error('importSongs sync error', e));
        break;
      case 'CLEAR_ALL':
        api.clearAllSongs().catch(e => console.error('clearAllSongs sync error', e));
        break;
      case 'PUSH_HISTORY':
        // PUSH_HISTORY action 传入 description 和 songs，同步写入 history 表
        api.pushHistory({
          id: Date.now(),
          description: action.payload.description,
          songs: action.payload.songs,
          timestamp: Date.now(),
        }).catch(e => console.error('pushHistory sync error', e));
        break;
      // LOAD_SONGS / LOAD_HISTORY 无需同步
    }
  }, [baseDispatch]);

  // 初始化：从 Supabase（加 localStorage 兜底）加载歌曲与历史
  useEffect(() => {
    async function initialize() {
      try {
        // 歌曲
        const songs = await loadSongs();
        baseDispatch({ type: 'LOAD_SONGS', payload: songs });
        // 历史
        const history = await api.fetchHistory();
        baseDispatch({ type: 'LOAD_HISTORY', payload: history });
      } catch (e) {
        console.error('初始化数据失败', e);
      }
    }
    initialize();
  }, [baseDispatch]);

  // 原有的 saveSongs 已改为空实现，无需再监听 songs 变化写入本地
  // 但我们保留该 useEffect 以表明逻辑清晰，实际不执行写入
  useEffect(() => {
    // 数据已实时同步到 Supabase，此处不再调用 saveSongs
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
  }, [state.form, state.isEditing, state.editingId, dispatch]);

  const deleteSong = useCallback((id: number) => {
    dispatch({ type: 'DELETE_SONG', payload: id });
  }, [dispatch]);

  const cancelEdit = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, [dispatch]);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, [dispatch]);

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