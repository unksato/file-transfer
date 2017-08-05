module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks("grunt-tslint");

    grunt.initConfig({

        ts: {
            default: {
                tsconfig: {
                    tsconfig: './tsconfig.json',
                    passThrough: true
                }
            },
            test: {
                src: ["src/**/*.ts", "test/**/*.ts"],
                options: {
                    module: 'amd',
                    target: 'es5',
                    sourceMap: true,
                    experimentalDecorators: true
                }
            },
        },

        tslint: {
            options: {
                configuration: 'tslint.json'
            },
            default: {
                src: ['src/**/*.ts']
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

        uglify: {
            default: {
                options: {
                    sourceMap: 'dist/file-transfer.min.js.map',
                    sourceMapRoot: '',
                    sourceMappingURL: 'file-transfer.min.js.map',
                    sourceMapIn: 'dist/file-transfer.js.map',
                    sourceMapPrefix: 1
                },
                files: {
                    'dist/file-transfer.min.js': ['dist/file-transfer.js']
                }
            }
        },

        clean: {
            default: {
                src: ['dist/*', 'src/**/*.js', 'src/**/*.js.map', 'test/**/*.js', 'test/**/*.js.map', 'output/*']
            }
        },
        coveralls: {
            options: {
                force: false
            },
            base: {
                src: 'output/ts-coverage/lcov.info'
            }
        }
    });

    grunt.registerTask('build', ['clean', 'ts:default', 'uglify']);
    grunt.registerTask('test', ['clean', 'ts:test', 'karma']);

}