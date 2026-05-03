import { supabase } from './supabaseClient';
import type { Song, HistoryEntry } from '../types';

// 错误处理封装：所有数据库操作失败时打印错误，不阻断流程
function handleError(context: string, error: unknown) {
  console.error(`[API] ${context} 失败`, error);
}

// 读取全部歌曲
export async function fetchSongs(): Promise<Song[]> {
  try {
    const { data, error } = await supabase.from('songs').select('*');
    if (error) throw error;
    return (data as Song[]) || [];
  } catch (e) {
    handleError('fetchSongs', e);
    return [];
  }
}

// 新增一首歌曲
export async function addSong(song: Song): Promise<void> {
  try {
    const { error } = await supabase.from('songs').insert(song);
    if (error) throw error;
  } catch (e) {
    handleError('addSong', e);
  }
}

// 更新一首歌曲
export async function updateSong(song: Song): Promise<void> {
  try {
    const { error } = await supabase.from('songs').update(song).eq('id', song.id);
    if (error) throw error;
  } catch (e) {
    handleError('updateSong', e);
  }
}

// 删除一首歌曲
export async function deleteSong(id: number): Promise<void> {
  try {
    const { error } = await supabase.from('songs').delete().eq('id', id);
    if (error) throw error;
  } catch (e) {
    handleError('deleteSong', e);
  }
}

// 清空全部歌曲并批量导入新数据
export async function importSongs(songs: Song[]): Promise<void> {
  try {
    // 删除所有行（使用 neq 万能条件）
    const { error: deleteError } = await supabase.from('songs').delete().neq('id', -1);
    if (deleteError) throw deleteError;
    if (songs.length > 0) {
      const { error: insertError } = await supabase.from('songs').insert(songs);
      if (insertError) throw insertError;
    }
  } catch (e) {
    handleError('importSongs', e);
  }
}

// 清空歌曲表
export async function clearAllSongs(): Promise<void> {
  try {
    const { error } = await supabase.from('songs').delete().neq('id', -1);
    if (error) throw error;
  } catch (e) {
    handleError('clearAllSongs', e);
  }
}

// 读取全部历史记录（按时间升序）
export async function fetchHistory(): Promise<HistoryEntry[]> {
  try {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .order('timestamp', { ascending: true });
    if (error) throw error;
    if (!data) return [];
    return data.map((row: any) => ({
      id: row.id,
      description: row.description,
      songs: row.songs_snapshot as Song[],
      timestamp: row.timestamp,
    }));
  } catch (e) {
    handleError('fetchHistory', e);
    return [];
  }
}

// 新增一条历史记录
export async function pushHistory(entry: HistoryEntry): Promise<void> {
  try {
    const { error } = await supabase.from('history').insert({
      id: entry.id,
      description: entry.description,
      songs_snapshot: entry.songs,
      timestamp: entry.timestamp,
    });
    if (error) throw error;
  } catch (e) {
    handleError('pushHistory', e);
  }
}

// 删除最新一条历史记录（撤销时使用）
export async function popHistory(): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('history')
      .select('id')
      .order('timestamp', { ascending: false })
      .limit(1);
    if (error) throw error;
    if (data && data.length > 0) {
      const { error: deleteError } = await supabase
        .from('history')
        .delete()
        .eq('id', data[0].id);
      if (deleteError) throw deleteError;
    }
  } catch (e) {
    handleError('popHistory', e);
  }
}