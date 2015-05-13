(function(c) {
    'use strict';
    c.factories = {
        module: function(newModule) {

            var defaults = {
                start: false,
                stop: false,
                listeners: false
            };

            return c.fn.extend({}, defaults, newModule);
        }
    };
})(dmf);
