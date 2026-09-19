import { Minus, Plus } from "lucide-react";
import { HAIR_LENGTHS } from "@/content/pricing";
import { placedHairTotal, type HairCounts } from "@/lib/pricing";

interface NumberStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  ariaLabel: string;
  suffix?: string;
}

export function NumberStepper({
  value,
  min = 0,
  max = 99,
  onChange,
  ariaLabel,
  suffix,
}: NumberStepperProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <span className="stepper">
      <button type="button" onClick={dec} disabled={value <= min} aria-label={`Decrease ${ariaLabel}`}>
        <Minus size={14} aria-hidden="true" />
      </button>
      <span className="stepper__value" aria-live="polite">
        {value}
        {suffix ? <span className="visually-hidden">{suffix}</span> : null}
      </span>
      <button type="button" onClick={inc} disabled={value >= max} aria-label={`Increase ${ariaLabel}`}>
        <Plus size={14} aria-hidden="true" />
      </button>
    </span>
  );
}

interface ReconcileBlockProps {
  /** e.g. "bridesmaid" or "flower girl" */
  noun: string;
  hairCount: number;
  counts: HairCounts;
  onChange: (counts: HairCounts) => void;
  error?: string;
}

/** "Place the N looks that need hair, by length" with a live counter. */
export function ReconcileBlock({ noun, hairCount, counts, onChange, error }: ReconcileBlockProps) {
  if (hairCount <= 0) return null;

  const placed = placedHairTotal(counts);
  const diff = hairCount - placed;

  let counterText: string;
  let counterClass: string;
  if (diff === 0) {
    counterText = `✓ all ${hairCount} placed`;
    counterClass = "ok";
  } else if (diff > 0) {
    counterText = `${placed} of ${hairCount} placed — ${diff} to go`;
    counterClass = "warn";
  } else {
    counterText = `${placed} placed — ${Math.abs(diff)} more than need hair`;
    counterClass = "warn";
  }

  return (
    <div className="reconcile">
      <p className="reconcile__title">
        Place the {hairCount} {noun} {hairCount === 1 ? "look" : "looks"} that need hair, by length
      </p>
      {HAIR_LENGTHS.map((length) => (
        <div className="length-row" key={length.value}>
          <span className="length-row__label">{length.label}</span>
          <NumberStepper
            value={counts[length.value]}
            max={hairCount}
            ariaLabel={`${noun} ${length.label} hair`}
            onChange={(v) => onChange({ ...counts, [length.value]: v })}
          />
        </div>
      ))}
      <p className={`reconcile__counter ${counterClass}`} aria-live="polite">
        {counterText}
      </p>
      {error ? (
        <p className="field__error" role="alert" style={{ marginTop: "0.4rem" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}