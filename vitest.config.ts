import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

const MIN_COVERAGE = 99;

export default defineConfig({
  plugins: [
    tsconfigPaths()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      thresholds: {
        statements: MIN_COVERAGE,
        branches: MIN_COVERAGE,
        functions: MIN_COVERAGE,
        lines: MIN_COVERAGE,
      }
    }
  }
})