import { useState } from "react";
import { BlindInfo } from "./components/BlindInfo";
import { ControlButtons } from "./components/ControlButtons";
import { SettingsButton } from "./components/SettingsButton";
import { SettingsModal } from "./components/SettingsModal";
import { TimerDisplay } from "./components/TimerDisplay";
import { usePokerTimer } from "./hooks/usePokerTimer";

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const {
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
    updateSettings
  } = usePokerTimer();

  const isTournamentFinished = secondsRemaining === 0 && currentLevelIndex === levels.length - 1 && !isRunning;

  return (
    <main className="app-shell">
      <SettingsButton onClick={() => setIsSettingsOpen(true)} />

      <div className="timer-panel">
        <BlindInfo
          level={currentLevel.level}
          smallBlind={currentLevel.smallBlind}
          bigBlind={currentLevel.bigBlind}
          ante={currentLevel.ante}
        />
        <TimerDisplay secondsRemaining={secondsRemaining} />
        {isTournamentFinished && <p className="finished-message">Turnierstruktur beendet</p>}
        <ControlButtons isRunning={isRunning} onStart={start} onPause={pause} onReset={reset} onNextLevel={nextLevel} />
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        levels={levels}
        isWarningBeepEnabled={isWarningBeepEnabled}
        onSave={updateSettings}
        onClose={() => setIsSettingsOpen(false)}
      />
    </main>
  );
}

export default App;
