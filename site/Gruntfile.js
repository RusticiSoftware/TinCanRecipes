/*global module:false*/
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /**
        *  Watching
        *  ========
        *
        *  Automatically tests and builds your code
        *  whenever you edit the source files or tests.
        */
        watch: {
            scripts: {
                files: [
                    'src/**/!(templates).js',
                    'src/**/*.html',
                    'src/**/*.less',
                    'tests/**/*.js',
                    'node_modules/tincan-recipes/build/*.js',
                    'node_modules/tincan-recipes-checklist/build/*.js',
                    'node_modules/tincan-recipes-video/build/*.js'
                ],
                tasks: ['build'],
                options: {
                    interrupt: true
                }
            }
        },

        /**
        *  Linting
        *  =======
        *
        *  Catch errors quickly with JS Hint
        */
        jshint: {
            all: ['Gruntfile.js', 'src/**/!(templates).js', 'test/!(libs)/*.js'],
            options: {
                es5: false, // Allows EcmaScript5 syntax
                curly: true, // Always use curlys {}
                eqeqeq: true, // No more == for you, === only
                immed: true, // prohibits the use of immediate function invocations without wrapping them in parentheses
                latedef: true, // no setting variables before they are defined
                newcap: true, // Always call constructors with a Cap
                noarg: true, // prohibits arguments.caller and arguments.callee
                sub: true, // This option suppresses warnings about using [] notation when it can be expressed in dot notation: person['name'] vs. person.name.
                undef: true, // prohibits the use of explicitly undeclared variables
                boss: true, // Allows assignments in ifs - if (a = 10) {}
                eqnull: true, // Allows == null check for null or undefined
                browser: true, // Sets up globals for browser like window and document
                maxdepth: 6, // Max nesting of methods 3 layers deep
                unused: true, // Warns on unused variables
                expr: false, // Allowed for chais expect(false).to.be.false; assertion style.
                devel: true, // Allows console.log's etc
                trailing: true, // Prohibits trailing whitespace
                bitwise: true,
                forin: false,
                noempty: true,
                nomen: false,
                onevar: true,
                plusplus: false,
                regexp: false,
                strict: false,
                debug: false, // allow debugger statements

                globals: {
                    require: true,
                    define: true,
                    requirejs: true,
                    suite: true,
                    expect: true,
                    test: true,
                    setup: true,
                    teardown: true,
                    sinon: true,
                    mocha: true,
                    AppConfig: true
                }
            }
        },

        /**
        *  Templating
        *  ==========
        *
        *  Pre-compile your handlebars templates
        */
        handlebars: {
            compile: {
                options: {
                    amd: true,
                    wrapped: true,
                    processName: function(filename) {
                        return filename.replace("src/templates/", "");
                    }
                },
                files: {
                    "src/templates.js": "src/**/*.html"
                }
            }
        },

        /**
        *  Building
        *  ========
        *
        *  Build your amd modules into a single minified JS file
        */
        requirejs: {
            compile: {
                options: {
                    name: "../bower_components/almond/almond", // Path to almond requirejs production runner for built js
                    baseUrl: "src",
                    mainConfigFile: "./require.config.js",
                    include: ["main"], // Include the main module defined
                    insertRequire: ["main"], // Add a require step in at the end for the main module.
                    wrap: true, // Wrap everything up in a closure
                    generateSourceMaps: true, // Experimental
                    preserveLicenseComments: false, // Needs turned off for generateSourceMaps
                    optimize: "uglify2", // Supports generateSourceMaps
                    out: "assets/javascripts/build.js"
                }
            }
        },

        /**
         *  Stylesheets
         *  ===========
         *
         *  Compile, concat & lint css and less files into a single output file
         */
        less: {
            dist: {
                options: {
                    paths: ["src/styles"],
                    yuicompress: true
                },
                files: {
                    'assets/stylesheets/styles.css': 'src/styles/main.less'
                }
            }
        }
    });

    // Version assets
    grunt.registerTask('version-assets', 'version the static assets just created', function() {
        var Version = require("node-version-assets"),
            versionInstance = new Version({
                assets: ['assets/stylesheets/styles.css', 'assets/javascripts/build.js'],
                grepFiles: ['index.html']
            }),
            cb = this.async(); // grunt async callback
        versionInstance.run(cb);
    });

    // Load Tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    // Define tasks
    grunt.registerTask('styles', ['less']);
    grunt.registerTask('build', ['jshint', 'handlebars', 'requirejs', 'styles', 'version-assets']);
    grunt.registerTask('default', 'build');
};
