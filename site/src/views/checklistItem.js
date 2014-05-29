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
        "underscore",
        "views/base"
    ],
    function (
        Backbone,
        templates,
        _,
        ViewBase
    ) {
        "use strict";
        var CLASS_NAME = "rs-checklistItem",
            CLASS_HAS_RESULT = CLASS_NAME + "-hasResult",
            CLASS_SAVING = CLASS_NAME + "-saving";

        return ViewBase.extend(
            {
                template: templates["checklistItem.html"],
                className: CLASS_NAME,
                events: {
                    "click .rs-checklistItem-choice": "_handleItemChoice"
                },

                initialize: function () {
                    console.log("views/checklistItem::initialize");
                    this.listenTo(
                        this.model,
                        "change:result",
                        function (m) {
                            console.log("views/checklistItem::initialize - model result change");
                            var result = m.get("result");

                            if (result === null) {
                                this.$el.removeClass(CLASS_HAS_RESULT);
                                this.$el.removeClass(this.className + "-result-passed");
                                this.$el.removeClass(this.className + "-result-failed");
                            }
                            else {
                                this.$el.addClass(CLASS_HAS_RESULT);
                                this.$el.addClass(this.className + "-result-" + result);
                            }

                            this.$el.removeClass(CLASS_SAVING);
                        }
                    );
                },

                renderContext: function () {
                    console.log("views/checklistItem::renderContext");

                    return _.extend(
                        _.clone(
                            ViewBase.prototype.renderContext.call(this)
                        ),
                        this.model.toJSON()
                    );
                },

                render: function () {
                    console.log("views/checklistItem::render");
                    ViewBase.prototype.render.apply(this);

                    this.$el.addClass("pure-u-1-3");

                    if (this.model.get("result") !== null) {
                        this.$el.addClass(CLASS_HAS_RESULT);
                        this.$el.addClass(this.className + "-result-" + this.model.get("result"));
                    }

                    return this;
                },

                _handleItemChoice: function (e) {
                    console.log("views/checklistItem::_handleItemChoice");
                    var target = Backbone.$(e.target),
                        itemChoice = target.val();

                    this.$el.addClass(CLASS_SAVING);

                    this.model.trigger("itemResult:" + itemChoice, this.model);
                }
            }
        );
    }
);
