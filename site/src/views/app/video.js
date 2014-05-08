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
            API_LOADING_CLASS_NAME = CLASS_NAME + "-apiLoading";

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
                        actorCfg = this.subviews.agent.getCfg();

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

                    this._recipe = new Recipes.Video (
                        {
                            lrs: AppConfig._lrs,
                            actor: actorCfg,
                            activity: {
                                id: videoUrl
                            }
                        }
                    );

                    this._player.loadVideoByUrl(videoUrl);
                },

                _loadError: function (err) {
                    console.log("views/app/video::_loadError");
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
                    console.log("views/app/video::_playerOnStateChange", e.data);
                    if (e.data === -1) {
                        console.log("views/app/video::_playerOnStateChange - unstarted");
                    }
                    else if (e.data === YT.PlayerState.CUED) {
                        console.log("views/app/video::_playerOnStateChange - cued");
                        this._recipe.loaded();
                    }
                    else if (e.data === YT.PlayerState.PLAYING) {
                        console.log("views/app/video::_playerOnStateChange - playing");
                        this._recipe.startedPlayingAt(this._player.getCurrentTime());
                    }
                    else if (e.data === YT.PlayerState.PAUSED) {
                        console.log("views/app/video::_playerOnStateChange - paused");
                        if (this._playerLastState === YT.PlayerState.PLAYING) {
                            // watched
                            this._recipe.watchedFromTo(this._playerLastTime, this._player.getCurrentTime());
                        }
                        else if (this._playerLastState === YT.PlayerState.PAUSED) {
                            // skipped
                            this._recipe.skippedFromTo(this._playerLastTime, this._player.getCurrentTime());
                        }
                        this._recipe.pausedAt(this._player.getCurrentTime());
                    }
                    else if (e.data === YT.PlayerState.BUFFERING) {
                        console.log("views/app/video::_playerOnStateChange - buffering");
                    }
                    else if (e.data === YT.PlayerState.ENDED) {
                        console.log("views/app/video::_playerOnStateChange - ended");
                        this._recipe.completedAt(this._player.getCurrentTime());
                    }
                    else {
                        console.log("views/app/video::_playerOnStateChange - unrecognized");
                    }

                    this._playerLastState = e.data;
                    this._playerLastTime = this._player.getCurrentTime();
                }
            }
        );
    }
);
