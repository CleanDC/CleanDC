const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader')
const _ = require('lodash')

module.exports = function (env, { mode = 'development' }) {
  const { production, development } = { [mode]: true }
  const base = opt => _.mergeWith({
    mode,
    devtool: production ? false : 'inline-source-map',
    module: {
      rules: [
        { test: /\.vue$/, loader: 'vue-loader' },
        { test: /\.css$/, exclude: path.resolve(__dirname, 'src'), loader: 'vue-style-loader' },
        { test: /\.css$/, loader: 'css-loader' },
        { test: /\.(png|woff2|svg|jpg|gif)$/, loader: 'file-loader?outputPath=files/' }
      ],
    },
    plugins: [new VueLoaderPlugin()],
    performance: { maxAssetSize: 1000 * 1024, maxEntrypointSize: 500 * 1024 },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'build')
    }
  }, opt, (o, n) => _.isArray(o) ? o.concat(n).filter(x => x) : n)
  return [
    base({
      entry: {
        background: './src/background.js',
        cleandc: './src/cleandc.js',
      },
      plugins: [
        development && new ChromeExtensionReloader(),
        new CopyWebpackPlugin([
          './node_modules/jquery/dist/jquery.min.js',
          './src/manifest.json',
          { from: './icons/', to: path.resolve(__dirname, 'build', 'icons'), toType: 'dir' }
        ]),
      ],
    }),
    base({
      entry: {
        popup: './pages/popup.js',
        options: './pages/options.js',
      },
      plugins: [new CopyWebpackPlugin(['./pages/options.html', './pages/popup.html'])]
    }),
    base({ entry: { helper: './helper/helper.js' } })
  ]
}
