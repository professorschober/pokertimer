type BlindInfoProps = {
  level: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
};

function formatChips(value: number): string {
  return new Intl.NumberFormat("de-AT").format(value);
}

export function BlindInfo({ level, smallBlind, bigBlind, ante }: BlindInfoProps) {
  return (
    <section className="blind-info" aria-label="Aktuelle Blind-Stufe">
      <p className="level-label">Stufe {level}</p>
      <div className="blind-values">
        <div>
          <span>Small Blind</span>
          <strong>{formatChips(smallBlind)}</strong>
        </div>
        <div>
          <span>Big Blind</span>
          <strong>{formatChips(bigBlind)}</strong>
        </div>
        <div>
          <span>Ante</span>
          <strong>{ante > 0 ? formatChips(ante) : "-"}</strong>
        </div>
      </div>
    </section>
  );
}
