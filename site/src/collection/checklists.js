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
        "model/checklist"
    ],
    function (Backbone, _, Model) {
        "use strict";

        return Backbone.Collection.extend(
            {
                model: Model,
                _cfg: null,
                _etag: null,

                initialize: function (models, cfg) {
                    console.log("collection/checklists::initialize", cfg);

                    this._cfg = cfg.config;
                },

                save: function (options) {
                    console.log("collection/checklists::save");
                    var json = this.toJSON();

                    options = options || {};

                    AppConfig._lrs.saveActivityProfile(
                        "existing",
                        json,
                        {
                            contentType: "application/json",
                            lastSHA1: this._etag,
                            activity: {
                                id: this._cfg.get("id")
                            },
                            callback: _.bind(
                                function (err, result) {
                                    console.log("collection/checklists::save - saveActivityProfile: ", err);
                                    console.log("collection/checklists::save - saveActivityProfile: ", result);
                                    if (err !== null) {
                                        if (options.error) {
                                            options.error(err);
                                        }

                                        return;
                                    }

                                    if (options.success) {
                                        options.success(result);
                                    }
                                },
                                this
                            )
                        }
                    );
                },

                parse: function (response) {
                    console.log("collection/checklists::parse");

                    if (response !== null) {
                        this._etag = response.etag;
                        _.each(
                            response.contents,
                            function (v) {
                                v.config = this._cfg;
                            },
                            this
                        );

                        return response.contents;
                    }

                    return response;
                },

                sync: function (method, collection, options) {
                    console.log("collection/checklists::sync");

                    if (method === "read") {
                        AppConfig._lrs.retrieveActivityProfile(
                            "existing",
                            {
                                activity: {
                                    id: this._cfg.get("id")
                                },
                                callback: _.bind(
                                    function (err, result) {
                                        //console.log("collection/checklists::sync - retrieveActivityProfile: ", err);
                                        //console.log("collection/checklists::sync - retrieveActivityProfile: ", result);
                                        if (err !== null) {
                                            if (options.error) {
                                                options.error(err);
                                            }

                                            return;
                                        }

                                        if (options.success) {
                                            options.success(result);
                                        }
                                    },
                                    this
                                )
                            }
                        );
                    }
                    else {
                        console.log("collection/checklists::sync - method not supported: " + method);
                    }
                }
            }
        );
    }
);
