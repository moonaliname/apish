import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@app": resolve(__dirname, "./src/app"),
      "@pages": resolve(__dirname, "./src/pages"),
      "@widgets": resolve(__dirname, "./src/widgets"),
      "@features": resolve(__dirname, "./src/features"),
      "@entities": resolve(__dirname, "./src/entities"),
      "@shared": resolve(__dirname, "./src/shared"),
      "@assets": resolve(__dirname, "./src/assets"),
    },
  },
});
