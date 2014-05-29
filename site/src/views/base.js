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
        "backbone"
    ],
    function (
        Backbone
    ) {
        "use strict";

        return Backbone.View.extend(
            {
                _nodes: null,

                renderCfg: function () {
                    return this._renderCfg || {};
                },

                renderContext: function () {
                    console.log("views/base::renderContext");
                    return {
                        _className: this.className
                    };
                },

                render: function () {
                    console.log("views/base::render");
                    var context = this.renderContext(),
                        renderCfg = this.renderCfg(),
                        prop;

                    this.$el.html(this.template(context));

                    this._nodes = {};
                    if (renderCfg.nodes) {
                        for (prop in renderCfg.nodes) {
                            this._nodes[prop] = this.$(renderCfg.nodes[prop]);
                        }
                    }

                    return this;
                }
            }
        );
    }
);
