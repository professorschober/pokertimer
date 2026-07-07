import { formatTime } from "../utils/formatTime";

type TimerDisplayProps = {
  secondsRemaining: number;
};

export function TimerDisplay({ secondsRemaining }: TimerDisplayProps) {
  const isWarningTime = secondsRemaining > 0 && secondsRemaining <= 15;

  return <div className={`timer-display${isWarningTime ? " timer-display-warning" : ""}`}>{formatTime(secondsRemaining)}</div>;
}
