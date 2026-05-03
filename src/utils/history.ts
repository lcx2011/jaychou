import type { Song, HistoryEntry } from '../types';

const MAX_HISTORY_SIZE = 20;

export function pushToHistory(
  stack: HistoryEntry[],
  description: string,
  songsSnapshot: Song[],
): HistoryEntry[] {
  const newStack = [...stack];
  newStack.push({
    id: Date.now(),
    description,
    songs: songsSnapshot.map(s => ({ ...s })),
    timestamp: Date.now(),
  });
  while (newStack.length > MAX_HISTORY_SIZE) {
    newStack.shift();
  }
  return newStack;
}
