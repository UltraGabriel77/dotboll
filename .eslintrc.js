module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
    'node': true,
  },
  'extends': [
    'google',
    'plugin:node/recommended',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 12,
  },
  'plugins': [
    'html',
  ],
  'settings': {
    'html/indent': '0',
    'html/indent': '+2',
    'html/indent': 'tab',
  },
  'rules': {
  },
};
