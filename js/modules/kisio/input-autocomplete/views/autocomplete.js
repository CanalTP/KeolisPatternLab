require('jquery-ui');
require('00-atoms/03-lists/00-item.twig');
require('00-atoms/02-text/07-link.twig');
require('00-atoms/05-forms/09-legend.twig');
var Backbone = require('backbone'),
    _ = require('underscore'),
    jQuery = require('jquery'),
    Places = require('../collections/places'),
    Translator = require('kisio/translator'),
    InputIconable = require('kisio/input-iconable'),
    itemTemplate = require('00-atoms/03-lists/02-item-autocomplete.twig'),
    legendTemplate = require('00-atoms/03-lists/03-item-legend.twig');

/**
 * Fix the resizeMenu method that needs a fix width
 * @private
 */
jQuery.ui.autocomplete.prototype._resizeMenu = function() {
    var ul = this.menu.element;
    ul.outerWidth(this.element.outerWidth());
};

var AutocompleteView = Backbone.View.extend({

    collection: Places,

    parameters: {
        dataCache: new Backbone.Collection,
        configCache: new Backbone.Collection,
        url: null,
        className : 'is-autocomplete',
        loadingClassName: 'autocomplete-loading',
        openedClassName: 'autocompleted',
        containerSelector: '.autocomplete',
        fieldHiddenSelector: '.autocompletable-hidden',
        activeClearButton: true,
        defaultVal: null
    },

    initialize: function(options) {
        this.parameters = _.extend({}, this.parameters, options);
        if (!this.hasAutocompleteFlag()) {
            this.addAutocompleteFlag();
            this.$el.data('view', this);
            if (this.loadConfiguration()) {
                jQuery(this.$el).on(
                    'blur',
                    jQuery.proxy(this.clearHiddenField, this)
                );
                this.initWidget();
            }
            this.parameters.defaultVal = jQuery.trim(this.$el.val());
        }
    },

    clearHiddenField: function() {
        var autocompleteHidden = this.$el.closest('div' + this.parameters.containerSelector)
            .find(this.parameters.fieldHiddenSelector);
        if(this.parameters.defaultVal !== jQuery.trim(this.$el.val())) {
            autocompleteHidden.val('');
        }
    },

    /**
     * Permet de savoir si le champs est geré par le script
     * @return {boolean}
     */
    hasAutocompleteFlag: function() {
        return this.$el.hasClass(this.parameters.className);
    },

    /**
     * Ajoute une classe pour identifier que le champs est geré par le script
     */
    addAutocompleteFlag: function() {
        this.$el.addClass(this.parameters.className);
    },

    /**
     * Recupere une configuration depuis la cache
     * @return {object|false}
     */
    loadConfiguration: function() {
        var config = this.parameters.configCache.findWhere({group: this.getGroup()});
        if (config !== void 0) {
            this.parameters = _.extend({}, this.parameters, config.attributes.autocomplete);
            return true;
        } else {
            return false;
        }
    },

    /**
     * Recupere le groupe du champs autocomplete
     * @return {string|undefined}
     */
    getGroup: function() {
        return this.$el.data('group');
    },

    /**
     * Instancie le widget autocomplete de jQuery UI
     * @param {object} config Configuration du widget
     */
    initWidget: function() {
        var self = this;
        var data = this.$el.autocomplete({
            source: jQuery.proxy(this.getSource, this),
            minLength: this.parameters.minLength,
            select: function(event, ui) {
                self.setData(
                    ui.item.value,
                    ui.item.id,
                    ui.item.entryPoint.coord
                );
                self.parameters.defaultVal = ui.item.value;
            },
            search: function() {
                self.setLoading(true);
            },
            open: function() {
                self.setLoading(false);
                self.$el.addClass(self.parameters.openedClassName);
            },
            close: function() {
                self.$el.removeClass(self.parameters.openedClassName);
            }
        }).data('ui-autocomplete')._renderItem = jQuery.proxy(this.renderItem, this);
        var widget = this.$el.autocomplete('widget');
        widget.addClass('autocomplete-list');
        this.$el.attr('data-target-list', widget.attr('id'));
        this.initClearButton();
    },

    /**
     * Permet de definir les valeurs pour le champs texte et le champs caché
     * @param {string} label Valeur du champs texte
     * @param {string} uri Valeur du champs caché
     * @param {string} coord Valeur de data-coord du champs caché
     */
    setData: function(label, uri, coord) {
        this.$el.removeClass('error');
        this.$el.val(label||'');
        var autocompleteHidden = this.$el.closest('div'+this.parameters.containerSelector)
            .find(this.parameters.fieldHiddenSelector);

        autocompleteHidden.val(uri||'');
        //mise en place des coordonées géographique
        autocompleteHidden.data('coord', coord||'');
        autocompleteHidden.data('title', label||'');
        if (typeof(coord) === 'object') {
            //Envoi de l'évènement AutoCompleteCoord qui permettra de mettre à jour une map
            autocompleteHidden.trigger('AutoCompleteCoord');
        }
    },

    /**
     * Ajoute/supprime la classe de chargement des données
     * @param {boolean} loading En cour de chargement ?
     */
    setLoading: function(loading) {
        if (loading) {
            this.$el.addClass(this.parameters.loadingClassName);
        } else {
            this.$el.removeClass(this.parameters.loadingClassName);
        }
    },

    /**
     * Recupere les valeurs de l'autocomplete depuis le cache ou le serveur
     * @param {object} request Saisie utilisateur
     * @param {function} response
     */
    getSource: function(request, response) {
        var places;
        var dataRequest = {q: jQuery.trim(request.term)};
        if (this.parameters.type) {
            dataRequest.type = this.parameters.type;
        }

        if (this.hasDataCache(dataRequest)) {
            places = this.getDataCache(dataRequest);
            response(places);
        } else {
            if (this.parameters.url === undefined) {
                console.error('Autocomplete url is not defined.');
                return;
            }
            jQuery.ajax({
                url: this.parameters.url,
                data: dataRequest,
                dataType: "json",
                success: jQuery.proxy(function(result) {
                    places = this.processPlaces(result);
                    this.addDataCache(dataRequest, places);
                    response(places);
                }, this)
            });
        }

    },

    /**
     * Filtre les elements a afficher
     * @param {array} data
     * @return {array}
     */
    processPlaces: function(data) {
        if (typeof data !== "undefined" && data.hasOwnProperty("places") && data.places.length) {
            return jQuery.map(data.places, function(item, index) {
                if (item.name !== void 0 && item.name !== "" && item.id !== void 0 && item.id !== "") {
                    var zebra = (index - 1) % 2 ? 'odd' : 'even';
                    var place = {
                        "id": item.id,
                        "label": item.name,
                        "type": "autocomplete",
                        "attributes": {
                            "class": "radio-item " + zebra
                        }
                    };
                    if (item.embedded_type !== void 0) {
                        place.type = item.embedded_type;
                        place.entryPoint = item[item.embedded_type];
                    } else {
                        place.type = item['id'].split(':')[0];
                        place.entryPoint = '';
                    }

                    return place;
                }
            });
        }
    },

    /**
     * Mise en page d'un element
     * @param {domelement} list Noeud parent de l'element à afficher
     * @param {object} item Element à mettre en page
     * @return {domelement} Noeud parent dans lequel on à ajouté l'element
     */
    renderItem: function(list, item) {
        var html = itemTemplate.render(item);
        var listItem = jQuery(html);
        if (!list.find('legend:last-child').size() || !list.find('legend:last-child').is('.'+item.type)) {
            var legendLabel = Translator.trans('places.autocomplete.title.'+item.type.toLowerCase()).replace('%value%', '');
            var legendHtml = legendTemplate.render({'label': legendLabel, 'type': item.type, 'attributes': {'class': 'subtitle-radio-list'}});
            var legendItem = jQuery(legendHtml);
            legendItem.appendTo(list);
        }

        return listItem.appendTo(list);
    },

    /**
     * Ajoute un resultat au cache
     * @param {object} ref requete
     * @param {object} data description
     */
    addDataCache: function(ref, data) {
        var cache = new Backbone.Model({
            term: ref.q,
            group: ref.type,
            result: data
        });
        this.parameters.dataCache.add([cache]);
    },

    /**
     * Permet de savoir si le cache a une valeur pour la reference donnée
     * @param {object} ref requete
     * @return {boolean}
     */
    hasDataCache: function(ref) {
        var cache = this.parameters.dataCache.findWhere({
            term: ref.q,
            group: ref.type
        });
        return cache !== void 0;
    },

    /**
     * Recupere la valeur en cache
     * @param {object} ref requete
     * @return {object}
     */
    getDataCache: function(ref) {
        var model = this.parameters.dataCache.findWhere({
            term: ref.q,
            group: ref.type
        });
        return model.get('result');
    },

    /**
     * Fonction permettant d'activer ou de desactiver le bouton clear
     * @return {booleen}
     */
    initClearButton: function()
    {
        if (this.parameters.activeClearButton === true) {
            var dataView = InputIconable.prototype.parameters.dataView;
            var iconableView;
            if (this.$el.data(dataView) !== void 0) {
                iconableView = this.$el.data(dataView);
            } else {
                iconableView = new InputIconable({el: this.el});
            }
            var clearField = iconableView.addLastIcon('x', 'icon_clear');
            this.addClearListener(clearField);
            return true;
        }
        return false;
    },

    /**
     * Fonction permettant d'ajouter le listener
     * @param {string} clearField Span du bouton (x) pour la suppression
     */
    addClearListener: function(clearField)
    {
        jQuery(clearField).on(
            'click',
            jQuery.proxy(function() {
                this.setData();
                this.$el.focus();
                return false;
            }, this)
        );
    }
});

module.exports = AutocompleteView;