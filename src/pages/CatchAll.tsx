import { Navigate, useLocation } from "react-router-dom";
import NotFound from "@/pages/NotFound";

/**
 * Catch-all route. Legacy `.html` URLs are redirected to their clean path;
 * anything else renders the designed 404.
 */
export default function CatchAll() {
  const location = useLocation();

  if (location.pathname.endsWith(".html")) {
    const clean = location.pathname.replace(/\.html$/, "");
    return <Navigate to={clean || "/"} replace />;
  }

  return <NotFound />;
}