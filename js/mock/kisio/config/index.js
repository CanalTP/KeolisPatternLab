module.exports = {
    AutocompleteConfigs: [
        {
            autocomplete: {
                url: '/json/mock/places.json',
                minLength: 4,
                activeClearButton: true
            },
            group: 'default'
        },
        {
            autocomplete: {
                url: '/json/mock/places.json',
                minLength: 4,
                activeClearButton: true,
                type: [
                    'stop_area'
                ]
            },
            group: 'stop_area_only'
        }
    ],
    AnalyticsKeys: {
        NMP: 'APP-123456789',
        NMPCobranding: 'COBRANDING-123456789',
        Project: 'PROJECT-123456789'
    }
};