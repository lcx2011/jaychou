import { useApp } from '../../context/AppContext';
import type { TabName } from '../../types';

const TABS: { key: TabName; label: string; icon: string }[] = [
  { key: 'score',   label: '打分录入', icon: '✏️' },
  { key: 'rank',    label: '排行榜',   icon: '🏆' },
  { key: 'charts',  label: '数据看板', icon: '📊' },
  { key: 'compare', label: '对比模式', icon: '⚔️' },
  { key: 'data',    label: '数据管理', icon: '⚙️' },
];

export default function Header() {
  const { state, dispatch } = useApp();

  return (
    <div className="bg-white border-b border-stone-200 px-5 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 shadow-sm">
      <h1 className="text-xl sm:text-2xl font-black tracking-wide text-stone-800 whitespace-nowrap">
        <span className="text-amber-500">🎼</span> 周杰伦评分系统
      </h1>
      <div className="flex gap-1 sm:gap-2 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => dispatch({ type: 'SET_TAB', payload: tab.key })}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-bold transition whitespace-nowrap cursor-pointer ${
              state.currentTab === tab.key
                ? 'bg-amber-400 text-white shadow-md shadow-amber-200'
                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
            {tab.key === 'rank' && (
              <span className="ml-1.5 bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded-md text-xs font-bold">
                {state.songs.length}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
