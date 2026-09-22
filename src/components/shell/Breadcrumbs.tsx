import { Link } from "react-router-dom";

export interface Crumb {
  label: string;
  to?: string;
}

/**
 * Breadcrumb trail. Separators are drawn in CSS (`li + li::before`) so the
 * markup stays clean and screen readers announce only the labels; the current
 * page is marked with `aria-current="page"` and truncates when long.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        {items.map((item) => (
          <li key={item.label}>
            {item.to ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}