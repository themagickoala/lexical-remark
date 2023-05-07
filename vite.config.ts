import { defineConfig } from 'vite';

export default defineConfig({
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