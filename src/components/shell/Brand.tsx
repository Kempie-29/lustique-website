import { useState } from "react";
import { Link } from "react-router-dom";
import { Monogram } from "@/components/shell/Monogram";

export function Brand() {
  const [logoOk, setLogoOk] = useState(true);

  return (
    <Link to="/" className="brand" aria-label="Lustique Co. — home">
      {logoOk ? (
        <img
          className="brand-mark"
          src="/assets/logo.svg"
          alt=""
          width={42}
          height={42}
          onError={() => setLogoOk(false)}
        />
      ) : (
        <span className="brand-mark" style={{ display: "grid", placeItems: "center" }}>
          <Monogram mark="LC" />
        </span>
      )}
      <span className="brand-word">
        Lustique <em>Co.</em>
      </span>
    </Link>
  );
}