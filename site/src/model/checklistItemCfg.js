define(
    [
        "backbone"
    ],
    function (Backbone) {
        "use strict";

        return Backbone.Model.extend(
            {
                defaults: {
                    id: null,
                    name: null,
                    description: null,
                    context: null
                }
            }
        );
    }
);
