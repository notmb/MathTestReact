import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true, // Включає генерацію карт джерел
  },
  plugins: [react()],
});
