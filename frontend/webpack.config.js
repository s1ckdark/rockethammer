// Imports
const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

// Path Config
const PROJECT_ROOT = path.resolve(__dirname)
const PUBLIC_INDEX = path.resolve(PROJECT_ROOT, 'public', 'index.html')
const SRC_PATH = path.resolve(__dirname, 'src')
const BUILD_PATH = path.resolve(PROJECT_ROOT, 'build')
const PUBLIC_URL = process.env.PUBLIC_URL || '/';

module.exports = webpackEnv => {
    const mode = webpackEnv.WEBPACK_SERVE ? 'development' : 'production'
    const isEnvDevelopment = mode === 'development'
    const isEnvProduction = mode === 'production'
    return {
       mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
        entry: path.resolve(SRC_PATH, 'index.js'),
        output: {
            path: BUILD_PATH,
            filename: isEnvDevelopment ? 'js/[name].[contenthash:8].js' : 'js/bundle.js',
            clean: true,
            publicPath: PUBLIC_URL
        },
        module: {
            rules: [
                {
                    test:/\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                          presets: [
                            "@babel/preset-env", ["@babel/preset-react", {"runtime": "automatic"}]
                          ]
                        }
                    }
                },
                {
                  test: /\.(sa|sc|c)ss$/, // styles files
                  use: ["style-loader",'css-loader' ,'resolve-url-loader', {
                    loader: 'sass-loader',
                    options: {
                      sourceMap: true,
                    }
                  }],
                },
                {
                  test: /\.(png|jpg|svg)$/i,
                  type: 'asset',
                  generator: {
                    filename: 'img/[name][ext]'
                  },
                  parser: {
                    dataUrlCondition: {
                      maxSize: 4 * 1024,
                    },
                  },
                },
                {
                  test: /\.(woff|woff2|eot|ttf|otf)$/i,
                  type: 'asset',
                  generator: {
                    filename: 'fonts/[name][ext]'
                  },
                  parser: {
                    dataUrlCondition: {
                      maxSize: 4 * 1024,
                    },
                  },
                },
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json']
        },
        plugins: [
            new HtmlWebpackPlugin({
              template: PUBLIC_INDEX,
              favicon: "./public/favicon.ico",
              filename: "index.html",
              manifest: "./public/manifest.json",
            }),
            new Dotenv({
              path: './.env'
            }),
            new NodePolyfillPlugin(),
            new CleanWebpackPlugin(), // 성공적으로 다시 빌드 한 후 webpack의 output.path에있는 모든 빌드 폴더를 제거 및 정리
            new MiniCssExtractPlugin(), // 별도로 css 파일을 만들어서 빌드하는 Plugin,
            new webpack.DefinePlugin({
              'process.env.ASSET_PATH': JSON.stringify(PUBLIC_URL),
            }),
          ],
        cache: {
            type: isEnvDevelopment ? 'memory' : 'filesystem',
        },
        devServer: {
            port: 3000, // port 설정
            host: 'localhost', // host 설정
            open: true, // 서버를 실행했을 때, 브라우저를 열어주는 여부
            compress: true,
            historyApiFallback: true
        },
        watchOptions: {
          poll: true,
          ignored: '/node_modules/',
        }
    }
}
