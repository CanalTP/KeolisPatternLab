var jQuery = require('jquery'),
    Backbone = require('backbone'),
    AutocompleteView = require('./views/autocomplete');

jQuery(document).ready(function () {
    var dataCache = new Backbone.Collection;
    var configCache = new Backbone.Collection;
    configCache.add(CanalTP.AutocompleteConfigs);
    jQuery('.autocompletable').each(function() {
        new AutocompleteView({
            el: this,
            dataCache: dataCache,
            configCache: configCache
        });
    });
});

module.exports = AutocompleteView;