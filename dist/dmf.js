var dmf = function() {
    'use strict';

    var default_settings = {
        startup: null
    };

    return {
        config: {},
        data: {},
        factories: null, // populated by factories.js 
        fn: null, // populated by functions.js
        events: {}, // used to map framework event-module bindings
        modules: {},
        settings: {},
        /**
         * Triggers starter logic for all game modules
         * @return {[type]} [description]
         */
        activate: function(settings) {
            this.settings = this.fn.extend({}, default_settings, settings);

            if (!settings.startup) {
                return false;
            }
            return this.startModule(settings.startup);
        },
        registerModule: function(moduleID, creator) {
            this.modules[moduleID] = {
                create: creator,
                config: this.config[moduleID],
                instance: null
            };
        },
        createModule: function() {
            console.log('createModule is deprecated, use registerModule');
        },
        startModule: function(moduleID) {
            var mod = this.modules[moduleID];

            if (!mod) {
                return false;
            }

            var temp = mod.create(this, mod.config);
            mod.instance = this.factories.module(temp);

            mod = mod.instance;

            if (mod.start) {
                mod.start();
            }

            if (mod.listeners) {
                this.registerEvents(mod.listeners, moduleID);
            }

            return mod;
        },
        /**
         * Starts multiple modules
         * @param  {String[]} modules An array of the module ids to start
         * @return {[type]}         [description]
         */
        startModules: function(modules) {
            modules.forEach(this.startModule);
        },
        stopModule: function(moduleID) {
            var mod = this.modules[moduleID];

            if (!mod) {
                //module does not exist
                return false;
            } else if (!mod.instance) {
                //module has not been started
                return false;
            }

            mod = mod.instance;

            if (mod.listeners) {
                this.deregisterEvents(mod.listeners, moduleID);
            }

            // Modules do not require a destroy function, use it if exists
            if (mod.stop) {
                mod.stop();
            }

            delete this.modules[moduleID].instance;

            return true;
        },
        stopModules: function(modules) {
            modules.forEach(this.stopModule, this);
        },
        /**
         * Binds framework events to a module
         * @param  {[type]} evts Object containing event/function pairs to bind
         * @param  {string} mod  [description]
         * @return {[type]}      [description]
         */
        registerEvents: function(evts, moduleId) {
            // Currently only called via startModule, so modules existance 
            // does not need to be validated here

            for (var eventKey in evts) {
                // Add event to event list if not yet added
                if (!this.events[eventKey]) {
                    this.events[eventKey] = {};
                }

                this.events[eventKey][moduleId] = evts[eventKey];
            }

        },
        /**
         * Unsubscribes a single module from a set of events
         */
        deregisterEvents: function(evts, mod) {
            for (var event in evts) {
                delete this.events[event][mod];
            }
        },
        /**
         * Sends events to each listening module
         */
        notify: function(event) {

            if (arguments.length === 2) {
                // Allows seperate name and data parameter, useful for primitive types data
                event = {
                    type: arguments[0],
                    data: arguments[1]
                };
            } else if (typeof event === 'string') {
                // Allows shorthand, trigged via event name only without requiring data
                event = {
                    type: event,
                    data: {}
                };
            }

            var bindings = this.events[event.type];

            if (!bindings) {
                return;
            }

            var moduleId;
            for (moduleId in bindings) {
                bindings[moduleId](event.data);
            }
        }
    };
}();

(function() {
    'use strict';
    dmf.fn = {
        is_arr: function(obj) {
            return obj.constructor === Array;
        },
        extend: function() {
            for (var i = 1; i < arguments.length; i++) {
                for (var key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        arguments[0][key] = arguments[i][key];
                    }
                }
            }
            return arguments[0];
        }
    };
})();

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
