module.exports = function(grunt) {
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dev: {
                src: 'lib/DashjsWrapper.js',
                dest: 'dist/dashjs-p2p-wrapper.debug.js',
                options:  {
                    browserifyOptions: {
                        standalone: 'DashjsWrapper',
                        debug: true
                    },
                    watch: true,
                    keepAlive: true
                }
            },
            prod: {
                src: 'lib/DashjsWrapper.js',
                dest: 'dist/dashjs-p2p-wrapper.js',
                options:  {
                    browserifyOptions: {
                        standalone: 'DashjsWrapper',
                        debug: false,
                    },
                    watch: false,
                    keepAlive: false,
                }
            },
            bundle: {
                src: 'lib/DashjsMediaPlayerBundle.js',
                dest: 'dist/dashjs-p2p-bundle.debug.js',
                options:  {
                    browserifyOptions: {
                        standalone: 'DashjsP2PBundle',
                        debug: true
                    },
                    watch: true,
                    keepAlive: true
                }
            }
        },
        uglify: {
            options: {
                mangle: true,
                compress: {
                    drop_console: true
                },
                beautify: false
            },
            dist: {
                files: {
                    'dist/dashjs-p2p-wrapper.min.js': 'dist/dashjs-p2p-wrapper.js'
                }
            }
        }
    });

    grunt.registerTask('build', 'build dist script', ['browserify:prod', 'uglify:dist']);
};
