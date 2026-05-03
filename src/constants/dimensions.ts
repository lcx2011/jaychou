export interface DimensionConfig {
  key: string;
  label: string;
  weight: number;
  color: string;
}

export const DIMENSIONS: DimensionConfig[] = [
  { key: 'melody',       label: '旋律', weight: 0.30, color: '#f59e0b' },
  { key: 'arrangement',  label: '编曲', weight: 0.25, color: '#3b82f6' },
  { key: 'lyrics',       label: '歌词', weight: 0.20, color: '#10b981' },
  { key: 'vocal',        label: '演唱', weight: 0.15, color: '#8b5cf6' },
  { key: 'innovation',   label: '创新', weight: 0.10, color: '#f43f5e' },
];

export const DIMENSION_WEIGHTS = {
  melody: 0.30,
  arrangement: 0.25,
  lyrics: 0.20,
  vocal: 0.15,
  innovation: 0.10,
};

export const DIMENSION_LABELS: Record<string, string> = {
  melody: '旋律',
  arrangement: '编曲',
  lyrics: '歌词',
  vocal: '演唱',
  innovation: '创新',
};
