import { useApp } from '../../context/AppContext';

interface SongSelectorProps {
  slot: 'A' | 'B';
  label: string;
  selectedId: number | null;
  oppositeId: number | null;
}

export default function SongSelector({ slot, label, selectedId, oppositeId }: SongSelectorProps) {
  const { state, dispatch } = useApp();

  const available = state.songs.filter(s => s.id !== oppositeId);
  const selected = state.songs.find(s => s.id === selectedId) || null;

  return (
    <div className="flex-1">
      <label className="block text-sm font-bold text-stone-600 mb-1.5">{label}</label>
      <select
        value={selectedId ?? ''}
        onChange={e => dispatch({ type: 'SET_COMPARE_SONG', payload: { slot, songId: e.target.value ? Number(e.target.value) : null } })}
        className="w-full border border-stone-300 p-3 rounded-xl text-base outline-none focus:ring-2 focus:ring-amber-400 bg-white transition"
      >
        <option value="">-- 选择歌曲 --</option>
        {available.map(s => (
          <option key={s.id} value={s.id}>{s.name} ({s.album} · {s.total.toFixed(2)})</option>
        ))}
      </select>
      {selected && (
        <div className="mt-2 text-sm text-stone-500">
          {selected.album} · {selected.year} · {selected.tier}档 · {selected.total.toFixed(2)}分
        </div>
      )}
    </div>
  );
}
