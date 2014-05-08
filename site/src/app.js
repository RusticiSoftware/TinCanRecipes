define(
    [
        "backbone",
        "underscore",
        "jquery",
        "views/app/home",
        "views/app/checklist",
        "views/app/video"
    ],
    function (
        Backbone,
        _,
        $,
        ViewHome,
        ViewChecklist,
        ViewVideo
    ) {
        "use strict";

        return Backbone.Router.extend(
            {
                routes: {
                    "*path": "handleDefault"
                },
                _views: {},
                _currentView: null,
                _baseTitle: null,
                _containerNode: null,
                _body: null,

                _staticViews: {
                    checklist: {
                        ctr: ViewChecklist,
                        ctrConfig: {},
                        titleAddn: "Checklist"
                    },
                    video: {
                        ctr: ViewVideo,
                        ctrConfig: {},
                        titleAddn: "Video"
                    }
                },

                initialize: function () {
                    console.log("app::initialize");

                    this._baseTitle = document.title;
                    this._body = $("body");
                    this._containerNode = $(".rs-app-main");
                },

                //
                // some routes need to be retriggered, for instance after login or logout
                // anything that is currently unauthorized/authorized
                // (FEATURE: can we match specific ones?)
                //
                _reDoRoute: function () {
                    console.log("app::_reDoRoute");
                    var fragment = "/" + Backbone.history.fragment;
                    this.navigate("/no-op", { trigger: false, replace: true });
                    this.navigate(fragment, { trigger: true, replace: true });
                },

                _changeView: function (newView, options) {
                    console.log("app::_changeView");
                    options = options || {};
                    options.renderFirst = (typeof options.renderFirst !== "undefined") ? options.renderFirst : true;

                    if (this._currentView !== null && this._currentView === newView) {
                        console.log("app::_changeView - no change needed");
                        return;
                    }

                    if (this._currentView !== null) {
                        this._currentView.$el.detach();
                    }

                    this._currentView = newView;
                    if (options.renderFirst) {
                        this._currentView.render();
                    }

                    this._containerNode.append(this._currentView.$el);
                },

                _changeTitle: function (prefix) {
                    var title = this._baseTitle;
                    if (typeof prefix !== "undefined" && prefix !== "") {
                        title = prefix + " : " + title;
                    }
                    document.title = title;

                    return this;
                },

                handleDefault: function (path) {
                    console.log("app::handleDefault: " + path);
                    var ViewCtr,
                        viewCtrConfig = {},
                        changeCfg = {
                            renderFirst: false
                        },
                        titleAddn = "";

                    this._views._default = this._views._default || {};

                    if (path === null) {
                        path = "_default";
                    }

                    if (typeof this._staticViews[path] !== "undefined") {
                        titleAddn = this._staticViews[path].titleAddn;
                    }

                    if (typeof this._views._default[path] === "undefined") {
                        if (path === "_default" || typeof this._staticViews[path] === "undefined") {
                            ViewCtr = ViewHome;
                        }
                        else {
                            ViewCtr = this._staticViews[path].ctr;
                            viewCtrConfig = _.extend(viewCtrConfig, this._staticViews[path].ctrConfig);
                        }
                        this._views._default[path] = new ViewCtr (viewCtrConfig);
                        changeCfg.renderFirst = true;
                    }
                    this._changeTitle(titleAddn);
                    this._changeView(this._views._default[path], changeCfg);
                }
            }
        );
    }
);
