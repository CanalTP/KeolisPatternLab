var Backbone = require('backbone'),
    _ = require('underscore'),
    jQuery = require('jquery'),
    wrapperTemplate = require('00-atoms/07-iconables/00-iconable-wrapper.twig'),
    itemTemplate = require('00-atoms/07-iconables/02-iconable-item.twig'),
    listTemplate = require('00-atoms/07-iconables/01-iconable-list.twig');

var IconableView = Backbone.View.extend({
    parameters: {
        lastClass: 'js-last',
        listClass: 'input-icons',
        dataView: 'iconableView',
        listInsertion: 'after'
    },

    initialize: function(options) {
        _.extend(this.parameters, options);

        this.$el.data(this.parameters.dataView, this);
        this.transformDom();
    },

    transformDom: function() {
        var wrapper_template = wrapperTemplate.render().replace(/^\s+|\s+$/gm,'');
        var list_template = listTemplate.render({
            'list_class': this.parameters.listClass
        }).replace(/^\s+|\s+$/gm,'');

        this.$el.wrap(wrapper_template);
        switch (this.parameters.listInsertion) {
            case 'after': this.$el.after(list_template); break;
            case 'before': this.$el.before(list_template); break;
            case 'in': this.$el.append(list_template); break;
        }
        this.setElement(this.$el.parent());
    },

    addIcon: function(content, className) {
        var template = itemTemplate.render({
            'class_name': className,
            'content': content
        }).replace(/^\s+|\s+$/gm,'');
        if (this.$('.' + this.parameters.listClass + ' .' + this.parameters.lastClass).length > 0) {
            var lastIcons = this.$('.' + this.parameters.listClass + ' .' + this.parameters.lastClass);
            return jQuery(lastIcons.get(0)).before(template).prev();
        } else {
            this.$('.' + this.parameters.listClass).append(template);
            this.resizeInput();
            return this.$('.' + this.parameters.listClass).children(':last-child');
        }
    },

    addLastIcon: function(content, className) {
        className += " " + this.parameters.lastClass;
        var template = itemTemplate.render({
            'class_name': className,
            'content': content
        }).replace(/^\s+|\s+$/gm,'');
        this.$('.' + this.parameters.listClass).append(template);
        this.resizeInput();
        return this.$('.' + this.parameters.listClass).children(':last-child');
    },

    resizeInput: function() {
        var outerWidth = this.$('.' + this.parameters.listClass).outerWidth();
        this.$('input').css('paddingRight', outerWidth);
    }
});

module.exports = IconableView;