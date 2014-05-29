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
        "underscore",
        "views/agent",
        "tincan-recipes-video"
    ],
    function (
        Backbone,
        templates,
        ViewBase,
        _,
        ViewAgent,
        Recipes
    ) {
        /*global YT*/
        "use strict";
        var CLASS_NAME = "rs-app-video",
            API_LOADING_CLASS_NAME = CLASS_NAME + "-apiLoading",
            EXT_DURATION = "http://id.tincanapi.com/extension/duration";

        return ViewBase.extend(
            {
                template: templates["app/video.html"],
                className: CLASS_NAME,
                events: {
                    "click .rs-app-video-loadVideo": "loadVideo"
                },

                _renderCfg: {
                    nodes: {
                        player: "." + CLASS_NAME + "-player",
                        videoUrl: "input." + CLASS_NAME + "-videoUrl",
                        error: "." + CLASS_NAME + "-error"
                    }
                },

                subviewCreators: {
                    agent: function () {
                        return new ViewAgent (
                            {
                                label: "Watcher"
                            }
                        );
                    }
                },

                _rendered: null,
                _apiLoaded: null,
                _recipe: null,
                _player: null,
                _playerLastState: null,
                _playerLastTime: null,

                initialize:  function () {
                    console.log("views/app/video::initialize");

                    this._apiLoaded = false;
                    this._rendered = false;

                    this.$el.addClass(API_LOADING_CLASS_NAME);

                    window.onYouTubeIframeAPIReady = _.bind(this._YTAPIReady, this);

                    //
                    // load the YouTube Player API
                    //
                    Backbone.$("script").append('<script src="https://www.youtube.com/iframe_api"></script>');
                    Backbone.Subviews.add(this);
                },

                render: function () {
                    console.log("views/app/video::render");
                    ViewBase.prototype.render.apply(this);

                    this._rendered = true;

                    if (this._apiLoaded) {
                        this._renderPlayer();
                    }

                    return this;
                },

                loadVideo: function () {
                    console.log("views/app/video::loadVideo");
                    var videoUrl = this._nodes.videoUrl.val(),
                        actorCfg = this.subviews.agent.getCfg(),
                        videoId;

                    this._playerLastState = null;
                    this._playerLastTime = null;
                    this._loadError(null);

                    if (! this._player) {
                        this._loadError("Player not available");
                        return;
                    }
                    if (videoUrl === "") {
                        this._loadError("No URL provided");
                        return;
                    }
                    if (! actorCfg) {
                        this._loadError("Watcher configuration required");
                        return;
                    }

                    videoId = this._idFromUrl(videoUrl);
                    if (typeof videoId === "undefined" || videoId === "") {
                        this._loadError("Unable to determine video id from URL");
                        return;
                    }

                    Backbone.$.ajax(
                        "http://gdata.youtube.com/feeds/api/videos/" + videoId + "?v=2&alt=jsonc",
                        {
                            method: "GET",
                            success: _.bind(
                                function (meta) {
                                    console.log("views/app/video::loadVideo - success");
                                    var video = meta.data,
                                        name = video.title,
                                        description = video.description,
                                        duration = video.duration,
                                        definition = {
                                            name: {
                                                "en-US": name
                                            },
                                            description: {
                                                "en-US": description
                                            }
                                        };

                                    if (duration > 0) {
                                        definition.extensions = {};
                                        definition.extensions[EXT_DURATION] = duration;
                                    }

                                    this._recipe = new Recipes.Video (
                                        {
                                            lrs: AppConfig._lrs,
                                            actor: actorCfg,
                                            activity: {
                                                id: videoUrl,
                                                definition: definition
                                            }
                                        }
                                    );

                                    this._player.loadVideoByUrl(videoUrl);
                                },
                                this
                            ),
                            error: _.bind(
                                function () {
                                    console.log("views/app/video::loadVideo - error:", arguments);
                                    this._loadError("Unable to load video metadata");
                                },
                                this
                            )
                        }
                    );
                },

                _idFromUrl: function (url) {
                    console.log("views/app/video::_idFromUrl", url);
                    var re = /^http:\/\/www.youtube.com\/v\/(.+)/i,
                        match = url.match(re);

                    console.log("views/app/video::_idFromUrl - match", match);
                    if (match === null) {
                        return;
                    }

                    return match[1];
                },

                _loadError: function (err) {
                    console.log("views/app/video::_loadError", err);
                    var html = "";
                    if (err !== null) {
                        html = "Error occurred: " + err;
                    }

                    this._nodes.error.html(html);
                },

                _YTAPIReady: function () {
                    console.log("views/app/video::_YTAPIReady");
                    this._apiLoaded = true;

                    if (this._rendered) {
                        this._renderPlayer();
                    }
                    this.$el.removeClass(API_LOADING_CLASS_NAME);
                },

                _renderPlayer: function () {
                    console.log("views/app/video::_renderPlayer");

                    this._player = new YT.Player(
                        this._nodes.player.get(0),
                        {
                            width: "640",
                            height: "390",
                            events: {
                                onReady: _.bind(this._playerOnReady, this),
                                onError: _.bind(this._playerOnError, this),
                                onStateChange: _.bind(this._playerOnStateChange, this)
                            }
                        }
                    );
                },

                _playerOnReady: function () {
                    console.log("views/app/video::_playerOnReady");
                },

                _playerOnError: function (e) {
                    console.log("views/app/video::_playerOnError", e.data);
                    this._loadError("player error " + e.data);
                },

                _playerOnStateChange: function (e) {
                    console.log("views/app/video::_playerOnStateChange", e.data, this._playerLastState);
                    if (e.data === -1) {
                        console.log("views/app/video::_playerOnStateChange - unstarted");
                        this._recipe.loaded();
                        this._playerLastState = e.data;
                        this._playerLastTime = this._player.getCurrentTime();
                    }
                    else if (e.data === YT.PlayerState.CUED && this._playerLastState !== -1) {
                        console.log("views/app/video::_playerOnStateChange - cued");
                        this._recipe.loaded();
                        this._playerLastState = e.data;
                        this._playerLastTime = this._player.getCurrentTime();
                    }
                    else if (e.data === YT.PlayerState.PLAYING) {
                        console.log("views/app/video::_playerOnStateChange - playing");
                        this._recipe.startedPlayingAt(this._player.getCurrentTime());
                        this._playerLastState = e.data;
                        this._playerLastTime = this._player.getCurrentTime();
                    }
                    else if (e.data === YT.PlayerState.PAUSED) {
                        console.log("views/app/video::_playerOnStateChange - paused");
                        if (this._playerLastState === YT.PlayerState.PLAYING) {
                            // watched
                            this._recipe.watchedFromTo(this._playerLastTime, this._player.getCurrentTime());
                        }
                        else if (this._playerLastState === YT.PlayerState.PAUSED || this._playerLastState === YT.PlayerState.CUED || this._playerLastState === YT.PlayerState.ENDED) {
                            // skipped
                            this._recipe.skippedFromTo(this._playerLastTime, this._player.getCurrentTime());
                        }
                        this._recipe.pausedAt(this._player.getCurrentTime());
                        this._playerLastState = e.data;
                        this._playerLastTime = this._player.getCurrentTime();
                    }
                    else if (e.data === YT.PlayerState.BUFFERING) {
                        console.log("views/app/video::_playerOnStateChange - buffering");
                    }
                    else if (e.data === YT.PlayerState.ENDED) {
                        console.log("views/app/video::_playerOnStateChange - ended");
                        this._recipe.completedAt(this._player.getCurrentTime());
                        this._playerLastState = e.data;
                        this._playerLastTime = this._player.getCurrentTime();
                    }
                    else {
                        console.log("views/app/video::_playerOnStateChange - unrecognized");
                    }
                }
            }
        );
    }
);
