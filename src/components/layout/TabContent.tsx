import { useApp } from '../../context/AppContext';
import ScoreTab from '../tabs/ScoreTab';
import RankTab from '../tabs/RankTab';
import ChartsTab from '../tabs/ChartsTab';
import CompareTab from '../tabs/CompareTab';
import VersusTab from '../tabs/VersusTab';
import DataTab from '../tabs/DataTab';

export default function TabContent() {
  const { state } = useApp();

  switch (state.currentTab) {
    case 'score':   return <ScoreTab />;
    case 'rank':    return <RankTab />;
    case 'charts':  return <ChartsTab />;
    case 'compare': return <CompareTab />;
    case 'versus':  return <VersusTab />;
    case 'data':    return <DataTab />;
  }
}
