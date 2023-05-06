import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'lexical-remark',
      fileName: (format) => `lexical-remark.${format}.js`,
    },
    sourcemap: true,
    target: 'esnext',
    emptyOutDir: true,
    outDir: 'lib',
    minify: false,
    rollupOptions: {
      external: [
        '@lexical/code',
        '@lexical/link',
        '@lexical/list',
        '@lexical/react/LexicalHorizontalRuleNode',
        '@lexical/rich-text',
        'lexical',
      ],
    }
  },
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