define(
    [
        "backbone",
        "templates",
        "views/base",
        "underscore",
        "collection/checklists",
        "model/checklist",
        "views/agent",
        "tincanjs"
    ],
    function (Backbone, templates, ViewBase, _, Checklists, Checklist, ViewAgent, TinCan) {
        "use strict";
        var CLASS_NAME = "rs-checklistCfg";

        return ViewBase.extend(
            {
                template: templates["checklistCfg.html"],
                instanceTemplate: templates["partial/checklistCfgInstance.html"],
                className: CLASS_NAME,
                events: {
                    "click button.rs-checklistCfg-createInstance": "_handleCreateInstance",
                    "click .rs-checklistCfg-instance": "_handleClickInstance"
                },

                _instanceNodes: null,

                _renderCfg: {
                    nodes: {
                        error:              "." + CLASS_NAME + "-error",
                        existingContainer:  "." + CLASS_NAME + "-existing-container"
                    }
                },

                subviewCreators: {
                    observee: function () {
                        return new ViewAgent (
                            {
                                label: "Observee"
                            }
                        );
                    },
                    observer: function () {
                        return new ViewAgent (
                            {
                                label: "Observer"
                            }
                        );
                    }
                },

                initialize: function () {
                    console.log("views/checklistCfg::initialize");
                    Backbone.Subviews.add(this);

                    this._instanceNodes = {};

                    this._checklists = new Checklists(
                        [],
                        {
                            config: this.model
                        }
                    );
                    this._loadExisting();

                    this.listenTo(
                        this._checklists,
                        "add",
                        function (model) {
                            console.log("views/checklistCfg::initialize - add");
                            this.$el.removeClass(this.className + "-empty");
                            this._displayInstance(model);
                        }
                    );
                    this.listenTo(
                        this._checklists,
                        "remove",
                        function (model) {
                            console.log("views/checklistCfg::initialize - remove");
                            this._undisplayInstance(model);
                            if (this._checklists.length === 0) {
                                this.$el.addClass(this.className + "-empty");
                            }
                        }
                    );
                    this.listenTo(
                        this._checklists,
                        "done",
                        function (model) {
                            console.log("views/checklistCfg::initialize - done");
                            this._checklists.remove(model);
                            this._checklists.save();
                        }
                    );
                },

                render: function () {
                    console.log("views/checklistCfg::render" + this._checklists.length);
                    ViewBase.prototype.render.call(this);

                    this.$el.addClass("pure-g-r");
                    if (this._checklists.length === 0) {
                        this.$el.addClass(this.className + "-empty");
                    }
                    else {
                        this._checklists.each(
                            function (model) {
                                this._displayInstance(model);
                            },
                            this
                        );
                    }
                },

                _displayInstance: function (model) {
                    console.log("views/checklistCfg::_displayInstance");
                    var mentorName = (new TinCan.Agent(model.get("mentor"))).toString(),
                        actorName = (new TinCan.Agent(model.get("actor"))).toString(),
                        instanceNode = Backbone.$(
                            this.instanceTemplate(
                                {
                                    id: model.get("id"),
                                    _className: this.className,
                                    actorName: actorName,
                                    mentorName: mentorName
                                }
                            )
                        );

                    this._instanceNodes[model.cid] = instanceNode;

                    //
                    // I'm generally fundamentally opposed to 'id' attributes
                    // but we know the model's id is already a UUID so we don't
                    // have to worry about DOM collisions
                    //
                    this._nodes.existingContainer.append(instanceNode);
                },

                _undisplayInstance: function (model) {
                    console.log("views/checklistCfg::_undisplayInstance");
                    this._instanceNodes[model.cid].remove();
                },

                _displayError: function (msg) {
                    console.log("views/checklistCfg::_displayError");
                    if (this._nodes.error) {
                        this._nodes.error.html(msg);
                    }
                },

                _loadExisting: function () {
                    console.log("views/checklistCfg::_loadExisting");
                    var loadingClass = this.className + "-loading",
                        loadingErrClass = loadingClass + "Error";

                    this.$el.addClass(loadingClass);
                    this.$el.removeClass(loadingErrClass);

                    this._checklists.fetch(
                        {
                            success: _.bind(
                                function () {
                                    console.log("views/checklistCfg::_loadExisting - success");
                                    this.$el.removeClass(loadingClass);
                                },
                                this
                            ),
                            error: _.bind(
                                function () {
                                    console.log("views/checklistCfg::_loadExisting - error");
                                    this.$el.removeClass(loadingClass);
                                    this.$el.addClass(loadingErrClass);
                                },
                                this
                            )
                        }
                    );
                },

                _handleCreateInstance: function () {
                    console.log("views/checklistCfg::_handleCreateInstance");
                    var actor = this.subviews.observee.getCfg(),
                        mentor = this.subviews.observer.getCfg(),
                        existing,
                        checklist;

                    this._displayError("");

                    if (! actor) {
                        this._displayError("Observee value required");
                        return;
                    }
                    if (! mentor) {
                        this._displayError("Observer value required");
                        return;
                    }

                    existing = this._checklists.filter(
                        function (m) {
                            // TODO: this didn't appear to work
                            console.log("views/checklistCfg::_handleCreateInstance - existing check:", m);
                            if (_.isEqual(actor, m.get("actor")) && _.isEqual(mentor, m.get("mentor"))) {
                                return true;
                            }
                            return false;
                        }
                    );
                    if (existing.length > 0) {
                        this._displayError("Must finish existing instance before creating matching new one");
                    }
                    else {
                        checklist = new Checklist (
                            {
                                id: TinCan.Utils.getUUID(),
                                actor: actor,
                                mentor: mentor,
                                config: this.model
                            }
                        );
                        checklist.saveItemResults();

                        this._checklists.add(checklist);
                        this._checklists.save();

                        this.trigger("loadChecklist", { model: checklist });
                    }
                },

                _handleClickInstance: function (e) {
                    console.log("views/checklistCfg::_handleClickInstance");
                    var checklist = this._checklists.get(e.target.id);
                    checklist.loadItemResults();

                    this.trigger("loadChecklist", { model: checklist, resuming: true });
                }
            }
        );
    }
);
