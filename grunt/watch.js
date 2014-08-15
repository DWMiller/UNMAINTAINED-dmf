module.exports = {
	js: {
		files: ['js/**/*'],
		tasks: ['newer:jshint', 'newer:concat', 'newer:uglify']
	},
	sass: {
		files: ['sass/**/*'],
		tasks: ['sass']		
	},
	html: {
		files: ['index.html'],
		tasks: ['newer:htmlmin']				
	},
	assets: {
		files: ['assets/**/*'],
		tasks: ['newer:copy']				
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