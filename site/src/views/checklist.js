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
        "views/base",
        "tincan-recipes-checklist",
        "tincanjs",
        "views/checklistItem"
    ],
    function (
        Backbone,
        templates,
        _,
        ViewBase,
        Recipes,
        TinCan,
        ViewChecklistItem
    ) {
        "use strict";
        var CLASS_NAME = "rs-checklist";

        return ViewBase.extend(
            {
                template: templates["checklist.html"],
                className: CLASS_NAME,
                _recipe: null,

                _renderCfg: {
                    nodes: {
                        items: "." + CLASS_NAME + "-items"
                    }
                },

                events: {
                    "click .rs-checklist-incomplete": "_handleIncomplete",
                    "click .rs-checklist-complete": "_handleComplete",
                    "click .rs-checklist-completePass": "_handleCompletePass",
                    "click .rs-checklist-completeFail": "_handleCompleteFail"
                },

                initialize: function (options) {
                    console.log("views/checklist::initialize");
                    var recipeCfg = {
                            lrs: AppConfig._lrs,
                            actor: this.model.get("actor"),
                            mentor: this.model.get("mentor"),
                            activity: this.model.get("config").toTinCanActivity(),
                            registration: this.model.get("id")
                        };
                    options = options || {};

                    if (_.has(options, "resuming")) {
                        recipeCfg.resuming = options.resuming;
                    }

                    this._recipe = new Recipes.Checklist (recipeCfg);

                    this.listenTo(this.model, "done", this._handleDone);
                    this.listenTo(
                        this.model._items,
                        {
                            "itemResult:clear": this._handleItemClear,
                            "itemResult:pass": this._handleItemPass,
                            "itemResult:fail": this._handleItemFail
                        }
                    );
                },

                renderContext: function () {
                    console.log("views/checklist::renderContext");

                    var context = _.extend(
                        _.clone(
                            ViewBase.prototype.renderContext.call(this)
                        ),
                        this.model.toJSON(),
                        {
                            mentorName: (new TinCan.Agent(this.model.get("mentor"))).toString(),
                            actorName: (new TinCan.Agent(this.model.get("actor"))).toString()
                        }
                    );
                    return context;
                },

                render: function () {
                    console.log("views/checklist::render");
                    ViewBase.prototype.render.apply(this);

                    this.model._items.each(this._renderItem, this);

                    return this;
                },

                done: function () {
                    console.log("views/checklist::_handleDone");
                    this.model.trigger("done", this.model);
                    this.$el.addClass(this.className + "-done");
                },

                _renderItem: function (m) {
                    console.log("views/checklist::_renderItem");
                    var view = new ViewChecklistItem(
                        {
                            model: m
                        }
                    );
                    view.render();

                    this._nodes.items.append(view.el);
                },

                _handleItemResult: function (item, itemResult) {
                    console.log("views/checklist::_handleItemResult");
                    var methodName = "item" + itemResult.charAt(0).toUpperCase() + itemResult.slice(1);

                    this._recipe[methodName](
                        item.get("config").toTinCanActivity(),
                        {
                            callback: function (err, result) {
                                console.log("views/checklist::_handleItemResult - pass/fail - callback:", err);
                                console.log("views/checklist::_handleItemResult - pass/fail - callback:", result);
                                if (err !== null) {
                                    console.log("views/checklist::_handleItemResult - pass/fail - handle error (TODO)");
                                    return;
                                }
                                item.set("result", itemResult);
                            },
                            context: item.get("config").get("context")
                        }
                    );
                },

                _handleItemPass: function (item) {
                    console.log("views/checklist::_handleItemPass");
                    this._handleItemResult(item, "passed");
                },

                _handleItemFail: function (item) {
                    console.log("views/checklist::_handleItemFail");
                    this._handleItemResult(item, "failed");
                },

                _handleItemClear: function (item) {
                    console.log("views/checklist::_handleItemClear");
                    this._recipe.itemCleared(
                        item.get("config").toTinCanActivity(),
                        {
                            callback: function (err, result) {
                                console.log("views/checklist::_handleItemClear - callback:", err);
                                console.log("views/checklist::_handleItemClear - callback:", result);
                                if (err !== null) {
                                    console.log("views/checklist::_handleItemClear - handle error (TODO)");
                                    return;
                                }
                                item.set("result", null);
                            },
                            context: item.get("config").get("context")
                        }
                    );
                },

                _handleIncomplete: function () {
                    console.log("views/checklist::_handleIncomplete");
                    this._recipe.terminated(
                        {
                            callback: _.bind(
                                function (err) {
                                    console.log("views/checklist::_handleIncomplete callback");
                                    if (err !== null) {
                                        console.log("views/checklist::_handleIncomplete callback - err", err);
                                        return;
                                    }
                                    this.done();
                                },
                                this
                            )
                        }
                    );
                },

                _handleComplete: function () {
                    console.log("views/checklist::_handleComplete");
                    this._recipe.completed(
                        {
                            callback: _.bind(
                                function (err) {
                                    console.log("views/checklist::_handleIncomplete callback");
                                    if (err !== null) {
                                        console.log("views/checklist::_handleIncomplete callback - err", err);
                                        return;
                                    }
                                    this.done();
                                },
                                this
                            )
                        }
                    );
                },

                _handleCompletePass: function () {
                    console.log("views/checklist::_handleCompletePass");
                    this._recipe.passed(
                        {
                            callback: _.bind(
                                function (err) {
                                    console.log("views/checklist::_handleIncomplete callback");
                                    if (err !== null) {
                                        console.log("views/checklist::_handleIncomplete callback - err", err);
                                        return;
                                    }
                                    this.done();
                                },
                                this
                            )
                        }
                    );
                },

                _handleCompleteFail: function () {
                    console.log("views/checklist::_handleCompleteFail");
                    this._recipe.failed(
                        {
                            callback: _.bind(
                                function (err) {
                                    console.log("views/checklist::_handleIncomplete callback");
                                    if (err !== null) {
                                        console.log("views/checklist::_handleIncomplete callback - err", err);
                                        return;
                                    }
                                    this.done();
                                },
                                this
                            )
                        }
                    );
                }
            }
        );
    }
);
