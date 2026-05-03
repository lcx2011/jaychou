import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getTierColor } from '../../utils/scoring';
import type { Song, SortKey } from '../../types';
import RankFilters from '../rank/RankFilters';

const SORTABLE_HEADERS: { key: SortKey; label: string; align: string }[] = [
  { key: 'name', label: '歌曲', align: 'text-left' },
  { key: 'year', label: '年份', align: 'text-center' },
  { key: 'melody', label: '旋律', align: 'text-center' },
  { key: 'arrangement', label: '编曲', align: 'text-center' },
  { key: 'lyrics', label: '歌词', align: 'text-center' },
  { key: 'vocal', label: '演唱', align: 'text-center' },
  { key: 'innovation', label: '创新', align: 'text-center' },
  { key: 'total', label: '总分', align: 'text-right' },
];

export default function RankTable() {
  const { state, dispatch, deleteSong } = useApp();
  const { songs, rankFilters } = state;

  const filteredAndSorted = useMemo(() => {
    let result = [...songs];

    if (rankFilters.searchQuery) {
      const q = rankFilters.searchQuery.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.album.toLowerCase().includes(q));
    }
    if (rankFilters.albumFilter) {
      result = result.filter(s => s.album === rankFilters.albumFilter);
    }
    if (rankFilters.tierFilter) {
      result = result.filter(s => s.tier === rankFilters.tierFilter);
    }

    result.sort((a, b) => {
      const aVal = a[rankFilters.sortKey];
      const bVal = b[rankFilters.sortKey];
      const dir = rankFilters.sortDirection === 'asc' ? 1 : -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * dir;
      }
      return ((aVal as number) - (bVal as number)) * dir;
    });

    return result;
  }, [songs, rankFilters]);

  const handleSort = (key: SortKey) => {
    dispatch({
      type: 'SET_RANK_FILTERS',
      payload: {
        sortKey: key,
        sortDirection: rankFilters.sortKey === key && rankFilters.sortDirection === 'desc' ? 'asc' : 'desc',
      },
    });
  };

  const sortIndicator = (key: SortKey) => {
    if (rankFilters.sortKey !== key) return '';
    return rankFilters.sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div>
      <RankFilters />
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm lg:text-base text-left">
            <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
              <tr>
                <th className="p-3 lg:p-4 font-bold w-12 text-center">#</th>
                {SORTABLE_HEADERS.map(h => (
                  <th
                    key={h.key}
                    onClick={() => handleSort(h.key)}
                    className={`p-3 lg:p-4 font-bold cursor-pointer hover:text-amber-600 transition select-none ${h.align}`}
                  >
                    {h.label}{sortIndicator(h.key)}
                  </th>
                ))}
                <th className="p-3 lg:p-4 font-bold text-center w-12">档位</th>
                <th className="p-3 lg:p-4 font-bold text-center w-20">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredAndSorted.map((song, index) => (
                <SongRow
                  key={song.id}
                  song={song}
                  rank={index + 1}
                  onDetail={() => dispatch({ type: 'OPEN_MODAL', payload: { type: 'songDetail', songId: song.id } })}
                  onEdit={() => dispatch({ type: 'POPULATE_FORM', payload: song })}
                  onDelete={() => { if (confirm('确定要删除这首歌曲的评分吗？')) deleteSong(song.id); }}
                />
              ))}
              {filteredAndSorted.length === 0 && (
                <tr>
                  <td colSpan={12} className="p-12 text-center text-stone-400 text-base">
                    {songs.length === 0 ? '暂无数据，去录入新歌吧！' : '没有匹配的歌曲'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SongRow({ song, rank, onDetail, onEdit, onDelete }: {
  song: Song;
  rank: number;
  onDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="hover:bg-amber-50/50 transition">
      <td className="p-3 lg:p-4 font-bold text-stone-400 text-center">{rank}</td>
      <td className="p-3 lg:p-4">
        <button onClick={onDetail} className="font-bold text-stone-800 hover:text-amber-600 transition cursor-pointer">
          {song.name}
        </button>
        <div className="text-xs text-stone-400">{song.album}</div>
      </td>
      <td className="p-3 lg:p-4 text-stone-500 text-center">{song.year}</td>
      <td className="p-3 lg:p-4 text-center font-medium text-stone-600">{song.melody}</td>
      <td className="p-3 lg:p-4 text-center font-medium text-stone-600">{song.arrangement}</td>
      <td className="p-3 lg:p-4 text-center font-medium text-stone-600">{song.lyrics}</td>
      <td className="p-3 lg:p-4 text-center font-medium text-stone-600">{song.vocal}</td>
      <td className="p-3 lg:p-4 text-center font-medium text-stone-600">{song.innovation}</td>
      <td className="p-3 lg:p-4 text-right font-black text-stone-700">{song.total.toFixed(2)}</td>
      <td className="p-3 lg:p-4 text-center">
        <span className={`${getTierColor(song.tier)} px-2.5 py-0.5 rounded-md text-white font-bold text-xs shadow-sm`}>
          {song.tier}
        </span>
      </td>
      <td className="p-3 lg:p-4 text-center">
        <div className="flex gap-1 lg:gap-2 justify-center">
          <button onClick={onDetail} className="text-amber-500 hover:text-amber-700 font-bold text-xs lg:text-sm cursor-pointer">详情</button>
          <button onClick={onEdit} className="text-blue-500 hover:text-blue-700 font-bold text-xs lg:text-sm cursor-pointer">编辑</button>
          <button onClick={onDelete} className="text-red-400 hover:text-red-600 font-bold text-xs lg:text-sm cursor-pointer">删除</button>
        </div>
      </td>
    </tr>
  );
}
