import { useApp } from '../../context/AppContext';
import { ALL_ALBUMS } from '../../constants/albums';
import { TIERS } from '../../constants/tiers';
import type { Tier } from '../../types';

export default function RankFilters() {
  const { state, dispatch } = useApp();
  const { rankFilters } = state;

  const setFilter = (partial: Partial<typeof rankFilters>) => {
    dispatch({ type: 'SET_RANK_FILTERS', payload: partial });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        value={rankFilters.searchQuery}
        onChange={e => setFilter({ searchQuery: e.target.value })}
        type="text"
        placeholder="🔍 搜索歌曲或专辑..."
        className="border border-stone-300 p-3 rounded-xl flex-1 text-base outline-none focus:ring-2 focus:ring-amber-400 bg-white transition"
      />
      <select
        value={rankFilters.albumFilter}
        onChange={e => setFilter({ albumFilter: e.target.value })}
        className="border border-stone-300 p-3 rounded-xl text-base outline-none focus:ring-2 focus:ring-amber-400 bg-white transition"
      >
        <option value="">全部专辑</option>
        {ALL_ALBUMS.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
      <div className="flex gap-1 flex-wrap">
        <button
          onClick={() => setFilter({ tierFilter: '' })}
          className={`px-3 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${!rankFilters.tierFilter ? 'bg-stone-800 text-white shadow-sm' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
        >
          全部
        </button>
        {TIERS.map(tier => (
          <button
            key={tier}
            onClick={() => setFilter({ tierFilter: tier as Tier })}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${
              rankFilters.tierFilter === tier
                ? 'bg-stone-800 text-white shadow-sm'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }`}
          >
            {tier}档
          </button>
        ))}
      </div>
    </div>
  );
}
