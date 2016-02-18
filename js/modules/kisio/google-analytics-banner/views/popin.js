require('00-atoms/02-text/08-heading.twig');
require('00-atoms/02-text/01-paragraph.twig');
require('00-atoms/06-buttons/00-button-standard.twig');
var Backbone = require('backbone'),
    _ = require('underscore'),
    jQuery = require('jquery'),
    Popin = require('popin'),
    template = require('01-molecules/01-privacy/01-popin.twig');

var PopinView = Backbone.View.extend({

    parameters: {
        container: null,
        popin: null,
        actions: {
            rejectButton: '#cookies-eu-reject',
            acceptButton: '#cookies-eu-accept'
        }
    },

    initialize: function(options) {
        _.extend(this.parameters, options);
        this.$el.addClass(this.$el.attr('id'));
        this.parameters.popin = new Popin();
        var html = template.render({
            title: Translator.trans('privacy.title.cookies'),
            content: Translator.trans('privacy.description.full'),
            actions: {
                accept: Translator.trans('privacy.actions.accept'),
                reject: Translator.trans('privacy.actions.reject')
            }
        });
        this.parameters.popin.init({
            className: this.$el.attr('id'),
            content: html,
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
            var buttons = this.parameters.actions.acceptButton + ', ' + this.parameters.actions.rejectButton;
            jQuery('#' + popinId).find(buttons).on('click', jQuery.proxy(function(e) {
                var answer = e.target.id === this.parameters.actions.acceptButton.replace('#', '') ? 'accept' : 'reject';
                this.parameters.container.trigger(answer, jQuery.proxy(function() {
                    this.parameters.popin.close();
                }, this));
            }, this));
        }
    }
});

module.exports = PopinView;