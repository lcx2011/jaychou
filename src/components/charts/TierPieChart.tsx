import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useApp } from '../../context/AppContext';
import { TIERS, TIER_CHART_COLORS } from '../../constants/tiers';
import type { Tier } from '../../types';

echarts.use([PieChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

export default function TierPieChart() {
  const { state } = useApp();
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current);
    }

    const counts: Record<Tier, number> = { S: 0, A: 0, B: 0, C: 0, D: 0 };
    state.songs.forEach(s => { counts[s.tier]++; });

    instanceRef.current.setOption({
      title: { text: '分值分布', left: 'center', top: 8, textStyle: { fontSize: 15, fontWeight: 'bold', color: '#44403c' } },
      tooltip: { trigger: 'item', formatter: '{b}: {c} 首 ({d}%)' },
      legend: { bottom: 0, textStyle: { fontSize: 12, color: '#78716c' } },
      series: [{
        type: 'pie',
        radius: ['45%', '72%'],
        center: ['50%', '52%'],
        data: TIERS.filter(t => counts[t] > 0).map(t => ({
          name: `${t}档`,
          value: counts[t],
          itemStyle: { color: TIER_CHART_COLORS[t] },
        })),
        label: { show: true, formatter: '{b}\n{d}%', fontSize: 12, color: '#78716c' },
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.3)' } },
      }],
    });

    const handleResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); };
  }, [state.songs]);

  return <div ref={chartRef} className="w-full h-64" />;
}
