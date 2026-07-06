import type { BlindLevel } from "../types/BlindLevel";

export const defaultBlindLevels: BlindLevel[] = [
  { level: 1, durationMinutes: 15, smallBlind: 10, bigBlind: 20, ante: 0 },
  { level: 2, durationMinutes: 15, smallBlind: 20, bigBlind: 40, ante: 0 },
  { level: 3, durationMinutes: 15, smallBlind: 30, bigBlind: 60, ante: 0 },
  { level: 4, durationMinutes: 15, smallBlind: 50, bigBlind: 100, ante: 0 },
  { level: 5, durationMinutes: 15, smallBlind: 100, bigBlind: 200, ante: 20 },
  { level: 6, durationMinutes: 15, smallBlind: 150, bigBlind: 300, ante: 30 },
  { level: 7, durationMinutes: 15, smallBlind: 200, bigBlind: 400, ante: 40 },
  { level: 8, durationMinutes: 15, smallBlind: 300, bigBlind: 600, ante: 60 },
  { level: 9, durationMinutes: 15, smallBlind: 400, bigBlind: 800, ante: 80 },
  { level: 10, durationMinutes: 15, smallBlind: 500, bigBlind: 1000, ante: 100 },
  { level: 11, durationMinutes: 15, smallBlind: 600, bigBlind: 1200, ante: 120 },
  { level: 12, durationMinutes: 15, smallBlind: 800, bigBlind: 1600, ante: 160 },
  { level: 13, durationMinutes: 15, smallBlind: 1000, bigBlind: 2000, ante: 200 },
  { level: 14, durationMinutes: 15, smallBlind: 1500, bigBlind: 3000, ante: 300 },
  { level: 15, durationMinutes: 15, smallBlind: 2000, bigBlind: 4000, ante: 400 },
  { level: 16, durationMinutes: 15, smallBlind: 3000, bigBlind: 6000, ante: 600 },
  { level: 17, durationMinutes: 15, smallBlind: 4000, bigBlind: 8000, ante: 800 },
  { level: 18, durationMinutes: 15, smallBlind: 5000, bigBlind: 10000, ante: 1000 },
  { level: 19, durationMinutes: 15, smallBlind: 6000, bigBlind: 12000, ante: 1200 },
  { level: 20, durationMinutes: 15, smallBlind: 8000, bigBlind: 16000, ante: 1600 }
];
