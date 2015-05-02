module.exports = {
	js: {
		// files: ['js/**/*'],
		files: ['dmf.js'],
		tasks: ['concurrent']
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