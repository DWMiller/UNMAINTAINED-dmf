dmf.createModule('system-localize', function(c, config) {
    'use strict';

    var properties = {
        id: 'system-localize',
        listeners:{
            'language-change': changeLanguage
        }
    };

    var scope, elements;

    var p_languages = {}; // will contain lazy loaded language data

    var language; // string representing key of currently active language (default 'en' for english)

    // var p_data = {}; //will contain localized language data for the currently selected language only


    function initialize(sb) {
        scope = sb.create(c, properties.id);
        language = config.default_language;
        getLanguage();
    }

    function destroy() {
        scope = null;
        elements = {};
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

    function getLocalizedText(key) {
        if (c.data.language[key]) {
            return c.data.language[key];
        } else {
            return false;
        }
    }

    return {
        properties: properties,
        initialize: initialize,
        destroy: destroy,
    };
});
