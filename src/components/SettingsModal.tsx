import { useEffect, useState } from "react";
import type { BlindLevel } from "../types/BlindLevel";
import { BlindLevelEditor } from "./BlindLevelEditor";

const durationPresets = [5, 10, 15, 20];

type SettingsModalProps = {
  isOpen: boolean;
  levels: BlindLevel[];
  isWarningBeepEnabled: boolean;
  onSave: (levels: BlindLevel[], isWarningBeepEnabled: boolean) => void;
  onClose: () => void;
};

export function SettingsModal({ isOpen, levels, isWarningBeepEnabled, onSave, onClose }: SettingsModalProps) {
  const [draftLevels, setDraftLevels] = useState<BlindLevel[]>(levels);
  const [draftWarningBeepEnabled, setDraftWarningBeepEnabled] = useState(isWarningBeepEnabled);

  useEffect(() => {
    if (isOpen) {
      setDraftLevels(levels.map((level) => ({ ...level })));
      setDraftWarningBeepEnabled(isWarningBeepEnabled);
    }
  }, [isOpen, isWarningBeepEnabled, levels]);

  if (!isOpen) {
    return null;
  }

  const handleLevelChange = (updatedLevel: BlindLevel) => {
    setDraftLevels((previousLevels) =>
      previousLevels.map((level) => (level.level === updatedLevel.level ? updatedLevel : level))
    );
  };

  const handleDurationPreset = (durationMinutes: number) => {
    setDraftLevels((previousLevels) =>
      previousLevels.map((level) => ({
        ...level,
        durationMinutes
      }))
    );
  };

  const handleSave = () => {
    onSave(draftLevels, draftWarningBeepEnabled);
    onClose();
  };

  const activeDurationPreset = durationPresets.find((durationMinutes) =>
    draftLevels.every((level) => level.durationMinutes === durationMinutes)
  );

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className="modal-header">
          <h2 id="settings-title">Einstellungen</h2>
          <button type="button" aria-label="Einstellungen schließen" onClick={onClose}>
            Schließen
          </button>
        </div>
        <div className="duration-presets" aria-label="Timerdauer für alle Stufen setzen">
          <span>Timerdauer für alle Stufen</span>
          <div>
            {durationPresets.map((durationMinutes) => (
              <button
                key={durationMinutes}
                type="button"
                className={activeDurationPreset === durationMinutes ? "duration-preset-active" : undefined}
                aria-pressed={activeDurationPreset === durationMinutes}
                onClick={() => handleDurationPreset(durationMinutes)}
              >
                {durationMinutes}:00
              </button>
            ))}
          </div>
        </div>
        <div className="settings-options">
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={draftWarningBeepEnabled}
              onChange={(event) => setDraftWarningBeepEnabled(event.target.checked)}
            />
            <span>Piepsen in den letzten 15 Sekunden</span>
          </label>
        </div>
        <div className="level-editor-list">
          {draftLevels.map((level) => (
            <BlindLevelEditor key={level.level} level={level} onChange={handleLevelChange} />
          ))}
        </div>
        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Abbrechen
          </button>
          <button type="button" className="primary-button" onClick={handleSave}>
            Speichern
          </button>
        </div>
      </section>
    </div>
  );
}
