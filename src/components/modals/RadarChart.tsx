import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import { RadarComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { DIMENSION_LABELS, DIMENSIONS } from '../../constants/dimensions';
import type { Song } from '../../types';

echarts.use([RadarChart, RadarComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

interface RadarChartProps {
  song?: Song | null;
  songB?: Song | null;
}

export default function RadarChartView({ song, songB }: RadarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !song) return;
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current);
    }

    const dims = DIMENSIONS.map(d => d.label);
    const valuesA = DIMENSIONS.map(d => song[d.key as keyof typeof song] as number);

    const series: { name: string; value: number[]; lineStyle?: { color: string }; areaStyle?: { color: string }; itemStyle?: { color: string }; symbol?: string; symbolSize?: number }[] = [{
      name: song.name,
      value: valuesA,
      lineStyle: { color: '#f59e0b' },
      areaStyle: { color: 'rgba(245,158,11,0.15)' },
      itemStyle: { color: '#f59e0b' },
      symbol: 'circle',
      symbolSize: 6,
    }];

    if (songB) {
      const valuesB = DIMENSIONS.map(d => songB[d.key as keyof typeof songB] as number);
      series.push({
        name: songB.name,
        value: valuesB,
        lineStyle: { color: '#3b82f6' },
        areaStyle: { color: 'rgba(59,130,246,0.15)' },
        itemStyle: { color: '#3b82f6' },
        symbol: 'diamond',
        symbolSize: 6,
      });
    }

    instanceRef.current.setOption({
      legend: { bottom: 5, textStyle: { fontSize: 12, color: '#78716c' } },
      radar: {
        indicator: dims.map(d => ({ name: d, max: 100 })),
        shape: 'polygon',
        splitArea: { areaStyle: { color: ['#fff', '#fafaf9'] } },
        axisName: { color: '#78716c', fontSize: 12 },
        center: ['50%', '48%'],
        radius: '65%',
      },
      series: [{
        type: 'radar',
        data: series,
      }],
    });

    const handleResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); };
  }, [song, songB]);

  return <div ref={chartRef} className="w-full h-72" />;
}

export { DIMENSION_LABELS, DIMENSIONS };
