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
        "templates",
        "views/base",
        "model/lrs",
        "views/lrs/detail",

        // non-positional
        "backbone.subviews"
    ],
    function (
        Backbone,
        templates,
        ViewBase,
        LRS,
        ViewLRS
    ) {
        "use strict";
        var CLASS_NAME = "rs-app-home",
            Clazz;

        Clazz = ViewBase.extend(
            {
                template: templates["app/home.html"],
                className: CLASS_NAME,

                subviewCreators: {
                    lrs: function () {
                        return new ViewLRS (
                            {
                                model: this._lrs
                            }
                        );
                    }
                },

                initialize: function () {
                    console.log("views/app/home::initialize", AppConfig);
                    this._lrs = new LRS(
                        AppConfig.LRS
                    );

                    Backbone.Subviews.add(this);
                }
            }
        );
        return Clazz;
    }
);
