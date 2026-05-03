import TierPieChart from '../charts/TierPieChart';
import AlbumBarChart from '../charts/AlbumBarChart';
import DimensionLeaderboard from '../charts/DimensionLeaderboard';
import YearTrendChart from '../charts/YearTrendChart';
import { useApp } from '../../context/AppContext';

export default function ChartsTab() {
  const { state } = useApp();

  if (state.songs.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-stone-300 mb-4">📊</p>
        <p className="text-lg text-stone-400">暂无数据，先录入歌曲后再来看统计吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-stone-700">📊 数据看板</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
          <TierPieChart />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
          <YearTrendChart />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
        <AlbumBarChart />
      </div>
      <DimensionLeaderboard />
    </div>
  );
}
