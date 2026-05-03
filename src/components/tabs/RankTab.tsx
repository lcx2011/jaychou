import RankTable from '../rank/RankTable';

export default function RankTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-700 mb-6">🏆 评分排行榜</h2>
      <RankTable />
    </div>
  );
}
