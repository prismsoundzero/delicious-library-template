'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths for the application
    var base = 'prismsoundzero.libraryhtmltemplate/Contents/Template';
    var appConfig = {
        app: base,
        tmp: '.tmp',
        components: 'bower_components',
        dist: 'dist/' + base
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= config.app %>/**/*.js'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            styles: {
                files: ['<%= config.app %>/css/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            sass: {
                files: ['<%= config.app %>/css/{,*/}*.scss'],
                tasks: ['sass', 'newer:copy:styles', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/**/*.html',
                    '<%= config.tmp %>/css/{,*/}*.css'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                protocol: 'http',
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    protocol: 'http',
                    open: true,
                    middleware: function (connect) {
                        var serveStatic = require('serve-static');
                        return [
                            serveStatic(appConfig.tmp),
                            connect().use(
                                '/bower_components',
                                serveStatic(appConfig.components)
                            ),
                            serveStatic(appConfig.app),
                            connect().use(function (req, res, next) {
                                res.end(grunt.file.read(appConfig.app + '/index.library.html'));
                            })
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= config.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
                force: true
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= config.app %>/{,*/}*.js'
                ]
            }
        },

        // Empties folders to start fresh
        clean: {
            options: {
                force: true
            },
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.tmp %>',
                        'dist'
                    ]
                }]
            },
            server: '<%= config.tmp %>'
        },

        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    '<%= config.app %>/css/style.css': '<%= config.app %>/css/style.scss',
                    '<%= config.app %>/css/bootstrap-custom.css': '<%= config.app %>/css/bootstrap-custom.scss'
                }
            }
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version', 'Safari >= 3', 'Explorer >= 10', 'iOS >= 6', 'Firefox >= 15']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.tmp %>/css/',
                    src: '{,*/}*.css',
                    dest: '<%= config.tmp %>/css/'
                }]
            },
            dev: {
                options: {
                    map: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.tmp %>/css/',
                    src: '{,*/}*.css',
                    dest: '<%= config.tmp %>/css/'
                }]

            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= config.app %>/index.library.html'],
                exclude: [],
                ignorePath:  /\.\.\/\.\.\/\.\.\//
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= config.dist %>/js/{,*/}*.js',
                    '<%= config.dist %>/css/{,*/}*.css'
                    // '<%= config.dist %>/fonts/*'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= config.app %>/index.library.html',
            options: {
                dest: '<%= config.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglify'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/css/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= config.dist %>']
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: false,
                    minifyJS: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>',
                    src: ['**/*.html'],
                    dest: '<%= config.dist %>'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt,xml}',
                        '**/*.html',
                        '../Resources/**/*'
                    ]
                }, {
                    expand: true,
                    cwd: '<%= config.components %>/font-awesome',
                    src: 'fonts/*',
                    dest: '<%= config.dist %>'
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= config.app %>/css',
                dest: '<%= config.tmp %>/css/',
                src: [
                    '{,*/}*.css',
                    '{,*/}*.css.map'
                ]
            }
        },

        ngtemplates: {
            dist: {
                cwd: '<%= config.app %>',
                src: ['*/**/*.html'],
                dest: '<%= config.tmp %>/templates.js',
                options: {
                    module: 'musicApp',
                    usemin: '<%= config.dist %>/js/app.js', // <~~ This came from the <!-- build:js --> block
                    htmlmin: '<%= htmlmin.dist.options %>',
                    quotes: 'single'
                }
            }
        }
    });

    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:dist',
            'wiredep',
            'copy:styles',
            'autoprefixer:dev',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'wiredep',
        'useminPrepare',
        'sass',
        'copy:styles',
        'autoprefixer:dist',
        'ngtemplates:dist',
        'concat',
        'copy:dist',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

};