const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add custom asset extensions (Lottie animations, fonts)
config.resolver.assetExts.push('lottie', 'ttf', 'otf');

// Allow .cjs imports (used by some npm packages)
config.resolver.sourceExts.push('cjs');

// SVG support — install react-native-svg-transformer and uncomment
// const { transformer, resolver } = config;
// config.transformer = {
//   ...transformer,
//   babelTransformerPath: require.resolve('react-native-svg-transformer'),
// };
// config.resolver = {
//   ...resolver,
//   assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
//   sourceExts: [...resolver.sourceExts, 'svg'],
// };

module.exports = config;