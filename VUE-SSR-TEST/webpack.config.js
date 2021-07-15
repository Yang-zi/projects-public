const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack  = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')    //[打包end]这个模块的作用是把一些非javascript的文件单独打包成一个静态文件

const isDev = process.env.NODE_ENV === 'development'

const config = {
    mode: 'development',    //开发模式
    target:'web',   //编译目标为web平台
    entry: path.join(__dirname,'src/index.js'),
    output: {
        filename: 'bundle.[hash:8].js',     //开发环境要这么写，正式环境用chunkhash
        path: path.join(__dirname,'dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,   //文件过滤
                use: [
                    {
                        loader: 'url-loader',   //判断文件：小于1024时就转义成base64，以减少http请求
                        options: {
                            limit: 1024,
                            nameL: '[name]-aaa.[ext]'       //name:文件原来的名字+ext:文件后缀名 ; aaa:自定义
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPlugin(),
        new VueLoaderPlugin()
    ]
}


if (isDev) {
    config.module.rules.push({
        test: /\.styl/,         //css预处理器
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            },
            'stylus-loader'
        ]
    })
    config.devtool = '#cheap-module-eval-source-map'
    config.devServer = {
        port: 8000,
        host: '0.0.0.0',
        overlay: {
          errors: true      //将错误信息展现到浏览器上
        },
        // open: true,      //每次npm run dev 后自动打开浏览器
        hot: true       //热更新局部组件
      }
      config.plugins.push(
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoEmitOnErrorsPlugin()
      )
} else {
    //将不变的js单独打包
    config.entry = {
        app: path.join(__dirname,'src/index.js'),
        vendor: ['vue']
    }
    config.output.filename = '[name].[chunkhash:8].js'   //chunkhash：每个chunk会生成单独的hash；hash：是整个应用的hash
    config.module.rules.push({
        test: /\.styl/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: { sourceMap: true }
          },
          'stylus-loader'
        ]
    })
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename: 'styles.[contentHash:8].css'
        })
    )
    //原webpack3+使用的webpack.optimize.CommonsChunkPlugin，换成config.optimization
    config.optimization = {
        runtimeChunk: true,
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                commons: {
                    chunks: "initial",
                    minChunks: 2,
                    maxInitialRequests: 5, // The default limit is too small to showcase the effect
                    minSize: 0 // This is example is too small to create commons chunks
                },
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            },
        }
      }
}



module.exports = config