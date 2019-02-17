module.exports = {
  extends: [
    'plugin:vue/recommended',
    'standard'
  ],
  plugins: ['vue'],
  globals: {
    chrome: true,
    $: true,
    __webpack_public_path__: true
  },
  rules: {
    'comma-dangle': 0,
    'vue/require-prop-types': 'off',
    'vue/max-attributes-per-line': ["error", {
      "singleline": 4,
      "multiline": {
        "max": 4,
        "allowFirstLine": true
      }
    }],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/component-name-in-template-casing': ['error', 'kebab-case']
  }
};
