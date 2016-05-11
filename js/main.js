global.CanalTP = require('kisio/config');
global.Translator = require('kisio/translator');
var $ = require('jquery'),
    modules = require('./modules.js'),
    Popin = require('popin');

$(document).ready(function () {
    $('#sitemap').addClass("hide");
    $('#sitemap-button').click(function () {
        $('#sitemap').toggle();
    });

    var getInternalPopinId = function(popinInstance, popinContainerId) {
        for (var i=0;i<popinInstance.instanciedPopins.length;i++) {
            if (popinInstance.instanciedPopins[i] === popinContainerId) {
                return i;
            }
        }
    };

    // init warning modal
    if ($('#information-popin').length) {
        var po = new Popin();
        po.init();
        console.log(po);

        var popinId = getInternalPopinId(po, 'information-popin');
        console.log(popinId);
        po.open(new Event('click'), document.querySelector('#information-popin'));
    }
});