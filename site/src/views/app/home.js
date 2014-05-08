define(
    [
        "backbone",
        "templates",
        "views/base",
        "model/lrs",
        "views/lrs/detail",

        // non-positional
        "backbone.subviews"
    ],
    function (
        Backbone,
        templates,
        ViewBase,
        LRS,
        ViewLRS
    ) {
        "use strict";
        var CLASS_NAME = "rs-app-home",
            Clazz;

        Clazz = ViewBase.extend(
            {
                template: templates["app/home.html"],
                className: CLASS_NAME,

                subviewCreators: {
                    lrs: function () {
                        return new ViewLRS (
                            {
                                model: this._lrs
                            }
                        );
                    }
                },

                initialize: function () {
                    console.log("views/app/home::initialize", AppConfig);
                    this._lrs = new LRS(
                        AppConfig.LRS
                    );

                    Backbone.Subviews.add(this);
                }
            }
        );
        return Clazz;
    }
);
