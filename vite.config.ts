import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true, // Включає генерацію карт джерелnpm
    outDir: "docs", // Вказуємо папку для збірки
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "index.html", // Source file
          dest: "", // Destination directory in the output folder
          rename: "404.html", // Rename the file as 404.html
        },
      ],
    }),
  ],
  base: "/MathTestReact/",
});
