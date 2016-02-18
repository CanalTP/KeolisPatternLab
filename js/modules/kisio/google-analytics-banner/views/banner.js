var Backbone = require('backbone'),
    _ = require('underscore'),
    jQuery = require('jquery'),
    PopinView = require('./popin'),
    AnalyticsView = require('./analytics');

var BannerView = Backbone.View.extend({

    el: "#cookies-eu-banner",

    parameters: {
        actions: {
            moreLink: "#cookies-eu-more",
            hideLink: "#cookies-eu-hide"
        },
        cookieTimeout: 33696000000,
        bots: /bot|googlebot|crawler|spider|robot|crawling/i,
        trackingCookiesNames: ["__utma", "__utmb", "__utmc", "__utmt", "__utmv", "__utmz", "_ga", "_gat"],
        cookieName: "hasConsent",
        cookiePath: "/",
        waitAccept: true,
        analyticsKeys: {}
    },

    events: {
        'accept': 'saveAnswer',
        'reject': 'saveAnswer'
    },

    initialize: function(options) {
        _.extend(this.parameters, options);

        if (this.isBot() || !this.isToTrack() || this.hasConsent() === false) {
            return false;
        }

        if (this.hasConsent() === true) {
            new AnalyticsView({
                'keys': this.parameters.analyticsKeys
            });
            return true;
        }

        this.showBanner();

        if (!this.parameters.waitAccept) {
            this.setCookie(this.cookieName, true);
        }
    },

    /*
     * Show banner at the top of the page
     */
    showBanner: function() {
        this.displayBanner(true);
        new PopinView({el: this.parameters.actions.moreLink, container: this.$el});
        if (this.$(this.parameters.actions.hideLink) !== null) {
            this.$(this.parameters.actions.hideLink).on('click', jQuery.proxy(function(e) {
                this.saveAnswer(e);
            }, this));
        }
    },

    /**
     * Save the answer from client
     */
    saveAnswer: function(e, callback) {
        var rejected = typeof e !== 'undefined' && e.type === 'reject';
        this.displayBanner(false);
        this.setCookie(this.parameters.cookieName, !rejected);
        if (typeof callback === 'function') {
            callback();
        }
        if (rejected) {
            this.deleteTrackingCookies();
        } else {
            new AnalyticsView({
                'keys': this.parameters.analyticsKeys
            });
        }
    },

    /**
     * Shows or hides banner
     */
    displayBanner: function(state) {
        if (state !== undefined && state) {
            this.$el.css('display', 'block');
        } else {
            this.$el.remove();
        }
    },

    /*
     * Check if user already consent
     */
    hasConsent: function() {
        if (document.cookie.indexOf(this.parameters.cookieName + "=true") > -1) {
            return true;
        } else if (document.cookie.indexOf(this.parameters.cookieName + "=false") > -1) {
            return false;
        }
        return undefined;
    },

    /*
     * Detect if the visitor is a bot or not
     * Prevent for search engine take the cookie
     * alert message as main content of the page
     */
    isBot: function() {
        return this.parameters.bots.test(navigator.userAgent);
    },

    /*
     * Check if DoNotTrack is activated
     */
    isToTrack: function() {
        var dnt = navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack;
        return (dnt !== undefined) ? (dnt && dnt !== "yes" && dnt !== 1 && dnt !== "1") : true;
    },

    /*
     * Delete existants tracking cookies
     */
    deleteTrackingCookies: function() {
        for (var name in this.parameters.trackingCookiesNames) {
            this.deleteCookie(name);
        }
    },

    /*
     * Create/update cookie
     */
    setCookie: function(name, value) {
        var date = new Date();
        date.setTime(date.getTime() + this.parameters.cookieTimeout);

        document.cookie = name + "=" + value + ";expires=" + date.toGMTString() + ";path="+this.parameters.cookiePath;
    },

    /*
     * Delete cookie by changing expire
     */
    deleteCookie: function(name) {
        var hostname = document.location.hostname;
        if (hostname.indexOf("www.") === 0) {
            hostname = hostname.substring(4);
        }
        document.cookie = name + "=; domain=." + hostname + "; expires=Thu, 01-Jan-1970 00:00:01 GMT; path="+this.parameters.cookiePath;
        document.cookie = name + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path="+this.parameters.cookiePath;
    }
});

module.exports = BannerView;