import { DIMENSION_WEIGHTS } from '../constants/dimensions';
import { TIER_THRESHOLDS } from '../constants/tiers';
import type { Tier, Song, DimensionScores } from '../types';

export function calculateTotal(scores: DimensionScores): number {
  const raw =
    scores.melody * DIMENSION_WEIGHTS.melody +
    scores.arrangement * DIMENSION_WEIGHTS.arrangement +
    scores.lyrics * DIMENSION_WEIGHTS.lyrics +
    scores.vocal * DIMENSION_WEIGHTS.vocal +
    scores.innovation * DIMENSION_WEIGHTS.innovation;
  return Math.round(raw * 100) / 100;
}

export function calculateTier(total: number): Tier {
  if (total >= TIER_THRESHOLDS.S) return 'S';
  if (total >= TIER_THRESHOLDS.A) return 'A';
  if (total >= TIER_THRESHOLDS.B) return 'B';
  if (total >= TIER_THRESHOLDS.C) return 'C';
  return 'D';
}

export function getTierColor(tier: Tier): string {
  const map: Record<Tier, string> = {
    S: 'bg-purple-600',
    A: 'bg-red-500',
    B: 'bg-amber-500',
    C: 'bg-green-500',
    D: 'bg-stone-500',
  };
  return map[tier];
}

export function getAlbumAverage(songs: Song[], album: string): number {
  const albumSongs = songs.filter(s => s.album === album);
  if (albumSongs.length === 0) return 0;
  return Math.round((albumSongs.reduce((sum, s) => sum + s.total, 0) / albumSongs.length) * 100) / 100;
}

export function getYearAverage(songs: Song[], year: number): number {
  const yearSongs = songs.filter(s => s.year === year);
  if (yearSongs.length === 0) return 0;
  return Math.round((yearSongs.reduce((sum, s) => sum + s.total, 0) / yearSongs.length) * 100) / 100;
}
