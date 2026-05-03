import type { Song } from '../types';
import { fetchSongs } from '../lib/api'; // 新增引用

const STORAGE_KEY = 'jay_score_v2';
const LEGACY_KEY = 'jay_chou_scores';

// 现改为从 Supabase 异步加载，若数据库为空则回退到 localStorage
export async function loadSongs(): Promise<Song[]> {
  try {
    const remoteSongs = await fetchSongs();
    if (remoteSongs.length > 0) {
      return remoteSongs;
    }
    // 数据库无数据，则尝试从 localStorage 加载旧数据作为兜底
    const localData = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
    if (localData) {
      const parsed = JSON.parse(localData) as Song[];
      // 可选：将本地数据同步到 Supabase，此处只返回，后续正常使用时会逐步写入
      return parsed;
    }
    return [];
  } catch (e) {
    console.error('loadSongs 失败，尝试读取本地缓存', e);
    try {
      const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}

// 改为空操作，保留签名。数据同步已在操作 API 中进行
export function saveSongs(songs: Song[]): void {
  // 数据已通过 api 实时写入 Supabase，此处不再写 localStorage
}

// 以下三个函数保持不变
export function exportJSON(songs: Song[]): void {
  const blob = new Blob([JSON.stringify(songs, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '周杰伦评分数据备份.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON(file: File): Promise<Song[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target!.result as string);
        if (Array.isArray(data)) resolve(data as Song[]);
        else reject(new Error('格式错误'));
      } catch {
        reject(new Error('解析失败'));
      }
    };
    reader.readAsText(file);
  });
}

export function copyForExcel(songs: Song[]): void {
  const header = '专辑\t歌曲\t年份\t旋律(30%)\t旋律备注\t编曲(25%)\t编曲备注\t歌词(20%)\t歌词备注\t演唱(15%)\t演唱备注\t创新(10%)\t创新备注\t加权总分\t档位\n';
  const rows = songs.map(s =>
    `${s.album || ''}\t${s.name}\t${s.year || ''}\t${s.melody}\t${s.melody_remark || ''}\t${s.arrangement}\t${s.arrangement_remark || ''}\t${s.lyrics}\t${s.lyrics_remark || ''}\t${s.vocal}\t${s.vocal_remark || ''}\t${s.innovation}\t${s.innovation_remark || ''}\t${s.total}\t${s.tier}`
  );
  navigator.clipboard.writeText(header + rows.join('\n'));
}