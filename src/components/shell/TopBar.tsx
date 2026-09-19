import { Link } from "react-router-dom";
import { promoTopBarCopy } from "@/content/promotions";

export function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar__inner">
        {promoTopBarCopy()} ·{" "}
        <Link to="/offer-terms">offer terms</Link>
      </div>
    </div>
  );
}