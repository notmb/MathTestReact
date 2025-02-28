import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true, // Включає генерацію карт джерелnpm
    outDir: "docs", // Вказуємо папку для збірки
  },
  plugins: [tailwindcss(), react()],
  base: "/MathTestReact/",
});
