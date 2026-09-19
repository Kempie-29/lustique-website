import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "ink" | "outline" | "light" | "whatsapp";
type Size = "sm" | "md" | "lg";

export interface ButtonProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
  children: ReactNode;
  /** Internal route — renders a React Router link. */
  to?: string;
  /** External URL — renders an anchor. */
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  target?: string;
  rel?: string;
  "aria-label"?: string;
}

/**
 * Button primitive. Renders a <button>, an internal <Link>, or an external
 * anchor depending on the props — never a default-styled shadcn button.
 */
export function Button({
  variant = "primary",
  size = "md",
  block = false,
  className = "",
  children,
  to,
  href,
  type = "button",
  onClick,
  disabled,
  target,
  rel,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const classes = [
    "btn",
    `btn--${variant}`,
    size === "sm" ? "btn--sm" : size === "lg" ? "btn--lg" : "",
    block ? "btn--block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={target}
        rel={rel}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}