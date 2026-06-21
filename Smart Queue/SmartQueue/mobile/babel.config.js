module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          // Disable auto-detection so babel-preset-expo does NOT try to load
          // react-native-worklets/plugin (which is not installed).
          // We add react-native-reanimated/plugin manually below instead.
          reanimated: false,
          worklets: false,
        },
      ],
    ],
    plugins: [
      // Manually add reanimated plugin — must be last
      'react-native-reanimated/plugin',
    ],
  };
};
