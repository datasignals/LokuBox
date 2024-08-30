import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@repo/common": path.resolve(__dirname, "../../packages/common/src"),
    },
  },
  server: {
    open: true,
  },
  build: {
    outDir: "build",
  },
});

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';
//
// export default defineConfig({
//     plugins: [
//         react()
//     ],
//     resolve: {
//         alias: {
//             '@repo/common': path.resolve(__dirname, '../../packages/common/src'),
//         },
//     },
//     server: {
//         open: true,
//     },
//     build: {
//         outDir: 'build',
//     },
// });
