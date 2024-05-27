module.exports = {
  //config pour jest
    presets: [
      ['@babel/preset-env', {targets: {node: 'current'}}],
      '@babel/preset-typescript',
    ],
  };