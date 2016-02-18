(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

var Backbone = require('backbone'),
    _ = require('underscore');

var AnalyticsView = Backbone.View.extend({

    parameters: {
        keys: {}
    },

    initialize: function(options) {
        _.extend(this.parameters, options);

        Object.keys(this.parameters.keys).forEach(function(key) {
            ga('create', key, 'auto', {name: this.parameters.keys[key]});
            ga(this.parameters.keys[key] + '.send', 'pageview');
        }, this);
    }
});

module.exports = AnalyticsView;
