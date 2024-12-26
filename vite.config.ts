import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true, // Включає генерацію карт джерелnpm
    outDir: "docs", // Вказуємо папку для збірки
  },
  plugins: [react()],
  base: "/MathTestReact/",
});
