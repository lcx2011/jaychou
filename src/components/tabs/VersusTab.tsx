import { useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { DIMENSIONS } from '../../constants/dimensions';
import { calculateTotal, calculateTier } from '../../utils/scoring';
import type { Song, DimensionScores } from '../../types';

const K = 0.3;
const D_PARAM = 30;

interface DeltaRecord {
  dimKey: string;
  dimLabel: string;
  dimColor: string;
  winner: 'A' | 'B';
  aBefore: number;
  aAfter: number;
  bBefore: number;
  bAfter: number;
}

function cloneSong(s: Song): Song {
  return { ...s };
}

function pickTwo(songs: Song[]): [Song, Song] {
  const idx1 = Math.floor(Math.random() * songs.length);
  let idx2 = Math.floor(Math.random() * (songs.length - 1));
  if (idx2 >= idx1) idx2++;
  return [cloneSong(songs[idx1]), cloneSong(songs[idx2])];
}

function eloUpdate(aScore: number, bScore: number, winner: 'A' | 'B'): [number, number] {
  const winnerScore = winner === 'A' ? aScore : bScore;
  const loserScore  = winner === 'A' ? bScore : aScore;
  // 胜者的预期胜率
  const E_winner = 1 / (1 + Math.pow(10, (loserScore - winnerScore) / D_PARAM));
  const delta = K * (1 - E_winner); // 胜者加分 ＝ 败者扣分

  if (winner === 'A') {
    return [
      Math.min(100, Math.max(0, aScore + delta)),
      Math.min(100, Math.max(0, bScore - delta)),
    ];
  } else {
    return [
      Math.min(100, Math.max(0, aScore - delta)),
      Math.min(100, Math.max(0, bScore + delta)),
    ];
  }
}

function updateSongScores(song: Song, dimension: keyof DimensionScores, newScore: number): Song {
  const updated = cloneSong(song);
  updated[dimension] = Math.round(newScore * 100) / 100;
  const total = calculateTotal({
    melody: updated.melody,
    arrangement: updated.arrangement,
    lyrics: updated.lyrics,
    vocal: updated.vocal,
    innovation: updated.innovation,
  });
  updated.total = total;
  updated.tier = calculateTier(total);
  return updated;
}

export default function VersusTab() {
  const { state, dispatch } = useApp();
  const { songs } = state;

  const [pair, setPair] = useState<[Song, Song] | null>(() =>
    songs.length >= 2 ? pickTwo(songs) : null,
  );
  const [currentDim, setCurrentDim] = useState(0);
  const [deltas, setDeltas] = useState<DeltaRecord[]>([]);
  const [phase, setPhase] = useState<'comparing' | 'summary'>('comparing');

  const dim = DIMENSIONS[currentDim];

  const handlePick = useCallback(
    (winner: 'A' | 'B') => {
      if (!pair) return;
      const [a, b] = pair;
      const dimKey = dim.key as keyof DimensionScores;
      const aBefore = a[dimKey];
      const bBefore = b[dimKey];
      const [aNew, bNew] = eloUpdate(aBefore, bBefore, winner);

      const updatedA = updateSongScores(a, dimKey, aNew);
      const updatedB = updateSongScores(b, dimKey, bNew);

      const newDeltas: DeltaRecord[] = [
        ...deltas,
        {
          dimKey: dim.key,
          dimLabel: dim.label,
          dimColor: dim.color,
          winner,
          aBefore,
          aAfter: aNew,
          bBefore,
          bAfter: bNew,
        },
      ];

      if (currentDim >= 4) {
        setPair([updatedA, updatedB]);
        setDeltas(newDeltas);
        setPhase('summary');
        dispatch({ type: 'UPDATE_SONG', payload: updatedA });
        dispatch({ type: 'UPDATE_SONG', payload: updatedB });
      } else {
        setPair([updatedA, updatedB]);
        setDeltas(newDeltas);
        setCurrentDim(currentDim + 1);
      }
    },
    [pair, dim, currentDim, deltas, dispatch],
  );

  const resetRound = useCallback(() => {
    if (songs.length < 2) return;
    setPair(pickTwo(songs));
    setCurrentDim(0);
    setDeltas([]);
    setPhase('comparing');
  }, [songs]);

  if (songs.length < 2) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center">
        <div className="text-5xl mb-4">🎲</div>
        <h2 className="text-xl font-black text-stone-700 mb-2">随机对决</h2>
        <p className="text-stone-500">至少需要 2 首已评分的歌曲才能开始对决</p>
        <p className="text-stone-400 text-sm mt-1">
          当前共 {songs.length} 首歌曲
        </p>
      </div>
    );
  }

  if (!pair) {
    return null;
  }

  const [songA, songB] = pair;

  if (phase === 'summary') {
    return (
      <div className="max-w-2xl mx-auto h-full flex flex-col">
        <h2 className="text-xl font-black text-stone-800 text-center mb-6">对决结果</h2>

        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-lg font-bold text-stone-700">{songA.name}</span>
          <span className="text-stone-300 font-black text-sm">VS</span>
          <span className="text-lg font-bold text-stone-700">{songB.name}</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="px-4 py-3 text-left font-bold text-stone-600">维度</th>
                  <th className="px-4 py-3 text-center font-bold text-stone-600">胜者</th>
                  <th className="px-4 py-3 text-center font-bold text-stone-600" colSpan={2}>
                    {songA.name}
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-stone-600" colSpan={2}>
                    {songB.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {deltas.map((d, i) => {
                  const aDiff = d.aAfter - d.aBefore;
                  const bDiff = d.bAfter - d.bBefore;
                  return (
                    <tr key={d.dimKey} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full mr-2"
                          style={{ backgroundColor: d.dimColor }}
                        />
                        <span className="font-bold text-stone-700">{d.dimLabel}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            d.winner === 'A'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {d.winner === 'A' ? songA.name : songB.name}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-xs text-stone-500">
                        {d.aBefore.toFixed(1)} → <span className="font-bold text-stone-800">{d.aAfter.toFixed(1)}</span>
                      </td>
                      <td
                        className={`px-3 py-3 text-left font-mono text-xs ${
                          aDiff >= 0 ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {aDiff >= 0 ? '+' : ''}
                        {aDiff.toFixed(2)}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-xs text-stone-500">
                        {d.bBefore.toFixed(1)} → <span className="font-bold text-stone-800">{d.bAfter.toFixed(1)}</span>
                      </td>
                      <td
                        className={`px-3 py-3 text-left font-mono text-xs ${
                          bDiff >= 0 ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {bDiff >= 0 ? '+' : ''}
                        {bDiff.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={resetRound}
            className="px-6 py-3 bg-amber-400 text-white font-bold rounded-xl shadow-md shadow-amber-200 hover:bg-amber-500 transition cursor-pointer"
          >
            再来一轮
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col">
      <h2 className="text-xl font-black text-stone-800 text-center mb-2">随机对决</h2>
      <p className="text-stone-400 text-sm text-center mb-6">
        请选出在「{dim.label}」维度上表现更好的歌曲
      </p>

      <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-4 mb-6">
        {/* Song A */}
        <div className="flex-1 bg-white border-2 border-stone-200 hover:border-amber-300 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center gap-3 transition">
          <div className="text-4xl font-black text-stone-800 text-center">{songA.name}</div>
          <div className="text-stone-400 text-sm">
            {songA.album} · {songA.year}
          </div>
          <button
            onClick={() => handlePick('A')}
            className="mt-4 px-8 py-3 rounded-xl font-bold text-white shadow-md hover:shadow-lg transition cursor-pointer"
            style={{ backgroundColor: dim.color, boxShadow: `0 4px 14px ${dim.color}40` }}
          >
            {songA.name} 更好
          </button>
        </div>

        {/* VS divider */}
        <div className="flex lg:flex-col items-center justify-center gap-2 py-2 lg:py-6">
          <span
            className="text-xs font-black text-white px-3 py-1 rounded-full"
            style={{ backgroundColor: dim.color }}
          >
            {dim.label}
          </span>
          <span className="text-stone-300 font-black text-lg">VS</span>
        </div>

        {/* Song B */}
        <div className="flex-1 bg-white border-2 border-stone-200 hover:border-blue-300 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center gap-3 transition">
          <div className="text-4xl font-black text-stone-800 text-center">{songB.name}</div>
          <div className="text-stone-400 text-sm">
            {songB.album} · {songB.year}
          </div>
          <button
            onClick={() => handlePick('B')}
            className="mt-4 px-8 py-3 rounded-xl font-bold text-white shadow-md hover:shadow-lg transition cursor-pointer"
            style={{ backgroundColor: dim.color, boxShadow: `0 4px 14px ${dim.color}40` }}
          >
            {songB.name} 更好
          </button>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 pb-4">
        {DIMENSIONS.map((d, i) => (
          <div
            key={d.key}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
              i < currentDim
                ? 'bg-stone-200 text-stone-400'
                : i === currentDim
                  ? 'text-white shadow-md'
                  : 'bg-stone-100 text-stone-300'
            }`}
            style={i === currentDim ? { backgroundColor: d.color } : undefined}
          >
            {i < currentDim ? '✓' : i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
