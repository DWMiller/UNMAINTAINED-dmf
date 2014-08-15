module.exports = {
    js: {
        src: [
            'js/libs/**/*.js',
            'js/core.js',
            'js/sandbox.js',
            'js/templates.js',
            'js/config/**/*.js',
            'js/modules/**/*.js',
        ],
        dest: 'dist/js/production.js',
    },
    ie: {
        src:['js/ie/**/*.js'],
        dest: 'dist/js/shiv.js'
    }
}
