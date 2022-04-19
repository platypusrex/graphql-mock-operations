import { ESLintConfig } from '@beemo/driver-eslint';

const config: ESLintConfig = {
  extends: ['plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint', 'import', 'jest', 'prettier'],
  ignore: [
    '*.generated.ts',
    '*.generated.tsx',
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'error',
    'no-underscore-dangle': 'off',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'import/order': ['error', {'newlines-between': 'never'}],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/array-type': ['error', { default: 'array' }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
      },
    ],
  },
};

export default config;
