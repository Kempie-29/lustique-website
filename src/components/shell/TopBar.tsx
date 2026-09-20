import { promoTopBarCopy } from "@/content/promotions";

export function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar__inner">{promoTopBarCopy()}</div>
    </div>
  );
}