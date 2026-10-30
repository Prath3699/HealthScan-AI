import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Vitest config kept separate from vite.config.js so the production build
// never loads flowbite/tailwind plugins during tests.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    include: ["src/**/*.test.{js,jsx}"],
    css: false,
  },
});
