module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
    jest: true
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 11
  },
  rules: {
    'space-before-function-paren': 0 // because of prettier
  }
}
