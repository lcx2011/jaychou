import { useApp } from '../../context/AppContext';
import { DIMENSIONS } from '../../constants/dimensions';
import { getTierColor } from '../../utils/scoring';
import RadarChartView from './RadarChart';

export default function SongDetailModal() {
  const { state, dispatch } = useApp();
  const { modal, songs } = state;

  if (!modal.isOpen || !modal.songId) return null;

  const song = songs.find(s => s.id === modal.songId);
  if (!song) return null;

  const sorted = [...songs].sort((a, b) => b.total - a.total);
  const rank = sorted.findIndex(s => s.id === song.id) + 1;

  const close = () => dispatch({ type: 'CLOSE_MODAL' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={close}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-stone-100 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-black text-stone-800">{song.name}</h2>
            <p className="text-stone-500 text-sm">{song.album} ({song.year})</p>
          </div>
          <button onClick={close} className="text-stone-400 hover:text-stone-600 text-2xl font-bold p-1 cursor-pointer transition">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Metadata */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center text-2xl text-stone-300">🎵</div>
              <div>
                <div className="text-sm text-stone-500">加权总分</div>
                <div className="text-3xl font-black text-amber-500">{song.total.toFixed(2)}</div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className={`${getTierColor(song.tier)} text-white px-4 py-1 rounded-lg text-lg font-black`}>{song.tier} 档</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-stone-500">排名</span>
              <span className="text-2xl font-black text-stone-800">#{rank} / {songs.length}</span>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
            <h3 className="text-lg font-bold text-stone-700 mb-2 text-center">五维雷达图</h3>
            <RadarChartView song={song} />
          </div>

          {/* Dimension Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-stone-700">详细评测报告</h3>
            {DIMENSIONS.map(dim => {
              const score = song[dim.key as keyof typeof song] as number;
              const remark = song[(dim.key + '_remark') as keyof typeof song] as string;
              let tierClass = 'text-green-500';
              if (score >= 95) tierClass = 'text-purple-600';
              else if (score >= 85) tierClass = 'text-red-500';
              else if (score >= 75) tierClass = 'text-amber-500';
              else if (score < 60) tierClass = 'text-stone-400';

              return (
                <div key={dim.key} className="flex items-start gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <div className="shrink-0 w-16 text-center">
                    <div className="text-sm font-bold text-stone-500">{dim.label}</div>
                    <div className={`text-2xl font-black ${tierClass}`}>{typeof score === 'number' ? score.toFixed(0) : score}</div>
                    <div className="text-xs text-stone-400">权重 {(dim.weight * 100).toFixed(0)}%</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-stone-600 leading-relaxed break-words">
                      {remark || <span className="text-stone-400 italic">暂无备注</span>}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
