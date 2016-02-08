var Yaml = require('yamljs');

var Translator = {
    prefix: '%',
    suffix: '%',

    trans: function(id, parameters, domain, locale) {
        var domain = typeof domain !== 'undefined' ? domain : 'messages';
        var locale = typeof locale !== 'undefined' ? locale : 'fr';
        var translations = Yaml.load('/translations/'+domain+'.'+locale+'.yml');
        var translation = id;
        var parts = id.split('.');

        parts.forEach(function(part, index) {
            if (typeof translations !== "object" || !translations.hasOwnProperty(part)) {
                return;
            }
            if (index < parts.length - 1) {
                translations = translations[part];
            } else {
                translation = translations[part];
            }
        });

        if (typeof parameters === 'object') {
            var keys = Object.keys(parameters);
            keys.forEach(function(index) {
                translation = translation.replace(this.prefix + index + this.suffix, parameters[index]);
            }, this);
        }

        return translation;
    }
};

module.exports = Translator;