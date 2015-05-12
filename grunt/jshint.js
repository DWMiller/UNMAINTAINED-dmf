module.exports = {
    options: {
        reporter: require('jshint-stylish'),
        bitwise:true,
        browser: true,
        curly: true,
        eqeqeq: true,
        strict: true,
        globals: {
            // app: true,
        },
    },
    // files: ['dmf.js']
    files: ['js/**/*']
}
