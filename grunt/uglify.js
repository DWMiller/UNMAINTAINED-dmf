module.exports = {
        options: {
            compress: {
                drop_console: false//true
            }
        },    
    dist: {
        files: {
            'dist/dmf.<%= package.version %>.min.js': ['dist/dmf.js']
        }
    }
}