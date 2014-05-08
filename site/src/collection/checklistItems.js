define(
    [
        "backbone",
        "model/checklistItem"
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
