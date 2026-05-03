import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useApp } from '../../context/AppContext';
import { getYearAverage } from '../../utils/scoring';

echarts.use([LineChart, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer]);

export default function YearTrendChart() {
  const { state } = useApp();
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current);
    }

    const years = [...new Set(state.songs.map(s => s.year))].sort((a, b) => a - b);
    const data = years.map(y => getYearAverage(state.songs, y));

    instanceRef.current.setOption({
      title: {
        text: '创作曲线', subtext: '按年份平均分变化趋势', left: 'center', top: 5,
        textStyle: { fontSize: 15, fontWeight: 'bold', color: '#44403c' },
        subtextStyle: { fontSize: 12, color: '#a8a29e' },
      },
      tooltip: { trigger: 'axis', formatter: (p: { name: string; value: number }[]) => `${p[0].name}年<br/>平均分: ${p[0].value.toFixed(2)}` },
      grid: { top: 55, bottom: 30, left: 50, right: 20 },
      xAxis: { type: 'category', data: years.map(String), axisLabel: { fontSize: 11, color: '#78716c' } },
      yAxis: { type: 'value', min: 60, max: 100, axisLabel: { fontSize: 11, color: '#78716c' } },
      series: [{
        type: 'line',
        data,
        smooth: true,
        lineStyle: { color: '#f59e0b', width: 3 },
        itemStyle: { color: '#f59e0b', borderColor: '#fff', borderWidth: 2 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(245,158,11,0.3)' }, { offset: 1, color: 'rgba(245,158,11,0.02)' }]) },
        symbolSize: 8,
        label: { show: true, fontSize: 11, fontWeight: 'bold', color: '#78716c', formatter: '{c}' },
      }],
    });

    const handleResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); };
  }, [state.songs]);

  return <div ref={chartRef} className="w-full h-72" />;
}
