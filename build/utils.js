'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path) // posix方法修正路径
}

exports.cssLoaders = function (options) { // 示例： ({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  // 生成 loader
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    // 生产模式中提取css
    if (options.extract) { // 如果 options 中的 extract 为 true 配合生产模式
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader' // 默认使用 vue-style-loader
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return { // 返回各种 loaders 对象
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
    // 示例：
    // {
    //   test: new RegExp(\\.less$),
    //   use: {
    //     loader: 'less-loader', options: { sourceMap: true/false }
    //   }
    // }
  }

  return output
}

exports.createNotifierCallback = () => { // 配合 friendly-errors-webpack-plugin
  // 基本用法：notifier.notify('message');
  const notifier = require('node-notifier') // 发送跨平台通知系统

  return (severity, errors) => {
    // 当前设定是只有出现 error 错误时触发 notifier 发送通知
    if (severity !== 'error') return // 严重程度可以是 'error' 或 'warning'

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png') // 通知图标
    })
  }
}
