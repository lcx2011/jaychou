import RadarChartView from '../modals/RadarChart';
import type { Song } from '../../types';

interface CompareRadarChartProps {
  songA: Song | null;
  songB: Song | null;
}

export default function CompareRadarChart({ songA, songB }: CompareRadarChartProps) {
  if (!songA || !songB) {
    return (
      <div className="flex items-center justify-center h-72 text-stone-400">
        <p>请选择两首歌曲进行对比</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-stone-700 mb-3 text-center">雷达图对比</h3>
      <RadarChartView song={songA} songB={songB} />
    </div>
  );
}
