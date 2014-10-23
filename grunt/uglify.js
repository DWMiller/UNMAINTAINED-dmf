module.exports = {
        options: {
            compress: {
                drop_console: false//true
            }
        },    
    dist: {
        files: {
            'dist/dmf.<%= grunt.file.readJSON( "package.json" ).version %>.min.js': ['dist/dmf.js']
        }
    }
}