const path = require('path')

module.exports = {
  entry: './www/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'www')
  },
  module: {
    rules: [
	    {
	        test: /\.scss$/,
	        loader: 'style-loader!css-loader!sass-loader'
	    }
    ] //loaders
} //module
}