import { defineConfig } from "vitest/config";
import path from "path";

// Pure-engine unit tests only (no JSX), so no React plugin is required here.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.ts"],
  },
});