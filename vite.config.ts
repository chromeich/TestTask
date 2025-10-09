import { defineConfig } from "vite";
import { resolve } from "path";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    open: true,
  },
  plugins: [viteSingleFile()],
  build: {
    outDir: "dist",
    assetsInlineLimit: Infinity, // inline all assets (100MB limit)
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
    },
  },
  // Ensure images like PNG are always base64 encoded
  assetsInclude: ["**/*.png"],
});
