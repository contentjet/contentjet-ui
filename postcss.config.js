module.exports = {
  parser: 'postcss-scss',
  plugins: {
    'postcss-import': {
      path: [
        './src/styles/'
      ]
    },
    'postcss-nested': {},
    'postcss-extend': {},
    'postcss-cssnext': {},
    'lost': {}
  }
};
