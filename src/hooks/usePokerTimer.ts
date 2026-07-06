import { useEffect, useMemo, useState } from "react";
import { defaultBlindLevels } from "../data/defaultBlindLevels";
import type { BlindLevel } from "../types/BlindLevel";

const STORAGE_KEY = "poker-timer-levels";

function levelDurationSeconds(level: BlindLevel): number {
  return Math.max(1, level.durationMinutes) * 60;
}

function normalizeLevel(level: BlindLevel): BlindLevel {
  const smallBlind = Math.max(0, Math.floor(level.smallBlind));
  const bigBlind = Math.max(smallBlind, Math.floor(level.bigBlind));

  return {
    level: level.level,
    durationMinutes: Math.max(1, Math.floor(level.durationMinutes)),
    smallBlind,
    bigBlind,
    ante: Math.max(0, Math.floor(level.ante))
  };
}

function isBlindLevel(value: unknown): value is BlindLevel {
  if (!value || typeof value !== "object") {
    return false;
  }

  const level = value as Record<string, unknown>;

  return (
    typeof level.level === "number" &&
    typeof level.durationMinutes === "number" &&
    typeof level.smallBlind === "number" &&
    typeof level.bigBlind === "number" &&
    typeof level.ante === "number"
  );
}

function loadStoredLevels(): BlindLevel[] {
  try {
    const storedLevels = window.localStorage.getItem(STORAGE_KEY);

    if (!storedLevels) {
      return defaultBlindLevels;
    }

    const parsedLevels: unknown = JSON.parse(storedLevels);

    if (!Array.isArray(parsedLevels) || parsedLevels.length !== 20 || !parsedLevels.every(isBlindLevel)) {
      return defaultBlindLevels;
    }

    return parsedLevels.map((level, index) => normalizeLevel({ ...level, level: index + 1 }));
  } catch {
    return defaultBlindLevels;
  }
}

export function usePokerTimer() {
  const [levels, setLevels] = useState<BlindLevel[]>(loadStoredLevels);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(() => levelDurationSeconds(levels[0]));
  const [isRunning, setIsRunning] = useState(false);

  const currentLevel = useMemo(() => levels[currentLevelIndex], [currentLevelIndex, levels]);

  const start = () => {
    if (secondsRemaining > 0) {
      setIsRunning(true);
    }
  };

  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setSecondsRemaining(levelDurationSeconds(levels[currentLevelIndex]));
  };

  const nextLevel = () => {
    setCurrentLevelIndex((previousIndex) => {
      const nextIndex = Math.min(previousIndex + 1, levels.length - 1);
      setSecondsRemaining(levelDurationSeconds(levels[nextIndex]));

      if (nextIndex === previousIndex) {
        setIsRunning(false);
        setSecondsRemaining(0);
      }

      return nextIndex;
    });
  };

  const updateLevels = (updatedLevels: BlindLevel[]) => {
    const normalizedLevels = updatedLevels.map((level, index) => normalizeLevel({ ...level, level: index + 1 }));

    setLevels(normalizedLevels);
    setSecondsRemaining(levelDurationSeconds(normalizedLevels[currentLevelIndex]));
    setIsRunning(false);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedLevels));
  };

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSecondsRemaining((previousSeconds) => {
        if (previousSeconds > 1) {
          return previousSeconds - 1;
        }

        setCurrentLevelIndex((previousIndex) => {
          const nextIndex = previousIndex + 1;

          if (nextIndex >= levels.length) {
            setIsRunning(false);
            return previousIndex;
          }

          return nextIndex;
        });

        return 0;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning, levels.length]);

  useEffect(() => {
    if (secondsRemaining === 0 && isRunning && currentLevelIndex < levels.length - 1) {
      setSecondsRemaining(levelDurationSeconds(levels[currentLevelIndex]));
    }
  }, [currentLevelIndex, isRunning, levels, secondsRemaining]);

  return {
    currentLevel,
    currentLevelIndex,
    secondsRemaining,
    isRunning,
    levels,
    start,
    pause,
    reset,
    nextLevel,
    updateLevels
  };
}
