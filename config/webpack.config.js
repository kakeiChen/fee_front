const argv = require('yargs').argv;
const webpack = require('webpack');
const cssnano = require('cssnano');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const project = require('./project.config');
const debug = require('debug')('app:config:webpack');
const path = require('path');
const pxtorem = require('postcss-pxtorem');

const __DEV__ = project.globals.__DEV__;
const __PROD__ = project.globals.__PROD__;
const __UAT__ = project.globals.__UAT__;
const __RELEASE__ = project.globals.__RELEASE__;
const __DEVREMOTE__ = project.globals.__DEVREMOTE__;
const __TEST__ = project.globals.__TEST__;

debug('Creating configuration.');
const webpackConfig = {
  name    : 'client',
  target  : 'web',
  devtool : project.compiler_devtool,
  resolve : {
    // 1 to 2
    // root       : project.paths.client(),
    modules: [
      project.paths.client(),
      'node_modules',
    ],
    extensions : ['*', '.web.js', '.js', '.jsx', '.json'],
  },
  module : {
    rules: [],
  },
};
// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY = project.paths.client('main.jsx');

webpackConfig.entry = {
  app : __DEV__
    ? [APP_ENTRY].concat(`webpack-hot-middleware/client?path=${project.compiler_public_path}__webpack_hmr`)
    : [APP_ENTRY],
  vendor : project.compiler_vendors,
};

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename   : `[name].[${project.compiler_hash_type}].js`,
  path       : project.paths.dist(),
  publicPath : project.compiler_public_path,
};

// ------------------------------------
// Externals
// ------------------------------------
webpackConfig.externals = {};
webpackConfig.externals['react/lib/ExecutionEnvironment'] = true;
webpackConfig.externals['react/lib/ReactContext'] = true;
webpackConfig.externals['react/addons'] = true;

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.DefinePlugin(project.globals),
  new HtmlWebpackPlugin({
    template : project.paths.client('index.html'),
    hash     : false,
    favicon  : project.paths.public('favicon.ico'),
    filename : 'index.html',
    inject   : 'body',
    minify   : {
      collapseWhitespace : true,
    },
  }),
];

// Ensure that the compiler exits on errors during testing so that
// they do not get skipped and misreported.
if (__TEST__ && !argv.watch) {
  webpackConfig.plugins.push(function () {
    this.plugin('done', (stats) => {
      if (stats.compilation.errors.length) {
        // Pretend no assets were generated. This prevents the tests
        // from running making it clear that there were warnings.
        throw new Error(
          stats.compilation.errors.map((err) => err.message || err)
        );
      }
    });
  });
}

if (__DEV__) {
  debug('Enabling plugins for live development (HMR, NamedModules).');
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  );
} else if (__PROD__ || __UAT__ || __DEVREMOTE__ || __RELEASE__) {
  debug('Enabling plugins for production (LoaderOptions & UglifyJS).');
  webpackConfig.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: !!webpackConfig.devtool,
      comments: false,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
    })
  );
}

// Don't split bundles during testing, since we only want import one bundle
if (!__TEST__) {
  webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names : ['vendor'],
    })
  );
}

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.rules.push({
  test    : /\.(js|jsx)$/,
  exclude : /node_modules/,
  use: [{
    loader: 'babel-loader',
    query: project.compiler_babel,
  }],
}, {
  enforce: 'pre',
  test    : /\.(js|jsx)$/,
  include: path.join(__dirname, '../src'),
  loader  : 'eslint-loader',
});

// ------------------------------------
// Style Loaders
// ------------------------------------
// We use cssnano with the postcss loader, so we tell
// css-loader not to duplicate minimization.
const extractStyles = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  allChunks: true,
});

const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: true,
    minimize: {
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['last 2 versions'],
      },
      discardComments: {
        removeAll : true,
      },
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      safe: true,
      sourcemap: true,
    },
  },
};

webpackConfig.module.rules.push({
  test: /\.(sass|scss)$/,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [
      cssLoader,
      {
        loader: 'postcss-loader',
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          includePaths : [
            project.paths.client('styles'),
          ],
        },
      },
    ],
  }),
});

webpackConfig.module.rules.push({
  test: /\.css$/,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [
      cssLoader,
      {
        loader: 'postcss-loader',
      },
    ],
  }),
});

webpackConfig.module.rules.push({
  test: /\.less$/,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [
      cssLoader,
      {
        loader: 'postcss-loader',
      },
      {
        loader: 'less-loader',
      },
    ],
  }),
});

webpackConfig.plugins.push(extractStyles);

webpackConfig.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());

// Images
// ------------------------------------
webpackConfig.module.rules.push({
  test    : /\.(png|jpg|gif)$/,
  loader  : 'url-loader',
  options : {
    limit : 8192,
  },
});

// Fonts
// ------------------------------------
[
  ['woff', 'application/font-woff'],
  ['woff2', 'application/font-woff2'],
  ['otf', 'font/opentype'],
  ['ttf', 'application/octet-stream'],
  ['eot', 'application/vnd.ms-fontobject'],
].forEach((font) => {
  const extension = font[0];
  const mimetype = font[1];

  webpackConfig.module.rules.push({
    test    : new RegExp(`\\.${extension}$`),
    loader  : 'url-loader',
    options : {
      name  : 'fonts/[name].[ext]',
      limit : 10000,
      mimetype,
    },
  });
});

const svgDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''), // 1. 属于 antd-mobile 内置 svg 文件
  // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 2. 自己私人的 svg 存放目录
];

webpackConfig.module.rules.push({
  test: /\.(svg)$/i,
  loader: 'svg-sprite-loader',
  include: svgDirs, // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
});

module.exports = webpackConfig;
