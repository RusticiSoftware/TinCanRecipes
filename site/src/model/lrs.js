define(
    [
        "backbone"
    ],
    function (Backbone) {
        "use strict";

        return Backbone.Model.extend(
            {
                defaults: {
                    endpoint: null,
                    username: null,
                    password: null
                }
            }
        );
    }
);
