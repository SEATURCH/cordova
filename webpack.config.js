const path = require('path')

module.exports = {
  entry: './www/js/index.js',
  output: {
    filename: './bundle/bundle.js',
    path: path.resolve(__dirname, 'www')
  },
  module: {
    rules: [
	    {
	        test: /\.scss$/,
	        loader: 'style-loader!css-loader!sass-loader'
	    },
      {
         test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
         use: [{
           loader: 'file-loader',
           options: {
             name: '[name].[ext]',
             outputPath: './bundle/fonts/',    // where the fonts will go
             // publicPath: '../'       // override the default path
           }
         }]
       }
    ] //loaders
} //module
}