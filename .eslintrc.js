module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/recommended', '@vue/standard'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': 'off',
    semi: 'off',
    'no-unreachable': 'warn',
    'no-else-return': 'warn',
    'no-multi-spaces': 'warn',
    'no-useless-return': 'warn',
    'no-case-declarations': 'error',
    yoda: 'error',
    'no-use-before-define': 'warn',
    camelcase: ['error', { properties: 'never' }],
    'no-mixed-spaces-and-tabs': 'error',
    'no-duplicate-imports': 'error',
    'prefer-const': 'warn',
    'no-undef': 'error',
    'space-before-function-paren': 'off',
    'one-var': 'off',

    // Extra Vue rules
    'vue/html-closing-bracket-spacing': 'warn',
    'vue/html-closing-bracket-newline': [
      'warn',
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
