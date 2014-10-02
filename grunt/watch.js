module.exports = {
	js: {
		files: ['js/**/*'],
		tasks: ['newer:jshint', 'newer:concat', 'newer:uglify']
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