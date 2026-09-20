import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";

// Gate JS-only enhancements (photo blur-up) so content always shows without, or
// with stale, JavaScript — mirrors the live `html.js` class.
document.documentElement.classList.add("js");

createRoot(document.getElementById("root")!).render(<App />);