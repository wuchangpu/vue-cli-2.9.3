'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production' // 设置当前环境为生产环境

const ora = require('ora') // loading...进度条
const rm = require('rimraf')  // 删除文件 'rm -rf'
const path = require('path')  // stdout颜色设置
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()

// 清空文件夹
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  // 删除完成回调函数内执行编译
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    // 编译完成，输出编译文件
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
