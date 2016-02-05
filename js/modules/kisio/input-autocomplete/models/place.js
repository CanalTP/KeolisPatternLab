var Backbone = require('backbone');

var Place = Backbone.Model.extend({
    defaults: {
        name: false,
        cityName: false,
        type: false,
        quality: false,
        entryPoint: false
    }
});

module.exports = Place;