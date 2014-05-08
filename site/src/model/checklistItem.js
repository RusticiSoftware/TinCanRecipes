define(
    [
        "backbone",
        "underscore"
    ],
    function (Backbone, _) {
        "use strict";

        return Backbone.Model.extend(
            {
                defaults: {
                    config: null,
                    result: null
                },

                toJSON: function () {
                    return _.extend(
                        _.omit(
                            _.clone(this.attributes),
                            "config"
                        ),
                        {
                            config: this.get("config").toJSON()
                        }
                    );
                }
            }
        );
    }
);
