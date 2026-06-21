const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Allow .mjs and .cjs files (needed by socket.io-client and axios)
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'mjs',
  'cjs',
];

// Ensure gesture-handler resolves its web-compatible build on web platform
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === 'web' &&
    moduleName === 'react-native-gesture-handler'
  ) {
    return {
      filePath: path.resolve(
        __dirname,
        'node_modules/react-native-gesture-handler/lib/module/index.js'
      ),
      type: 'sourceFile',
    };
  }
  // Fall back to default resolution for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
