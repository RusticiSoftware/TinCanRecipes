define(
    [
        "backbone",
        "templates",
        "underscore",
        "views/base"
    ],
    function (
        Backbone,
        templates,
        _,
        ViewBase
    ) {
        "use strict";
        var CLASS_NAME = "rs-lrs-detail";

        return ViewBase.extend(
            {
                template: templates["lrs/detail.html"],
                className: CLASS_NAME,

                renderContext: function () {
                    console.log("views/lrs/detail::renderContext");

                    return _.extend(
                        ViewBase.prototype.renderContext.call(this),
                        this.model.toJSON()
                    );
                }
            }
        );
    }
);
