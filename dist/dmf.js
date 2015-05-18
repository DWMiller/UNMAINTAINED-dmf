'use strict';

var dmf = (function () {
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
        activate: function activate(settings) {
            dmf.settings = dmf.fn.extend({}, default_settings, settings);

            if (!settings.startup) {
                return false;
            }
            return dmf.startModule(settings.startup);
        },
        registerModule: function registerModule(moduleID, creator) {
            dmf.modules[moduleID] = {
                create: creator,
                config: dmf.config[moduleID],
                instance: null
            };
        },
        createModule: function createModule() {
            dmf.announce('log', {
                mgs: ['createModule is deprecated, use registerModule'],
                severity: 2
            });
        },
        startModule: function startModule(moduleID) {
            var mod = dmf.modules[moduleID];

            if (!mod) {
                return false;
            }

            var temp = mod.create(dmf, mod.config);
            mod.instance = dmf.factories.module(temp);

            mod = mod.instance;

            if (mod.start) {
                dmf.announce('module-started', moduleID);
                mod.start();
            }

            if (mod.listeners) {
                dmf.registerEvents(mod.listeners, moduleID);
            }

            return mod;
        },
        /**
         * Starts multiple modules
         * @param  {String[]} modules An array of the module ids to start
         * @return {[type]}         [description]
         */
        startModules: function startModules(modules) {
            modules.forEach(dmf.startModule);
        },
        stopModule: function stopModule(moduleID) {
            var mod = dmf.modules[moduleID];

            if (!mod) {
                //module does not exist
                return false;
            } else if (!mod.instance) {
                //module has not been started
                return false;
            }

            mod = mod.instance;

            if (mod.listeners) {
                dmf.deregisterEvents(mod.listeners, moduleID);
            }

            // Modules do not require a destroy function, use it if exists
            if (mod.stop) {
                dmf.announce('module-stopped', moduleID);
                mod.stop();
            }

            delete dmf.modules[moduleID].instance;

            return true;
        },
        stopModules: function stopModules(modules) {
            modules.forEach(dmf.stopModule, dmf);
        },
        /**
         * Binds framework events to a module
         * @param  {[type]} evts Object containing event/function pairs to bind
         * @param  {string} mod  [description]
         * @return {[type]}      [description]
         */
        registerEvents: function registerEvents(evts, moduleId) {
            // Currently only called via startModule, so modules existance
            // does not need to be validated here

            for (var eventKey in evts) {
                // Add event to event list if not yet added
                if (!dmf.events[eventKey]) {
                    dmf.events[eventKey] = {};
                }

                dmf.events[eventKey][moduleId] = evts[eventKey];
            }
        },
        /**
         * Unsubscribes a single module from a set of events
         */
        deregisterEvents: function deregisterEvents(evts, mod) {
            for (var event in evts) {
                delete dmf.events[event][mod];
            }
        },
        /**
         * Sends events to each listening module
         */
        announce: function announce(event) {

            if (arguments.length === 2) {
                // Allows seperate name and data parameter
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

            var bindings = dmf.events[event.type];

            if (!bindings) {
                return;
            }

            var moduleId;
            for (moduleId in bindings) {
                bindings[moduleId](event.data);
            }
        },
        notify: function notify(event) {
            dmf.announce(event);
            dmf.announce('log', {
                mgs: ['Notify is deprecated, use dmf.announce'],
                severity: 2
            });
        }
    };
})();

(function () {
    'use strict';
    dmf.fn = {
        is: function is(test, obj) {
            return ({}).toString.call(obj) === test;
        },
        extend: function extend() {
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

(function (c) {
    'use strict';
    c.factories = {
        module: function module(newModule) {

            var defaults = {
                start: false,
                stop: false,
                listeners: false
            };

            return c.fn.extend({}, defaults, newModule);
        }
    };
})(dmf);