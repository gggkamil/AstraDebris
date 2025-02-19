import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import path from 'path';

const cesiumSource = "C:\\Users\\kamil\\source\\repos\\AstraGrpah\\AstraGraphclient\\public\\cesium";
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      cesium: path.resolve(__dirname, cesiumSource),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5037', 
    },
  },
});