type ControlButtonsProps = {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onNextLevel: () => void;
};

export function ControlButtons({ isRunning, onStart, onPause, onReset, onNextLevel }: ControlButtonsProps) {
  return (
    <div className="control-buttons">
      {isRunning ? (
        <button type="button" className="primary-button" onClick={onPause}>
          Pause
        </button>
      ) : (
        <button type="button" className="primary-button" onClick={onStart}>
          Start
        </button>
      )}
      <button type="button" onClick={onReset}>
        Reset
      </button>
      <button type="button" onClick={onNextLevel}>
        Nächste Stufe
      </button>
    </div>
  );
}
