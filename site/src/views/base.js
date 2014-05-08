define(
    [
        "backbone"
    ],
    function (
        Backbone
    ) {
        "use strict";

        return Backbone.View.extend(
            {
                _nodes: null,

                renderCfg: function () {
                    return this._renderCfg || {};
                },

                renderContext: function () {
                    console.log("views/base::renderContext");
                    return {
                        _className: this.className
                    };
                },

                render: function () {
                    console.log("views/base::render");
                    var context = this.renderContext(),
                        renderCfg = this.renderCfg(),
                        prop;

                    this.$el.html(this.template(context));

                    this._nodes = {};
                    if (renderCfg.nodes) {
                        for (prop in renderCfg.nodes) {
                            this._nodes[prop] = this.$(renderCfg.nodes[prop]);
                        }
                    }

                    return this;
                }
            }
        );
    }
);
