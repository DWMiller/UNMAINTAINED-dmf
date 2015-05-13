module.exports = {
	js: {
		files: ['js/**/*'],
		// files: ['dmf.js'],
		tasks: ['dev']
	},
	grunt: {
		files: ['grunt/**/*'],
		tasks: [],
		options: {
			spawn: false,
			reload: true
		}
	}
}