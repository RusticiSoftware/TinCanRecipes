define(
    [
        "backbone",
        "model/checklistItemCfg"
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
