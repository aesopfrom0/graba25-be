// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    // ...
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/config/*.yaml', to: 'config/[name].[ext]' }],
    }),
  ],
};
