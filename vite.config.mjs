import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function csvPlugin() {
  return {
    name: 'csv-parse',
    load(id) {
      if (!id.endsWith('.csv')) return null;
      const text = readFileSync(id, 'utf-8');
      const { data } = Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });
      return `export default ${JSON.stringify(data)}`;
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE_PATH || '/';

  return {
    base,
    plugins: [react(), csvPlugin()],
    publicDir: 'public',
    server: {
      port: 9001,
      open: true,
    },
    resolve: {
      alias: {
        'process/browser': path.resolve(__dirname, 'node_modules/process/browser.js'),
      },
    },
    optimizeDeps: {
      include: ['mapbox-gl', '@deck.gl/react', '@deck.gl/layers', '@deck.gl/core'],
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
  };
});
