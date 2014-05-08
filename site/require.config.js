require.config({
    baseUrl: "../src",
    paths: {
        // App deps
        "jquery": "../bower_components/jquery/jquery",
        "underscore": "../bower_components/underscore/underscore",
        "backbone": "../bower_components/backbone/backbone",
        "backbone.subviews": "../bower_components/backbone.subviews/backbone.subviews",
        "handlebars": "../bower_components/handlebars/handlebars.runtime",
        "moment": "../bower_components/momentjs/moment",
        "tincanjs": "../node_modules/tincan-recipes/node_modules/tincanjs/build/tincan",
        "tincan-recipes": "../node_modules/tincan-recipes/build/recipes",
        "tincan-recipes-checklist": "../node_modules/tincan-recipes-checklist/build/recipes-checklist",
        "tincan-recipes-video": "../node_modules/tincan-recipes-video/build/recipes-video"
    },
    shim: {
        handlebars: {
            exports: "Handlebars",

            // not sure why this is needed in AMD/require.js land but found it here
            // https://github.com/gruntjs/grunt-contrib-handlebars/issues/48#issuecomment-17923555
            init: function() {
                this.Handlebars = Handlebars;
                return this.Handlebars;
            }
        },
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        tincanjs: {
            init: function() {
                this.TinCan = TinCan;
                return this.TinCan;
            }
        }
    },
    urlArgs: "bust=" + (new Date()).getTime() // cache-busting for development
});
