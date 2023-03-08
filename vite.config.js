import { defineConfig } from "vite";

// vite.config.js
export default defineConfig({
  build: {
    // generate manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: 'src/form-validator.js',
    },
  },
})
