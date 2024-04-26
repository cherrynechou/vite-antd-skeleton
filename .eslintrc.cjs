module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    "@typescript-eslint/no-explicit-any": ['off'],//允许使用any
    '@typescript-eslint/no-unused-vars': ['off'],
    '@typescript-eslint/ban-ts-comment': 'off', //允许使用@ts-ignore
    'no-var': 'warn', // 禁止出现var用let和const代替
    quotes: ['warn', 'single', 'avoid-escape'], // 要求统一使用单引号符号
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
