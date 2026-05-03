import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DIMENSIONS } from '../../constants/dimensions';

export default function DimensionLeaderboard() {
  const { state, dispatch } = useApp();
  const { songs } = state;

  const top5PerDimension = useMemo(() => {
    return DIMENSIONS.map(dim => {
      const sorted = [...songs].sort((a, b) => (b[dim.key as keyof typeof b] as number) - (a[dim.key as keyof typeof a] as number));
      return { dim, top: sorted.slice(0, 5) };
    });
  }, [songs]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
      <h3 className="text-base font-bold text-stone-700 mb-4 text-center">各维度TOP5</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {top5PerDimension.map(({ dim, top }) => (
          <div key={dim.key} className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
            <h4 className="text-sm font-bold mb-3 text-center" style={{ color: dim.color }}>{dim.label}</h4>
            <ol className="space-y-1.5">
              {top.map((s, i) => (
                <li key={s.id} className="flex items-center gap-1.5 text-sm">
                  <span className="font-bold text-stone-400 w-4 text-right shrink-0">{i + 1}.</span>
                  <button
                    onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { type: 'songDetail', songId: s.id } })}
                    className="text-stone-600 hover:text-amber-600 truncate cursor-pointer transition text-left"
                  >
                    {s.name}
                  </button>
                  <span className="text-stone-400 ml-auto shrink-0 font-medium">{(s[dim.key as keyof typeof s] as number).toFixed(0)}</span>
                </li>
              ))}
              {top.length === 0 && <li className="text-stone-400 text-sm text-center">暂无数据</li>}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
