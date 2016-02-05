var Yaml = require('yamljs');

var Translator = {
    trans: function(id) {
        var translations = Yaml.load('/translations/messages.fr.yml');
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

        return translation;
    }
};

module.exports = Translator;