global.CanalTP = require('kisio/config');
global.Translator = require('kisio/translator');
var $ = require('jquery'),
    modules = require('./modules.js');

$(document).ready(function () {
    $('#sitemap').addClass("hide");
    $('#sitemap-button').click(function () {
        $('#sitemap').toggle();
    });
});