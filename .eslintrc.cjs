module.exports = {
  root: true,
  env: {
    node: true,
    es2023: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      typescript: true,
    },
  },
  ignorePatterns: ['node_modules', 'dist', 'build'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
  ],
};
