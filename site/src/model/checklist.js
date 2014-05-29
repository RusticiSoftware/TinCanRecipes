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
        "collection/checklistItems"
    ],
    function (Backbone, _, TinCan, Items) {
        "use strict";
        var STATE_KEY = "itemResults";

        return Backbone.Model.extend(
            {
                defaults: {
                    // stores a model/checklistCfg
                    config: null,
                    actor: null,
                    mentor: null
                },
                _items: null,
                _etag: null,

                initialize: function () {
                    var items = [];
                    this.get("config")._items.each(
                        function (m) {
                            items.push(
                                {
                                    id: m.get("id"),
                                    config: m
                                }
                            );
                        },
                        this
                    );
                    this._items = new Items (items);

                    this.listenTo(
                        this._items,
                        "change:result",
                        function (model, changed, options) {
                            console.log("model/checklist::initialize - _items change:result", options);
                            if (typeof options.src === "undefined" || options.src !== "load") {
                                this.saveItemResults();
                            }
                        }
                    );
                },

                toJSON: function () {
                    return _.extend(
                        _.omit(
                            _.clone(this.attributes),
                            "config"
                        ),
                        {
                            items: this._items.toJSON(),
                            config: this.get("config").toJSON()
                        }
                    );
                },

                loadItemResults: function () {
                    console.log("model/checklist::loadItemResults");

                    AppConfig._lrs.retrieveState(
                        STATE_KEY,
                        {
                            registration: this.get("id"),
                            agent: new TinCan.Agent(this.get("mentor")),
                            activity: {
                                id: this.get("config").get("id")
                            },
                            callback: _.bind(
                                function (err, state) {
                                    console.log("model/checklist::loadItemResults");
                                    console.log("model/checklist::loadItemResults - err", err);
                                    var i,
                                        item;

                                    if (err !== null) {
                                        console.log("model/checklist::loadItemResults - error loading item results", err);
                                        return;
                                    }
                                    if (state === null) {
                                        // not previously stored, must be a new instance
                                        return;
                                    }

                                    this._etag = state.etag;

                                    for (i = 0; i < state.contents.length; i += 1) {
                                        item = this._items.get(state.contents[i].id);
                                        if (item) {
                                            item.set("result", (state.contents[i].result || null), { src: "load" });
                                        }
                                    }
                                },
                                this
                            )
                        }
                    );
                },

                saveItemResults: function () {
                    console.log("model/checklist::saveItemResults");
                    var json = [];
                    this._items.each(
                        function (m) {
                            json.push(
                                _.omit(
                                    _.clone(m.attributes),
                                    "config"
                                )
                            );
                        }
                    );

                    AppConfig._lrs.saveState(
                        STATE_KEY,
                        json,
                        {
                            contentType: "application/json",
                            lastSHA1: this._etag,
                            registration: this.get("id"),
                            agent: new TinCan.Agent(this.get("mentor")),
                            activity: {
                                id: this.get("config").get("id")
                            },
                            callback: _.bind(
                                function (err, result) {
                                    console.log("model/checklist::saveItemResults");
                                    console.log("model/checklist::saveItemResults - err", err);
                                    console.log("model/checklist::saveItemResults - result", result);
                                    if (err !== null) {
                                        console.log("model/checklist::saveItemResults - error saving item results", err);
                                        return;
                                    }

                                    // TODO: need to update local etag so that the next save pass succeeds
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
