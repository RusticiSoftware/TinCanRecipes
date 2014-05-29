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

var _VIDEO_TYPE = "http://activitystrea.ms/schema/1.0/video",
    _VERBS = {
        completed: "http://adlnet.gov/expapi/verbs/completed",
        loaded: "http://adlnet.gov/expapi/verbs/launched",
        paused: "http://id.tincanapi.com/verb/paused",
        played: "http://activitystrea.ms/schema/1.0/play",
        skipped: "http://id.tincanapi.com/verb/skipped",
        watched: "http://activitystrea.ms/schema/1.0/watch"
    },
    _EXTS = {
        start: "http://id.tincanapi.com/extension/starting-point",
        end: "http://id.tincanapi.com/extension/ending-point",
        browserInfo: "http://id.tincanapi.com/extension/browser-info"
    };

recipes.Video = function (options) {
    options = options || {};

    this._lrs = options.lrs;
    this._actor = options.actor;
    this._activity = options.activity;

    this._activity.definition = this._activity.definition || {};
    this._activity.definition.type = _VIDEO_TYPE;
};
recipes.Video.prototype = {
    // TODO: refactor this into a core Recipes method?
    _sendStatement: function (statementCfg, options) {
        var statement;

        options = options || {};

        statementCfg.actor = this._actor;
        statementCfg.object = this._activity;
        statementCfg.context = statementCfg.context || {};

        if (navigator) {
            statementCfg.context.extensions = statementCfg.context.extensions || {};
            statementCfg.context.extensions[_EXTS.browserInfo] = {
                code_name:           navigator.appCodeName,
                name:                navigator.appName,
                version:             navigator.appVersion,
                platform:            navigator.platform,
                "user-agent-header": navigator.userAgent,
                "cookies-enabled":   navigator.cookieEnabled
            };
        }

        statementCfg.context.contextActivities = statementCfg.context.contextActivities || {};
        statementCfg.context.contextActivities.category = statementCfg.context.contextActivities.category || [];
        statementCfg.context.contextActivities.category.push(
            {
                // TODO: make this part of this object/class
                id: "http://id.tincanapi.com/recipe/video/base/1",
                definition: {
                    // TODO: make this part of the base class
                    type: "http://id.tincanapi.com/activitytype/recipe"
                }
            }
        );

        statement = new TinCan.Statement(statementCfg);
        this._lrs.saveStatement(
            statement,
            options
        );
    },

    loaded: function (options) {
        this._sendStatement(
            {
                verb: { id: _VERBS.loaded }
            },
            options
        );
    },

    startedPlayingAt: function (time, options) {
        var statementCfg = {
            verb: { id: _VERBS.played },
            context: {
                extensions: {}
            }
        };
        statementCfg.context.extensions[_EXTS.start] = time;

        this._sendStatement(statementCfg, options);
    },

    pausedAt: function (time, options) {
        var statementcfg = {
            verb: { id: _VERBS.paused },
            context: {
                extensions: {}
            }
        };
        statementcfg.context.extensions[_EXTS.end] = time;

        this._sendStatement(statementcfg, options);
    },

    watchedFromTo: function (start, end, options) {
        var statementcfg = {
            verb: { id: _VERBS.watched },
            context: {
                extensions: {}
            }
        };
        statementcfg.context.extensions[_EXTS.start] = start;
        statementcfg.context.extensions[_EXTS.end] = end;

        this._sendStatement(statementcfg, options);
    },

    skippedFromTo: function (start, end, options) {
        var statementcfg = {
            verb: { id: _VERBS.skipped },
            context: {
                extensions: {}
            }
        };
        statementcfg.context.extensions[_EXTS.start] = start;
        statementcfg.context.extensions[_EXTS.end] = end;

        this._sendStatement(statementcfg, options);
    },

    completedAt: function (time, options) {
        var statementcfg = {
            verb: { id: _VERBS.completed },
            context: {
                extensions: {}
            }
        };
        statementcfg.context.extensions[_EXTS.end] = time;

        this._sendStatement(statementcfg, options);
    }
};
