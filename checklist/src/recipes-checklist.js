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
"0.0.1";

var _VERBS = {
        started: "http://activitystrea.ms/schema/1.0/start",
        cleared: "http://activitystrea.ms/schema/1.0/unsave",
        closed: "http://activitystrea.ms/schema/1.0/close",
        completed: "http://activitystrea.ms/schema/1.0/complete",
        opened: "http://activitystrea.ms/schema/1.0/open",
        terminated: "http://activitystrea.ms/schema/1.0/terminate"
    };

recipes.Checklist = function (options) {
    var initVerb = _VERBS.started;

    options = options || {};

    if (options.resuming) {
        initVerb = _VERBS.opened;
    }

    this._lrs = options.lrs;
    this._actor = options.actor;
    this._mentor = options.mentor;
    this._activity = options.activity;
    this._registration = options.registration;

    this._sendStatement(
        {
            verb: initVerb,
            object: this._activity
        },
        {
            // force async
            callback: function () {}
        }
    );
};
recipes.Checklist.prototype = {
    // TODO: refactor this into a core Recipes method?
    _sendStatement: function (statementCfg, options) {
        var statement;

        options = options || {};

        statementCfg.context = statementCfg.context || {};
        statementCfg.context.contextActivities = statementCfg.context.contextActivities || {};
        statementCfg.context.contextActivities.category = statementCfg.context.contextActivities.category || [];
        statementCfg.context.contextActivities.category.push(
            {
                // TODO: make this part of this object/class
                id: "http://id.tincanapi.com/recipe/checklist-sample/1",
                definition: {
                    // TODO: make this part of the base class
                    type: "http://id.tincanapi.com/activitytype/recipe"
                }
            }
        );
        statementCfg.actor = this._actor;
        statementCfg.context.instructor = this._mentor;
        statementCfg.context.registration = this._registration;

        statement = new TinCan.Statement(statementCfg);
        this._lrs.saveStatement(
            statement,
            options
        );
    },

    closed: function (options) {
        this._sendStatement(
            {
                verb: _VERBS.closed,
                object: this._activity
            },
            options
        );
    },

    terminated: function (options) {
        this._sendStatement(
            {
                verb: _VERBS.terminated,
                object: this._activity
            },
            options
        );
    },

    completed: function (options) {
        var statementCfg = {
            verb: _VERBS.completed,
            object: this._activity
        };

        options = options || {};

        if (typeof options.success !== "undefined") {
            statementCfg.result = statementCfg.result || {};
            statementCfg.result.success = options.success;
        }

        this._sendStatement(statementCfg, options);
    },

    passed: function (options) {
        options = options || {};
        options.success = true;

        this.completed(options);
    },

    failed: function (options) {
        options = options || {};
        options.success = false;

        this.completed(options);
    },

    itemPassed: function (activityId, options) {
        this._sendItemResult("passed", activityId, options);
    },

    itemFailed: function (activityId, options) {
        this._sendItemResult("failed", activityId, options);
    },

    itemCleared: function (activityId, options) {
        this._sendItemResult(null, activityId, options);
    },

    // TODO: allow pass Activity?
    _sendItemResult: function (result, activityId, options) {
        options = options || {};

        var statementCfg = {
                verb: {},
                object: {
                    // TODO: add a definition with a type, name, description, etc.
                    id: activityId
                },
                context: {
                    contextActivities: {
                        parent: [
                            this._activity
                        ]
                    }
                }
            };

        if (result === null) {
            statementCfg.verb.id = _VERBS.cleared;
        }
        else {
            statementCfg.verb.id = _VERBS.completed;
            statementCfg.result = options.result = options.result || {};
            options.result.success = options.result.success || {};

            if (result === "passed") {
                options.result.success = true;
            }
            else if (result === "failed") {
                options.result.success = false;
            }
        }

        this._sendStatement(statementCfg, options);
    }
};
