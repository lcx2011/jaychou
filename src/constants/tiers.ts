import type { Tier } from '../types';

export const TIER_THRESHOLDS: Record<Tier, number> = {
  S: 95,
  A: 85,
  B: 75,
  C: 60,
  D: 0,
};

export const TIER_COLORS: Record<Tier, string> = {
  S: 'bg-purple-600',
  A: 'bg-red-500',
  B: 'bg-amber-500',
  C: 'bg-green-500',
  D: 'bg-stone-500',
};

export const TIER_TEXT_COLORS: Record<Tier, string> = {
  S: 'text-purple-600',
  A: 'text-red-500',
  B: 'text-amber-500',
  C: 'text-green-500',
  D: 'text-stone-500',
};

export const TIER_CHART_COLORS: Record<Tier, string> = {
  S: '#9333ea',
  A: '#ef4444',
  B: '#f59e0b',
  C: '#22c55e',
  D: '#a8a29e',
};

export const TIERS: Tier[] = ['S', 'A', 'B', 'C', 'D'];
