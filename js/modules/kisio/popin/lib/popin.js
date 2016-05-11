var jQuery = require('jquery');

var Popin = function() {
    this.overlay;
};

    Popin.prototype.init = function() {
        var that = this;

        // list links to bind
        var linksPopin = jQuery('.js-popin');
        linksPopin.on('click', function(event) {
            event.preventDefault();
            that.toggleDialog(jQuery(jQuery(this).data('target')));
        });

        // init dialog bind
        jQuery('.popin').each(function( index ) {

            that.addListenerToButton(jQuery(this));

            if(jQuery(this).data('default-status')) {
                that.toggleDialog(jQuery(this));
            }
        });
    };

    Popin.prototype.getOverlay = function () {
        // add overlay if not exist
        if (!jQuery('#popin-overlay').length) {
            jQuery('body').append('<div id="popin-overlay" class="popin-overlay"></div>');
        }

        this.overlay = jQuery('#popin-overlay');

        return this.overlay;
    };

    /**
     *
     * @param jQueryNode
     */
    Popin.prototype.toggleDialog = function(target) {
        target.toggleClass('js-popin-open');
        this.getOverlay().toggleClass('popin-overlay-visible');
    };

    /**
     *
     * @param jQueryNode
     */
    Popin.prototype.addListenerToButton = function(dialog) {
        var that = this;

        dialog.find('button, a').on('click', function(event) {
            event.stopImmediatePropagation();

            // trigger defined event
            if (jQuery(this).data('event').length) {
                jQuery('body').trigger(jQuery(this).data('event'));
            }

            // close the popin
            that.toggleDialog(dialog);
        });
    };

module.exports = Popin;
