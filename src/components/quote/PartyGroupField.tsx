import { NumberStepper, ReconcileBlock } from "@/components/quote/Controls";
import type { PartyGroupInput, FlowerGirlsUnder12Input } from "@/lib/pricing";

interface PartyGroupFieldProps {
  label: string;
  noun: string;
  value: PartyGroupInput | FlowerGirlsUnder12Input;
  onChange: (value: PartyGroupInput) => void;
  makeupMax?: number;
  hairMax?: number;
  hairError?: string;
}

/** Makeup count, hair count, then the length distribution for the hair looks. */
export function PartyGroupField({
  label,
  noun,
  value,
  onChange,
  makeupMax = 7,
  hairMax = 7,
  hairError,
}: PartyGroupFieldProps) {
  return (
    <div className="panel">
      <h4 style={{ marginBottom: "0.6rem" }}>{label}</h4>
      <div className="field-row field-row--2" style={{ marginBottom: "0.8rem" }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <span className="field__label">Makeup</span>
          <NumberStepper
            value={value.makeup}
            max={makeupMax}
            ariaLabel={`${noun} makeup`}
            onChange={(v) => onChange({ ...value, makeup: v })}
          />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <span className="field__label">Hair</span>
          <NumberStepper
            value={value.hair}
            max={hairMax}
            ariaLabel={`${noun} hair`}
            onChange={(v) => onChange({ ...value, hair: v })}
          />
        </div>
      </div>
      <ReconcileBlock
        noun={noun}
        hairCount={value.hair}
        counts={value.hairCounts}
        onChange={(hairCounts) => onChange({ ...value, hairCounts })}
        error={hairError}
      />
    </div>
  );
}