const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  
  const { assetExts } = config.resolver;
  config.resolver.assetExts = [...assetExts, 'json'];

  return config;
})();