define(
    [
        "backbone",
        "templates",
        "views/base",
        "underscore"
    ],
    function (Backbone, templates, ViewBase, _) {
        "use strict";
        var CLASS_NAME = "rs-agent";

        return ViewBase.extend(
            {
                template: templates["agent.html"],
                className: CLASS_NAME,
                events: {
                    "change .rs-agent-kind": "_kindChange"
                },
                _kind: "mbox",

                _renderCfg: {
                    nodes: {
                        kind:         "select." + CLASS_NAME + "-kind",
                        value:        "input." + CLASS_NAME + "-value",
                        acctName:     "input." + CLASS_NAME + "-acct-name",
                        acctHomePage: "input." + CLASS_NAME + "-acct-homePage"
                    }
                },

                initialize: function (options) {
                    console.log("views/agent::initalize");

                    options = options || {};

                    _.extend(this, _.pick(options, "label"));
                },

                renderContext: function () {
                    console.log("views/agent::renderContext");

                    var context = _.extend(
                        _.clone(
                            ViewBase.prototype.renderContext.call(this)
                        ),
                        {
                            label: this.label
                        }
                    );
                    return context;
                },

                render: function () {
                    console.log("views/checklistCfg::render");
                    ViewBase.prototype.render.apply(this);

                    this.$el.addClass(this.className + "-kind-" + this._kind);
                },

                getCfg: function () {
                    console.log("views/checklistCfg::getCfg");
                    var result = {},
                        homePage,
                        value;

                    if (this._kind === "account") {
                        homePage = this._nodes.acctHomePage.val();
                        value = this._nodes.acctName.val();
                        if (homePage === "" || value === "") {
                            return;
                        }

                        result.account = {
                            homePage: homePage,
                            name: value
                        };
                    }
                    else {
                        value = this._nodes.value.val();
                        if (value === "") {
                            return;
                        }

                        result[this._kind] = value;
                    }

                    return result;
                },

                _kindChange: function () {
                    console.log("views/checklistCfg::_kindChange");
                    this.$el.removeClass(this.className + "-kind-" + this._kind);
                    this._kind = this._nodes.kind.val();
                    this.$el.addClass(this.className + "-kind-" + this._kind);
                }
            }
        );
    }
);
