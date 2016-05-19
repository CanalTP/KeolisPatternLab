var jQuery = require('jquery'),
    BannerView = require('./views/banner');

jQuery(document).ready(function() {
    new BannerView({
        keys: CanalTP.AnalyticsKeys
    });
});


module.exports = BannerView;