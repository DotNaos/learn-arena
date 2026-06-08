import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const markdownEditorSrc = path.resolve(
  __dirname,
  "node_modules/@aryazos/markdown-editor/packages/react-components/markdown-editor/src",
);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@aryazos/markdown-editor": markdownEditorSrc,
    },
  },
});
