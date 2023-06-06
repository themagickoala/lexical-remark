/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: process.env.CI ? ['text-summary', 'cobertura'] : ['text-summary', 'html'],
    },
    environment: 'jsdom',
    globals: true,
    include: ['**/*.test.ts'],
    reporters: process.env.CI ? ['default', 'junit'] : ['dot', 'html'],
    useAtomics: true,
  },
});
