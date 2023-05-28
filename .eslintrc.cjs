module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: true,
    node: true,
  },
  extends: [
    'plugin:@nexusmods/nexusmods/import',
    'plugin:@nexusmods/nexusmods/react',
    'plugin:@nexusmods/nexusmods/typescript',
    'plugin:@nexusmods/nexusmods/testing',
  ],
  globals: {
    vi: true,
  },
  ignorePatterns: [
    '.eslintrc.cjs',
    'node_modules/*',
  ],
  rules: {
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        '**/*.d.ts',
        'vitest.setup.js',
        'vitest.config.ts',
        '**/__tests__/*',
      ],
    }],

    '@typescript-eslint/no-unused-vars': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],

    curly: ['warn', 'all'],
  },
};
