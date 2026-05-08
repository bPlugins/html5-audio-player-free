module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  globals: {
    wp: "readonly",
    jQuery: "readonly",
    elementorFrontend: "readonly",
    h5apPlayer: "readonly",
    h5ap_i18n: "readonly",
    Plyr: "readonly",
    h5apAdmin: "readonly",
    bpllch5ap: "readonly",
    elementor: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "func-names": "off",
    "no-console": "warn",
    "no-unused-vars": "warn",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/display-name": "off",
    "no-process-exit": "off",
    "no-unsafe-optional-chaining": "off",
    "object-shorthand": "warn",
    "class-methods-use-this": "off",
    "react/no-unknown-property": ["error", { ignore: ["index", "playsinline", "download", "bisactive", "autoplay"] }],
  }
};
