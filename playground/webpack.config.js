var path = require('path');

module.exports = {
	entry: './js/app.js',
	output:{
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist/')
	},
		devtool: 'source-map',
		devServer:{
			contentBase: 'dist',
			inline: true
		},
	module: {
         loaders: [{
             test: /\.js$/,
             exclude: /node_modules/,
             loader: 'babel-loader'
         }]
     }
}