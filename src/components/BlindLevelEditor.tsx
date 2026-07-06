import type { BlindLevel } from "../types/BlindLevel";

type BlindLevelEditorProps = {
  level: BlindLevel;
  onChange: (updatedLevel: BlindLevel) => void;
};

type NumericField = "durationMinutes" | "smallBlind" | "bigBlind" | "ante";

const fieldLabels: Record<NumericField, string> = {
  durationMinutes: "Dauer (Min.)",
  smallBlind: "Small Blind",
  bigBlind: "Big Blind",
  ante: "Ante"
};

export function BlindLevelEditor({ level, onChange }: BlindLevelEditorProps) {
  const normalizeChipValue = (value: number) => Math.max(0, Math.round(value / 10) * 10);

  const handleNumberChange = (field: NumericField, value: string) => {
    const parsedValue = Number.parseInt(value, 10);
    const safeValue = Number.isNaN(parsedValue) ? 0 : parsedValue;
    const minimum = field === "durationMinutes" ? 1 : 0;
    const nextValue = field === "durationMinutes" ? Math.max(minimum, safeValue) : normalizeChipValue(safeValue);
    const updatedLevel = { ...level, [field]: nextValue };

    if (field === "smallBlind" && updatedLevel.bigBlind < updatedLevel.smallBlind) {
      updatedLevel.bigBlind = updatedLevel.smallBlind;
    }

    if (field === "bigBlind" && updatedLevel.bigBlind < updatedLevel.smallBlind) {
      updatedLevel.bigBlind = updatedLevel.smallBlind;
    }

    onChange(updatedLevel);
  };

  return (
    <div className="level-editor">
      <strong className="editor-level">Stufe {level.level}</strong>
      {(Object.keys(fieldLabels) as NumericField[]).map((field) => (
        <label key={field}>
          <span>{fieldLabels[field]}</span>
          <input
            type="number"
            min={field === "durationMinutes" ? 1 : 0}
            step={field === "durationMinutes" ? 1 : 10}
            value={level[field]}
            onChange={(event) => handleNumberChange(field, event.target.value)}
          />
        </label>
      ))}
    </div>
  );
}
