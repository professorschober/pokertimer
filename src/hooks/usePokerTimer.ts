import { useEffect, useMemo, useState } from "react";
import { defaultBlindLevels } from "../data/defaultBlindLevels";
import type { BlindLevel } from "../types/BlindLevel";

const STORAGE_KEY = "poker-timer-levels-v2";
const WARNING_BEEP_STORAGE_KEY = "poker-timer-warning-beep-enabled";
const LEGACY_STORAGE_KEYS = ["poker-timer-levels"];

type WindowWithWebkitAudioContext = Window & {
  webkitAudioContext?: typeof AudioContext;
};

function levelDurationSeconds(level: BlindLevel): number {
  return Math.max(1, level.durationMinutes) * 60;
}

function normalizeChipValue(value: number): number {
  return Math.max(0, Math.round(value / 10) * 10);
}

function normalizeLevel(level: BlindLevel): BlindLevel {
  const smallBlind = normalizeChipValue(level.smallBlind);
  const bigBlind = Math.max(smallBlind, normalizeChipValue(level.bigBlind));

  return {
    level: level.level,
    durationMinutes: Math.max(1, Math.floor(level.durationMinutes)),
    smallBlind,
    bigBlind,
    ante: normalizeChipValue(level.ante)
  };
}

function loadStoredWarningBeepEnabled(): boolean {
  try {
    const storedValue = window.localStorage.getItem(WARNING_BEEP_STORAGE_KEY);
    return storedValue === null ? true : storedValue === "true";
  } catch {
    return true;
  }
}

function playWarningBeep() {
  try {
    const AudioContextConstructor =
      window.AudioContext ?? (window as WindowWithWebkitAudioContext).webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    const audioContext = new AudioContextConstructor();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const startTime = audioContext.currentTime;
    const stopTime = startTime + 0.11;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.16, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, stopTime);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(startTime);
    oscillator.stop(stopTime);
    oscillator.addEventListener("ended", () => {
      void audioContext.close();
    });
  } catch {
    // Audio is best-effort; browsers can block it until the first user gesture.
  }
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
      LEGACY_STORAGE_KEYS.forEach((storageKey) => window.localStorage.removeItem(storageKey));
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
  const [isWarningBeepEnabled, setIsWarningBeepEnabled] = useState(loadStoredWarningBeepEnabled);

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

  const updateSettings = (updatedLevels: BlindLevel[], updatedWarningBeepEnabled: boolean) => {
    updateLevels(updatedLevels);
    setIsWarningBeepEnabled(updatedWarningBeepEnabled);
    window.localStorage.setItem(WARNING_BEEP_STORAGE_KEY, String(updatedWarningBeepEnabled));
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

  useEffect(() => {
    if (isRunning && isWarningBeepEnabled && secondsRemaining > 0 && secondsRemaining <= 15) {
      playWarningBeep();
    }
  }, [isRunning, isWarningBeepEnabled, secondsRemaining]);

  return {
    currentLevel,
    currentLevelIndex,
    secondsRemaining,
    isRunning,
    isWarningBeepEnabled,
    levels,
    start,
    pause,
    reset,
    nextLevel,
    updateLevels,
    updateSettings
  };
}
