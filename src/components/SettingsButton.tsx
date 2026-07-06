import { Settings } from "lucide-react";

type SettingsButtonProps = {
  onClick: () => void;
};

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button type="button" className="settings-button" aria-label="Einstellungen öffnen" onClick={onClick}>
      <Settings aria-hidden="true" size={28} strokeWidth={2.25} />
    </button>
  );
}
