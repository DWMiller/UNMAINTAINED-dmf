module.exports = {
        sass: { 
        	options: {
        		style: 'compressed'
        	},                            // target
            files: {                        // dictionary of files
                'dist/css/production.min.css': 'sass/base.scss'     // 'destination': 'source'
            }
        },

}
