define(
    [
        "backbone",
        "templates",
        "underscore",
        "views/base",
        "collection/checklistCfgs",
        "views/checklistCfg",
        "views/checklist"
    ],
    function (
        Backbone,
        templates,
        _,
        ViewBase,
        ChecklistCfgs,
        ViewChecklistCfg,
        ViewChecklist
    ) {
        "use strict";
        var CLASS_NAME = "rs-app-checklist";

        return ViewBase.extend(
            {
                template: templates["app/checklist.html"],
                className: CLASS_NAME,
                events: {
                    "change select.rs-app-checklist-selector": "_handleListSelect"
                },

                _checklistLoaders: null,

                initialize: function () {
                    console.log("views/app/checklist::initialize");
                    this.collection = new ChecklistCfgs (
                        AppConfig.checklists
                    );
                    this._checklistLoaders = {};
                },

                renderContext: function () {
                    console.log("views/app/checklist::renderContext");
                    return _.extend(
                        ViewBase.prototype.renderContext.call(this),
                        {
                            lists: this.collection.toJSON()
                        }
                    );
                },

                _renderCfg: {
                    nodes: {
                        listSelector:       "select." + CLASS_NAME + "-selector",
                        cfgContainer:       "." + CLASS_NAME + "-cfg-container",
                        checklistContainer: "." + CLASS_NAME + "-checklist-container"
                    }
                },

                _handleListSelect: function () {
                    console.log("views/app/checklist::_handleListSelect");
                    var checklistId = this._nodes.listSelector.val(),
                        checklistCfgModel;

                    if (checklistId === "") {
                        this.$el.removeClass(this.className + "-selected");
                        this._nodes.cfgContainer.empty();
                        return;
                    }

                    if (! this._checklistLoaders[checklistId]) {
                        checklistCfgModel = this.collection.get(checklistId);

                        this._checklistLoaders[checklistId] = new ViewChecklistCfg(
                            {
                                model: checklistCfgModel
                            }
                        );
                        this._checklistLoaders[checklistId].render();

                        this.listenTo(
                            this._checklistLoaders[checklistId],
                            "loadChecklist",
                            this._handleLoad
                        );
                    }

                    // TODO: need to clear/detach first?
                    this.$el.addClass(this.className + "-selected");
                    this._nodes.cfgContainer.html(this._checklistLoaders[checklistId].el);
                },

                _handleLoad: function (e) {
                    console.log("views/app/checklist::_handleLoad");
                    console.log("views/app/checklist::_handleLoad - e", e);
                    var checklistView = new ViewChecklist(
                        {
                            model: e.model,
                            resuming: e.resuming
                        }
                    );
                    checklistView.render();

                    // TODO: need to clear/detach first?
                    this._nodes.checklistContainer.html(checklistView.el);
                }
            }
        );
    }
);
