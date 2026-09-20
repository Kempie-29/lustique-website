import { Link } from "react-router-dom";
import { Logo } from "@/components/shell/Logo";

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Lustique Co. — home">
      <Logo variant="emblem" className="brand-mark" alt="" />
      <span className="brand-word">
        Lustique <em>Co.</em>
      </span>
    </Link>
  );
}