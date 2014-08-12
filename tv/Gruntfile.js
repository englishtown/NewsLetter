var extend = require('extend');

module.exports = function(grunt) {
    var config = {
            'app': 'TVChart'
        },
        jsHints = getJSHints(),
        LESSs = getLESSs(),
        lineendings = getLineEndings(),
        pages = (function () {
            var pages = getPages('./src/project');
            for (var i in pages) {
                pages[i] = getPages('./src/project/' + i + '/page');
            }
            return pages;
        })(),
        defaultGruntInitConfigRequireJS = {
            'onBuildRead': onBuildRead,
            'onBuildWrite': onBuildWrite,

            'uglify': {
                'ascii_only': true
            },
            // 'optimize': 'none',

            // 'optimize': 'uglify2',
            // 'generateSourceMaps': true,
            // 'preserveLicenseComments': false,

            'skipModuleInsertion': true
        },
        mainGruntInitConfigRequireJS = getMainGruntInitConfigRequireJS('./src/requirejs/config/main.js'),
        version = grunt.file.readJSON('package.json').version,
        configConnect = {
            options: {
                singleCacheSvr: 'http://localhost:9000',
                hostname: 'localhost',
                port: 9000,
                livereload: 35729
            }
        },
        requirejsExcludeShallow = {},
        filepathTmp = './dist/tmp.js';

    function getJSHints() {
        var watch = {},
            jshint = {};
        grunt.file.recurse('./src', function (abspath, rootdir, subdir, filename) {
            var ma = filename.match(/(^.*)\.js$/i);
            if (ma) {
                var name = (subdir + '/' + ma[1] + '-js').replace(/\//ig, '-'),
                    file = rootdir + '/' + subdir + '/' + ma[1];
                watch[name] = {
                    files: [file + '.js'],
                    tasks: ['jshint:' + name]
                };
                jshint[name] = {
                    options: {},
                    src: [file + '.js']
                };
            }
        });
        return {
            'watch': watch,
            'jshint': jshint
        };
    }

    function getLESSs() {
        var watch = {},
            less = {};
        grunt.file.recurse('./src', function (abspath, rootdir, subdir, filename) {
            var ma = filename.match(/(^.*)\.less$/i);
            if (ma) {
                var name = (subdir + '/' + ma[1] + '-less').replace(/\//ig, '-'),
                    file = rootdir + '/' + subdir + '/' + ma[1];
                watch[name] = {
                    files: [file + '.less'],
                    tasks: ['less:' + name]
                };
                less[name] = {
                    options: {},
                    files: {}
                };
                less[name].files[file + '.css'] = file + '.less';
            }
        });

        return {
            'watch': watch,
            'less': less
        };
    }

    function getLineEndings() {
        var watch = {},
            lineending = {};
        if (grunt.util.linefeed.toString().length > 1) {
            grunt.file.recurse('./src', function (abspath, rootdir, subdir, filename) {
                var ma = filename.match(/(^.*)\.css$/i);
                if (ma) {
                    var name = (subdir + '/' + ma[1] + '-css').replace(/\//ig, '-'),
                        file = rootdir + '/' + subdir + '/' + ma[1];
                    watch[name] = {
                        files: [file + '.css'],
                        tasks: ['lineending:' + name]
                    };
                    lineending[name] = {
                        files: {
                            '': [file + '.css']
                        }
                    };
                }
            });
        }

        return {
            'watch': watch,
            'lineending': lineending
        };
    }

    function getPages(path) {
        var tmpFolderName,
            tmpPageFolderName,
            rePages = {};

        grunt.file.recurse(path, function (abspath, rootdir, subdir, filename) {
            var pos = subdir.indexOf('/'),
                pageName = pos > -1 ? subdir.substr(0, pos) : subdir;
            if (pageName != tmpPageFolderName) {
                rePages[pageName] = [];
                tmpPageFolderName = pageName;
            }
            tmpFolderName = subdir;
        });

        return rePages;
    }

    function getMainGruntInitConfigRequireJS(filePath) {
        var configRe = {},
            strMainGruntInitConfigRequireJS = grunt.file.read(filePath)
                .replace(
                    /^\s*?var *?require *?= *?/ig,
                    'var mainGruntInitConfigRequireJS = '
                )
                .replace(/\s*?\(\s*?config\s*?\)\s*?;?\s*?$/ig, '(' + JSON.stringify(config) + ')');
        eval(strMainGruntInitConfigRequireJS);
        configRe = extend(true, {}, defaultGruntInitConfigRequireJS, mainGruntInitConfigRequireJS);
        delete configRe.context;
        return configRe;
    }

    function onBuildRead(moduleName, path, contents) {
        if (
            /^bower_components\/jquery[-\.]/.test(moduleName)
            || /^shared\/jquery\//.test(moduleName)
        ) {
            if (!(/^define\s*?\(/.test(contents))) {
                contents = 'define("' + moduleName + '", ["jquery"], function ($) { var jQuery = $; ' + contents + '});';
            }
        }
        return contents;
    }

    function onBuildWrite(moduleName, path, contents) {
        if (this.projectName && this.pageName) {
            requirejsExcludeShallow[this.projectName] = requirejsExcludeShallow[this.projectName] || {};
            requirejsExcludeShallow[this.projectName][this.pageName] = requirejsExcludeShallow[this.projectName][this.pageName] || [];
            requirejsExcludeShallow[this.projectName][this.pageName].push(moduleName);
        }
        return contents;
    }

    function middleware(connect, options, middlewares) {
        middlewares.splice(0, 0, function (req, res, next) {
            if (/\.css$/ig.test(req.url)) {
                var singleCacheSvr = configConnect.options.singleCacheSvr,
                    randomCacheSvr = singleCacheSvr,
                    contents = grunt.file.read('./' + req.url);
                contents = contents.replace(/(url\s*?\(\s*?[\'\"]?\s*?)(?:#cacheSvr\d?#)?(\/_imgs\/)/ig, '$1' + randomCacheSvr + '$2');
                contents = contents.replace(/(url\s*?\(\s*?[\'\"]?\s*?)(?:#singleCacheSvr#)?(\/_imgs\/)/ig, '$1' + singleCacheSvr + '$2');
                res.setHeader('Content-Type', 'text/css');
                res.end(contents);
            }
            else {
                return next();
            }
        });
        return middlewares;
    }

    function getGruntInitConfigRequireJS(pages) {
        var configRe = {};
        for (var i in pages) {
            var projectName = i;
            for (var j in pages[i]) {
                var pageName = j;
                configRe[projectName + '-' + pageName] = {
                    options: extend(true, {}, mainGruntInitConfigRequireJS, {
                        projectName: projectName,
                        pageName: pageName,
                        include: config.app + '/project/' + projectName + '/page/' + pageName + '/main',
                        excludeShallow: [],
                        out: './dist/' + version + '/' + projectName + '/' + pageName + '.js'
                    })
                };
            }
        }
        return configRe;
    }

    grunt.initConfig({
        pkg: '<json:package.json>',

        jshint: extend(true, {}, jsHints.jshint),

        less: extend(true, {
            TVChart: {
                options: {
                    paths: ["css"]
                },
                files: {
                    "css/main.css": "css/main.less"
                }
            },
            TVChart: {

            }
        }, LESSs.less),

        lineending: extend(true, {
            options: {
                eol: 'crlf',
                overwrite: true
            },
            TVChart: {
                files: {
                    '': ['css/main.css']
                }
            }
        }, lineendings.lineending),

        requirejs: getGruntInitConfigRequireJS(pages),

        watch: (function () {
            var watchJSHint = extend(true, {}, jsHints.watch),
                watchLESS = extend(true, {}, LESSs.watch),
                watch = extend(true, {}, watchJSHint, watchLESS);
            watch.livereload = {
                options: {
                    livereload: configConnect.options.livereload
                },
                files: [
                    '**/*.html',
                    '**/*.css'
                ]
            };
            return watch;
        })(),

        connect: {
            options: {
                hostname: configConnect.options.hostname,
            },
            TVChart: {
                options: {
                    port: configConnect.options.port,
                    livereload: configConnect.options.livereload,
                    middleware: middleware,
                    open: {
                        target: 'http://' + configConnect.options.hostname + ':' + configConnect.options.port,
                        callback: function () {}
                    }
                }
            }
        },

        uglify: {
            TVChart: {
              options: {
                  banner: '/*! <%= grunt.template.today("dd-mm-yyyy") %> */\n'
              },
              files: {
                  'js/site.min.js': ['<%= concat.TVChart.dest %>']
              }
            },
            always: {
                files: {
                    './dist/tmp.js': [
                        'bower_components/html5shiv/src/html5shiv.js',
                        'src/requirejs/config/main.js',
                        'bower_components/requirejs/require.js'
                    ]
                }
            }
        },

        concat: {
            TVChart: {
                options: {
                    separator: ';'
                },
                src: [
                    'js/jquery-2.1.1.min.js',
                    'js/chart.min.js',
                    'js/moment.min.js',
                    'js/main.js'
                ],
                dest: 'js/site.js'
            }
        },

        clean: {
            always: {
                src: [filepathTmp]
            }
        },

        copy: {

        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-lineending');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');


    grunt.registerTask('livereload', '', function () {
        var pathPage = this.args[0] || '';
        if (pathPage.length > 5) {
            if (pathPage.substr(pathPage.length - 5) != '.html') {
                pathPage += '.html';
            }
        }
        else {
            pathPage += '.html';
        }
        if (grunt.file.exists('./' + pathPage)) {
            grunt.config.set(
                'connect.TVChart.options.open.target',
                'http://' + configConnect.options.hostname + ':' + configConnect.options.port + '/' + pathPage
            );
        }
        grunt.task.run([
            'connect',
            'watch'
        ]);
    });

    grunt.registerTask('fillExcludeShallow', '', function () {
        var projectName = this.args[0],
            pageName = this.args[1];
        if (!projectName || !pageName) {
            return
        }
        grunt.config.set(
            'requirejs.' + projectName + '-' + pageName + '.options.excludeShallow',
            requirejsExcludeShallow[projectName]['master']
        );
    });

    for (var i in pages) {
        grunt.registerTask(i, '', function () {
            var projectName = this.name,
                hasMaster = grunt.config.get('requirejs.' + projectName + '-master'),
                countPages = 0,
                filesConcat = [filepathTmp],
                arrTasks = ['less', 'lineending'];

            if (hasMaster) {
                arrTasks.push('requirejs:' + projectName + '-master');
            }

            for (var j in pages[projectName]) {
                var pageName = j;
                if (pageName != 'master') {
                    if (hasMaster) {
                        arrTasks.push('fillExcludeShallow:' + projectName + ':' + pageName);
                    }
                    arrTasks.push('requirejs:' + projectName + '-' + pageName);
                    countPages++;
                }
            }

            arrTasks.push('uglify:always');
            if (countPages > 1) {
                if (hasMaster) {
                    filesConcat.push('./dist/' + version + '/' + projectName + '/master.js');
                    grunt.config.set('concat.' + projectName, {
                        src: filesConcat,
                        dest: './dist/' + version + '/' + projectName + '/master.js',
                    });
                    arrTasks.push('concat:' + projectName);
                }
                else {
                    for (var j in pages[projectName]) {
                        var pageName = j,
                            filesConcat = [
                                filepathTmp,
                                './dist/' + version + '/' + projectName + '/' + pageName + '.js'
                            ];
                        grunt.config.set('concat.' + projectName + '-' + pageName, {
                            src: filesConcat,
                            dest: './dist/' + version + '/' + projectName + '/' + pageName + '.js',
                        });
                        arrTasks.push('concat:' + projectName + '-' + pageName);
                    }
                }
            }
            else {
                if (hasMaster) {
                    filesConcat.push('./dist/' + version + '/' + projectName + '/master.js');
                }
                for (var j in pages[projectName]) {
                    var pageName = j;
                    if (hasMaster) {
                        if (pageName != 'master') {
                            filesConcat.push('./dist/' + version + '/' + projectName + '/' + pageName + '.js');
                        }
                    }
                    else {
                        filesConcat.push('./dist/' + version + '/' + projectName + '/' + pageName + '.js');
                    }
                }
                grunt.config.set('concat.' + projectName, {
                    src: filesConcat,
                    dest: './dist/' + version + '/' + projectName + '.js',
                });
                arrTasks.push('concat:' + projectName);
            }

            arrTasks.push('clean:always');
            if (countPages <= 1) {
                grunt.config.set('clean.' + projectName, {
                    src: './dist/' + version + '/' + projectName
                });
                arrTasks.push('clean:' + projectName);
            }

            if (grunt.task.exists('callback.' + projectName)) {
                arrTasks.push('callback.' + projectName);
            }

            grunt.task.run(arrTasks);
        });
    }

    grunt.registerTask('callback.offsite2014', '', function () {
        var projectName = 'offsite2014';
        grunt.config.set('copy.callback-' + projectName, {
            src: './dist/' + version + '/' + projectName + '.js',
            dest: './js/' + projectName + '.js',
        });
        grunt.config.set('clean.callback-' + projectName, {
            src: './dist/' + version + '/' + projectName + '.js'
        });
        grunt.task.run([
            'copy:callback-' + projectName,
            'clean:callback-' + projectName
        ]);
    });

    grunt.registerTask('TVChart', ['less:TVChart', 'lineending:TVChart', 'concat:TVChart', 'uglify:TVChart']);
    grunt.registerTask('tvchart', '', function () {grunt.task.run(['TVChart']);});

    grunt.registerTask('default', (function () {
        var arrReturn = ['TVChart'];
        for (var i in pages) {
            arrReturn.push(i);
        }
        return arrReturn
    })());
};
