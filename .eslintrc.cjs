module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    semi: ['error', 'never'],
    'import/newline-after-import': 'off',
    'no-console': 0,
    indent: ['error', 2],
    'arrow-parens': ['error', 'as-needed'],
  },
}
