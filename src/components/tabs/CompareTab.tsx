import { useApp } from '../../context/AppContext';
import { DIMENSIONS } from '../../constants/dimensions';
import SongSelector from '../compare/SongSelector';
import CompareRadarChart from '../compare/CompareRadarChart';

export default function CompareTab() {
  const { state } = useApp();
  const { songs, compareSongIdA, compareSongIdB } = state;

  const songA = songs.find(s => s.id === compareSongIdA) || null;
  const songB = songs.find(s => s.id === compareSongIdB) || null;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-stone-700">⚔️ 歌曲对比</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <SongSelector slot="A" label="🎵 歌曲 A" selectedId={compareSongIdA} oppositeId={compareSongIdB} />
        <div className="flex items-end pb-3 sm:pb-0">
          <span className="text-2xl font-black text-stone-300">VS</span>
        </div>
        <SongSelector slot="B" label="🎶 歌曲 B" selectedId={compareSongIdB} oppositeId={compareSongIdA} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
        <CompareRadarChart songA={songA} songB={songB} />
      </div>

      {songA && songB && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[songA, songB].map((song, idx) => (
            <div key={song.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h3 className={`text-xl font-black mb-4 ${idx === 0 ? 'text-amber-500' : 'text-blue-500'}`}>
                {idx === 0 ? '🟡' : '🔵'} {song.name}
                <span className="text-base font-normal text-stone-400 ml-2">{song.tier}档 · {song.total.toFixed(2)}分</span>
              </h3>
              <div className="space-y-3">
                {DIMENSIONS.map(dim => {
                  const score = song[dim.key as keyof typeof song] as number;
                  const remark = song[(dim.key + '_remark') as keyof typeof song] as string;
                  const otherScore = (idx === 0 ? songB : songA)[dim.key as keyof typeof song] as number;
                  const winner = score > otherScore;
                  const loser = score < otherScore;

                  return (
                    <div key={dim.key} className={`p-3 rounded-xl border ${winner ? 'bg-emerald-50/70 border-emerald-200' : loser ? 'bg-red-50/70 border-red-100' : 'bg-stone-50 border-stone-100'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-stone-700">{dim.label}</span>
                        <span className={`text-xl font-black ${winner ? 'text-emerald-600' : loser ? 'text-red-500' : 'text-stone-600'}`}>
                          {winner ? '▲ ' : loser ? '▼ ' : ''}{typeof score === 'number' ? score.toFixed(0) : score}
                        </span>
                      </div>
                      <p className="text-sm text-stone-500">{remark || '暂无备注'}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {songs.length < 2 && (
        <div className="text-center py-12 text-stone-400 text-lg">
          ⚔️ 需要至少录入2首歌曲才能使用对比功能
        </div>
      )}
    </div>
  );
}
