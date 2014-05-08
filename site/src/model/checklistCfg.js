define(
    [
        "backbone",
        "underscore",
        "collection/checklistItemCfgs"
    ],
    function (Backbone, _, Items) {
        "use strict";

        return Backbone.Model.extend(
            {
                defaults: {
                    id: null,
                    name: null,
                    description: null
                },
                _items: null,

                initialize: function (cfg) {
                    this._items = new Items (cfg.items);
                },

                toJSON: function () {
                    return _.extend(
                        _.clone(this.attributes),
                        {
                            items: this._items.toJSON()
                        }
                    );
                }
            }
        );
    }
);
