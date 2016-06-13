function browserifyHelper(src, dest, standalone, isDev) {
    return {
        src: src,
        dest: dest,
        options: {
            transform: ['babelify', ['uglifyify', {
                global: true,
                mangle: true,
                compress: {
                    drop_console: true
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
        shell: {
            dashjs_clean: 'rm -Rf dashjs',
            dashjs_copy: 'cp -R node_modules/dashjs .',
            dashjs_build: 'cd dashjs && npm install && grunt'
        },
        browserify: {
            bundle: browserifyHelper(
                'lib/DashjsMediaPlayerBundle.js',
                'dist/dashjs-p2p-bundle.debug.js',
                'DashjsP2PBundle',
                false
            ),
            bundle_dev: browserifyHelper(
                'lib/DashjsMediaPlayerBundle.js',
                'dist/dashjs-p2p-bundle.debug.js',
                'DashjsP2PBundle',
                true
            ),
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

    grunt.registerTask('dashjs', ['shell:dashjs_clean', 'shell:dashjs_copy', 'shell:dashjs_build']);
    grunt.registerTask('build', 'build dist script', ['browserify:prod', 'uglify:dist']);
};
