import { useEffect, useRef, useMemo } from 'react';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useApp } from '../../context/AppContext';
import { ALL_ALBUMS } from '../../constants/albums';
import { getAlbumAverage } from '../../utils/scoring';

echarts.use([BarChart, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer]);

export default function AlbumBarChart() {
  const { state } = useApp();
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  const data = useMemo(() => {
    return ALL_ALBUMS
      .map(album => ({ album, avg: getAlbumAverage(state.songs, album), count: state.songs.filter(s => s.album === album).length }))
      .filter(d => d.count > 0)
      .sort((a, b) => b.avg - a.avg);
  }, [state.songs]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current);
    }

    instanceRef.current.setOption({
      title: { text: '专辑平均分', left: 'center', top: 5, textStyle: { fontSize: 15, fontWeight: 'bold', color: '#44403c' } },
      tooltip: { trigger: 'axis', formatter: (p: { name: string; value: number }[]) => `${p[0].name}<br/>平均分: ${p[0].value.toFixed(2)}` },
      grid: { top: 40, bottom: 80, left: 50, right: 20 },
      xAxis: {
        type: 'category',
        data: data.map(d => d.album),
        axisLabel: { rotate: 45, fontSize: 11, color: '#78716c' },
      },
      yAxis: {
        type: 'value',
        min: 60,
        max: 100,
        axisLabel: { fontSize: 11, color: '#78716c' },
      },
      series: [{
        type: 'bar',
        data: data.map(d => d.avg),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#fbbf24' },
            { offset: 1, color: '#f59e0b' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        barMaxWidth: 40,
        label: { show: true, position: 'top', fontSize: 11, fontWeight: 'bold', color: '#78716c', formatter: '{c}' },
      }],
    });

    const handleResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); };
  }, [data]);

  return <div ref={chartRef} className="w-full h-72" />;
}
