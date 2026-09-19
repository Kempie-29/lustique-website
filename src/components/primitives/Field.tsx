import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  errorId?: string;
  className?: string;
  children: ReactNode;
}

/** Form field wrapper with label, optional hint and inline error. */
export function Field({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  errorId,
  className = "",
  children,
}: FieldProps) {
  return (
    <div className={`field ${error ? "has-error" : ""} ${className}`.trim()}>
      <label htmlFor={htmlFor}>
        {label}
        {required ? <span className="field__req"> *</span> : null}
      </label>
      {children}
      {hint ? <span className="field__hint">{hint}</span> : null}
      {error ? (
        <span className="field__error" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}