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
        "tincanjs"
    ],
    function (Backbone, TinCan) {
        "use strict";

        return Backbone.Model.extend(
            {
                defaults: {
                    id: null,
                    name: null,
                    description: null,
                    context: null
                },

                toTinCanActivity: function () {
                    var toJSON = this.toJSON(),
                        cfg = {
                            id: this.id
                        };
                    if (toJSON.name !== null || toJSON.description !== null) {
                        cfg.definition = {};
                        if (toJSON.name !== null) {
                            cfg.definition.name = {
                                "en-US": toJSON.name
                            };
                        }
                        if (toJSON.description !== null) {
                            cfg.definition.description = {
                                "en-US": toJSON.description
                            };
                        }
                    }
                    return new TinCan.Activity(cfg);
                }
            }
        );
    }
);
