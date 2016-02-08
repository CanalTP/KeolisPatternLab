module.exports = function (grunt) {
    grunt.initConfig({
        browserify: {
            patternlab: {
                src: 'js/main.js',
                dest: 'js/main.min.js',
                options: {
                    browserifyOptions: {
                        paths: ['./js/mock', './js/modules', './_patterns'],
                        debug: true
                    },
                    transform: ['twigify-patternlab']
                }
            },
            nmp: {
                src: 'js/modules.js',
                dest: 'js/modules.min.js',
                options: {
                    browserifyOptions: {
                        paths: ['./js/modules', './_patterns'],
                        debug: true
                    },
                    transform: ['twigify-patternlab']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.registerTask('default', ['browserify']);
};