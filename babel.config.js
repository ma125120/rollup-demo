module.exports = {
  plugins: [['styled-components', { ssr: true }]],
  presets: [
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  sourceType: 'unambiguous',
};
