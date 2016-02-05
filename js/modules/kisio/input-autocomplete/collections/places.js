var Backbone = require('backbone'),
    Place = require('../models/place');

var Places = Backbone.Collection.extend({
    model: Place
});

module.exports = Places;