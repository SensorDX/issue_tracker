module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
                '* <%= pkg.name %> - v<%= pkg.version %> - Auto-compiled on <%= grunt.template.today("yyyy-mm-dd") %> - Copyright <%= grunt.template.today("yyyy") %> \n' +
                '* @author <%= pkg.author %>\n' +
                '*/',
        pathDev: 'src',
        pathBuild: 'dist',
        pathAssets: 'assets',
        watch: {
            styles: {
                files: ['<%= pathDev %>/<%= pathAssets %>/less/**/*.less'],
                tasks: ['less:dev_main', 'less:dev_themes'],
                options: {
                    nospawn: true
                }
            }
        },
        clean: {
            build: {
                src: ['<%= pathBuild %>/']
            }
        },
        less: {
            dev_main: {
                options: {
                    banner: '<%= banner %>'
                },
                files: {
                    '<%= pathDev %>/<%= pathAssets %>/css/oneui.css': '<%= pathDev %>/<%= pathAssets %>/less/main.less'
                }
            },
            dev_themes: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2,
                    banner: '<%= banner %>'
                },
                files: {
                    '<%= pathDev %>/<%= pathAssets %>/css/themes/amethyst.min.css': '<%= pathDev %>/<%= pathAssets %>/less/themes/amethyst.less',
                    '<%= pathDev %>/<%= pathAssets %>/css/themes/city.min.css': '<%= pathDev %>/<%= pathAssets %>/less/themes/city.less',
                    '<%= pathDev %>/<%= pathAssets %>/css/themes/flat.min.css': '<%= pathDev %>/<%= pathAssets %>/less/themes/flat.less',
                    '<%= pathDev %>/<%= pathAssets %>/css/themes/modern.min.css': '<%= pathDev %>/<%= pathAssets %>/less/themes/modern.less',
                    '<%= pathDev %>/<%= pathAssets %>/css/themes/smooth.min.css': '<%= pathDev %>/<%= pathAssets %>/less/themes/smooth.less'
                }
            },
            build: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2,
                    banner: '<%= banner %>'
                },
                files: {
                    '<%= pathBuild %>/<%= pathAssets %>/css/oneui.min.css': '<%= pathDev %>/<%= pathAssets %>/less/main.less',
                    '<%= pathBuild %>/<%= pathAssets %>/css/themes/amethyst.min.css': '<%= pathDev %>/<%= pathAssets %>/less/themes/amethyst.less',
                    '<%= pathBuild %>/<%= pathAssets %>/css/themes/city.min.css': '<%= pathDev %>/<%= pathAssets %>/less/themes/city.less',
                    '<%= pathBuild %>/<%= pathAssets %>/css/themes/flat.min.css': '<%= pathDev %>/<%= pathAssets %>/less/themes/flat.less',
                    '<%= pathBuild %>/<%= pathAssets %>/css/themes/modern.min.css': '<%= pathDev %>/<%= pathAssets %>/less/themes/modern.less',
                    '<%= pathBuild %>/<%= pathAssets %>/css/themes/smooth.min.css': '<%= pathDev %>/<%= pathAssets %>/less/themes/smooth.less'
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            build: {
                src: [
                    '<%= pathDev %>/<%= pathAssets %>/js/core/jquery.min.js',
                    '<%= pathDev %>/<%= pathAssets %>/js/core/bootstrap.min.js',
                    '<%= pathDev %>/<%= pathAssets %>/js/core/jquery.slimscroll.min.js',
                    '<%= pathDev %>/<%= pathAssets %>/js/core/jquery.scrollLock.min.js',
                    '<%= pathDev %>/<%= pathAssets %>/js/core/jquery.appear.min.js',
                    '<%= pathDev %>/<%= pathAssets %>/js/core/jquery.countTo.min.js',
                    '<%= pathDev %>/<%= pathAssets %>/js/core/jquery.placeholder.min.js',
                    '<%= pathDev %>/<%= pathAssets %>/js/core/angular.min.js',
                    '<%= pathDev %>/<%= pathAssets %>/js/core/angular-ui-router.min.js',
                    '<%= pathDev %>/<%= pathAssets %>/js/core/angular-ui-bootstrap-tpls.min.js',
                    '<%= pathDev %>/<%= pathAssets %>/js/core/ocLazyLoad.min.js',
                    '<%= pathDev %>/<%= pathAssets %>/js/core/ngStorage.min.js',
                    '<%= pathDev %>/<%= pathAssets %>/js/app.js',
                    '<%= pathDev %>/<%= pathAssets %>/js/directives.js',
                    '<%= pathDev %>/<%= pathAssets %>/js/controllers.js'
                ],
                dest: '<%= pathBuild %>/<%= pathAssets %>/js/oneui.min.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                mangle: false
            },
            build: {
                files: {
                    '<%= pathBuild %>/<%= pathAssets %>/js/oneui.min.js': ['<%= pathBuild %>/<%= pathAssets %>/js/oneui.min.js']
                }
            }
        },
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= pathDev %>/<%= pathAssets %>/css/',
                        src: 'bootstrap.min.css',
                        dest: '<%= pathBuild %>/<%= pathAssets %>/css/'
                    },
                    {
                        expand: true,
                        cwd: '<%= pathDev %>/<%= pathAssets %>/fonts/',
                        src: '**',
                        dest: '<%= pathBuild %>/<%= pathAssets %>/fonts/'
                    },
                    {
                        expand: true,
                        cwd: '<%= pathDev %>/<%= pathAssets %>/img/',
                        src: '**',
                        dest: '<%= pathBuild %>/<%= pathAssets %>/img/'
                    },
                    {
                        expand: true,
                        cwd: '<%= pathDev %>/<%= pathAssets %>/views/',
                        src: '**',
                        dest: '<%= pathBuild %>/<%= pathAssets %>/views/'
                    },
                    {
                        expand: true,
                        cwd: '<%= pathDev %>/<%= pathAssets %>/js/plugins/',
                        src: '**',
                        dest: '<%= pathBuild %>/<%= pathAssets %>/js/plugins/'
                    }
                ]
            }
        },
        processhtml: {
            build: {
                files: {
                    '<%= pathBuild %>/index.html': ['<%= pathDev %>/index.html']
                }
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-processhtml');

    // Register Tasks
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['clean:build', 'less:build', 'concat:build', 'uglify:build', 'copy:build', 'processhtml:build']);
};