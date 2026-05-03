const path = require("path");

const entry = path.resolve(__dirname, "src/plugin-entry.js");
const outputPath = path.resolve(__dirname, "dist");

const baseConfig = {
  entry,
  mode: "production",
  optimization: {
    minimize: false
  },
  resolve: {
    extensions: [".js"]
  }
};

module.exports = [
  {
    ...baseConfig,
    output: {
      path: outputPath,
      filename: "uix-components.esm.js",
      clean: true,
      library: {
        type: "module"
      }
    },
    experiments: {
      outputModule: true
    }
  },
  {
    ...baseConfig,
    output: {
      path: outputPath,
      filename: "uix-components.iife.js",
      clean: false,
      library: {
        name: "UIXComponents",
        type: "window"
      }
    }
  }
];
