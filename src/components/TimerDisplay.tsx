import { formatTime } from "../utils/formatTime";

type TimerDisplayProps = {
  secondsRemaining: number;
};

export function TimerDisplay({ secondsRemaining }: TimerDisplayProps) {
  return <div className="timer-display">{formatTime(secondsRemaining)}</div>;
}
