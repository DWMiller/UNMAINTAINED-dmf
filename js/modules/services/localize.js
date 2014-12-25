dmf.createModule('system-localize', function(c, config) {
    'use strict';

    var p_properties = {
        id: 'system-localize'
    };

    var scope, elements;

    var listeners = {
        'language-change': changeLanguage
    };

    var p_languages = {}; // will contain lazy loaded language data

    var language; // string representing key of currently active language (default 'en' for english)

    // var p_data = {}; //will contain localized language data for the currently selected language only


    function p_initialize(sb) {
        scope = sb.create(c, p_properties.id);
        bindEvents();

        language = config.default_language;
        getLanguage();
    }

    function p_destroy() {
        unbindEvents();
        scope = null;
        elements = {};
    }

    function bindEvents() {
        scope.listen(listeners);
    }

    function unbindEvents() {
        scope.ignore(Object.keys(listeners));
    }


    function changeLanguage(data) {
        language = data.language;
        getLanguage();
    }

    /**
     * Retrieve language data for specific language
     * @return {[type]}      [description]
     */
    function getLanguage() {
        // If language is not loaded, retrieve it then update.
        // If language is already loaded, update only.

        if (!p_languages[language]) {
            $.getJSON(config.path + language + config.ext).done(function(response) {
                p_languages[language] = response;
                updateLanguage();
            });
        } else {
            updateLanguage();
        }
    }

    function updateLanguage() {
        console.log('Language changed to ' + language);

        c.extend(c.data, {
            language: p_languages[language]
        });

        // scope.notify({
        //     type: 'data-set',
        //     data: {
        //         language: p_languages[language]
        //     }
        // });

        translate();
    }

    /**
     * Convert all text to localized language values
     * @return {[type]} [description]
     */
    function translate() {
        var elements = document.querySelectorAll('.localize');

        for (var i = 0; i < elements.length; i++) {
            localizeElement(elements[i]);
        }
    }

    function localizeElement(element) {
        var key = element.getAttribute("data-localize");

        var text = p_getLocalizedText(key);

        if (text) {
            switch (element.tagName) {
                case 'INPUT':
                    element.value = text;
                    break;
                default:
                    element.innerHTML = text;
            }
        } else {
            return false;
        }
    }

    function p_getLocalizedText(key) {
        if (c.data.language[key]) {
            return c.data.language[key];
        } else {
            return false;
        }
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };
});
