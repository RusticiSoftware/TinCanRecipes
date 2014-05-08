define(
    [
        "backbone",
        "model/checklistCfg"
    ],
    function (Backbone, Model) {
        "use strict";

        return Backbone.Collection.extend(
            {
                model: Model
            }
        );
    }
);
