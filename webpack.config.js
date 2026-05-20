const defaultConfig = require("@wordpress/scripts/config/webpack.config.js");

const plugins = defaultConfig.plugins.filter((p) => {
  if (Object.values(p).length === 2 && Object.values(p)?.[1]["filename"] && Object.values(p)?.[1]["filename"] === "[name]-rtl.css") {
    return false;
  }
  return true;
});


const entry = {
  ...defaultConfig.entry(),
  admin: "./src/js/admin.js",
  dashboard: "./src/dashboard/admin.js",
  player: "./src/js/player.js",
  "h5ap-all": "./src/js/h5ap-all.js",
};

module.exports = {
  ...defaultConfig,
  entry,
  plugins: [...plugins],
  optimization: {},
};
