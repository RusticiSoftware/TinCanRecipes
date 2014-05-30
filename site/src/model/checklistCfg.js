/*
    Copyright 2014 Rustici Software

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
define(
    [
        "backbone",
        "underscore",
        "tincanjs",
        "collection/checklistItemCfgs"
    ],
    function (Backbone, _, TinCan, Items) {
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
                },

                toTinCanActivity: function () {
                    var attrs = _.clone(this.attributes),
                        cfg = {
                            id: this.id
                        };
                    if (attrs.name !== null || attrs.description !== null) {
                        cfg.definition = {};
                        if (attrs.name !== null) {
                            cfg.definition.name = {
                                "en-US": attrs.name
                            };
                        }
                        if (attrs.description !== null) {
                            cfg.definition.description = {
                                "en-US": attrs.description
                            };
                        }
                    }
                    return new TinCan.Activity(cfg);
                }
            }
        );
    }
);
