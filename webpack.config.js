const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');
const path = require('path');

const config = {
    entry: {
      index: './src/index.js',
    } ,
    output: {
        path: path.resolve(__dirname,  'server/public/static') ,
        filename: '[name].bundle.[fullhash].js', // 'ajoupyterhubv2.js',
    },

    devtool: 'eval-cheap-source-map',
    
    plugins: [
      
      new HtmlWebpackPlugin({
        hash: true,
        template : "./server/public/index.template.html",
      	publicPath : "/static",
        filename : path.resolve(__dirname, "server/public/index.html")
      })
    ],
    optimization: {
      /*
         splitChunks: {
           chunks: 'all',
         }, */
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css'],
        alias: {
          '@assets':    path.resolve(__dirname,'src/assets'),
          '@components': path.resolve(__dirname, 'src/components'),
          '@lib':       path.resolve(__dirname,'src/lib'),
          '@pages':     path.resolve(__dirname,'src/pages'),
          '@styles':    path.resolve(__dirname,'src/styles'),
          '@hooks':     path.resolve(__dirname,'src/hooks'),
        },    
    },
    module: {
      rules: [
        {
          test: /\.jsx?/,
          exclude: /node_modules/,
          use: {
            loader : 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['@babel/plugin-proposal-class-properties', "@babel/plugin-transform-runtime"]   
            }
          }
        },
        {
          test: /\.css$/,
          use : ['style-loader', 'css-loader'], 
        },
      ]
    },
    devServer : {
      contentBase : path.resolve(__dirname, "server/public"),
      port : 5000,
      publicPath : '/',
    },
    mode : 'development',
};
module.exports = config;
