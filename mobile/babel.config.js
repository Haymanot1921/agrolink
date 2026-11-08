module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@assets': './assets',
            '@components': './src/shared/components',
            '@hooks': './src/shared/hooks',
            '@services': './src/shared/services',
            '@utils': './src/shared/utils',
            '@constants': './src/shared/constants',
            '@store': './src/shared/store',
            '@styles': './src/shared/styles',
            '@modules': './src/modules',
            '@navigation': './src/navigation',
            '@layouts': './src/layouts',
            '@i18n': './src/i18n',
            '@app': './src/app'
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
};