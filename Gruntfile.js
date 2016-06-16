function browserifyHelper(src, dest, standalone, isDev) {
    return {
        src: src,
        dest: dest,
        options: {
            transform: ['babelify', ['uglifyify', {
                global: true,
                mangle: true,
                compress: {
                    drop_console: !isDev
                }
            }]],
            plugins: [
                ['browserify-derequire']
            ],
            browserifyOptions: {
                debug: !!isDev,
                standalone: standalone
            },
            watch: !!isDev,
            keepAlive: !!isDev
        }
    };
}

module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            wrapper: browserifyHelper(
                'lib/DashjsWrapper.js',
                'dist/wrapper/dashjs-p2p-wrapper.js',
                'DashjsWrapper',
                false
            ),
            wrapper_dev: browserifyHelper(
                    'lib/DashjsWrapper.js',
                    'dist/wrapper/dashjs-p2p-wrapper.debug.js',
                    'DashjsWrapper',
                    true
                )
                // bundle: browserifyHelper(
                //     'lib/DashjsBundle.js',
                //     'dist/bundle/dashjs-p2p-bundle.js',
                //     'Dashjs',
                //     false
                // ),
                // bundle_dev: browserifyHelper(
                //     'lib/DashjsBundle.js',
                //     'dist/bundle/dashjs-p2p-bundle.js',
                //     'Dashjs',
                //     true
                // )
        }
    });

    grunt.registerTask('build', 'build dist script', ['browserify:wrapper' /*, 'browserify:bundle'*/ ]);
};
