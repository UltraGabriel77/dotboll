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
  'parser': '@babel/eslint-parser',
  'parserOptions': {
    'requireConfigFile': false,
    'ecmaVersion': 12,
  },
  'plugins': [
    'html',
    '@babel',
  ],
  'settings': {
    'html/indent': '0',
    'html/indent': '+2',
    'html/indent': 'tab',
  },
  'rules': {
  },
};
