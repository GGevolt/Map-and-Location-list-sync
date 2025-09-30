import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve("./src/assets"),
      "@utils": path.resolve("./src/utils"),
      "@data": path.resolve("./src/data"),
    },
  },
})
