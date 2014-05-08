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
                files: ['src/**/*.js', 'node_modules/tincan-recipes/build/*.js'],
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
            all: ['Gruntfile.js', 'src/**/*.js'],
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
                maxdepth: 3, // Max nesting of methods 3 layers deep
                unused: true, // Warns on unused variables
                expr: true, // Allowed for chais expect(false).to.be.false; assertion style.
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
                    recipes: true,
                    TinCan: true
                }
            }
        },

        umd: {
            all: {
                indent: '    ',
                src: 'src/recipes-video.js',
                dest: 'build/recipes-video.js',
                objectToExport: 'recipes',
                globalAlias: 'TinCanRecipes',
                deps: {
                    'default': ['recipes'],
                    amd: ['tincan-recipes'],
                    cjs: ['tincan-recipes'],
                    global: ['TinCanRecipes']
                }
            }
        }
    });

    // Load Tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-umd');

    // Define tasks
    grunt.registerTask('build', ['jshint', 'umd']);
    grunt.registerTask('default', 'build');
};
