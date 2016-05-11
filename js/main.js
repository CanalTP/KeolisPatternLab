global.CanalTP = require('kisio/config');
global.Translator = require('kisio/translator');
var $ = require('jquery'),
    modules = require('./modules.js'),
    Popin = require('kisio/popin');

$(document).ready(function () {
    $('#sitemap').addClass("hide");
    $('#sitemap-button').click(function () {
        $('#sitemap').toggle();
    });

    var popin = new Popin();
    popin.init();

    // $(document).on('accept', function(e) {
    $('body').on('close', function(e) {
        console.log(e);
    });
});