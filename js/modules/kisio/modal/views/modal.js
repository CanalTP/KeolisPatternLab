require('00-atoms/02-text/08-heading.twig');
require('00-atoms/02-text/01-paragraph.twig');
require('00-atoms/06-buttons/00-button-standard.twig');
var Backbone = require('backbone'),
    _ = require('underscore'),
    jQuery = require('jquery'),
    // Popin = require('popin'),
    template = require('01-molecules/01-privacy/01-popin.twig');

var ModalView = Backbone.View.extend({

    parameters: {
        container: null,
        popin: null,
        content: null
    },

    initialize: function(options) {
        _.extend(this.parameters, options);
        this.$el.addClass(this.$el.attr('id'));
        this.parameters.popin = new Popin();
        // var html = template.render(this.parameters.content);
        this.parameters.popin.init({
            // className: this.$el.attr('id'),
            // content: html,
            afterOpen : jQuery.proxy(this.addActionsButtons, this)
        });
    },

    /*
     * Add events listeners to buttons accept/reject
     */
    addActionsButtons: function() {
        var popin = this.parameters.popin;
        if (popin !== null && popin.openedPopins.length) {
            var popinId = popin.instanciedPopinsOptions[popin.openedPopins[0]].popinId;
            jQuery('#' + popinId).find('button').on('click', jQuery.proxy(function(e) {
                this.parameters.container.trigger(jQuery.data('event'), jQuery.proxy(function() {
                    this.parameters.popin.close();
                }, this));
            }, this));
        }
    }
});

module.exports = ModalView;