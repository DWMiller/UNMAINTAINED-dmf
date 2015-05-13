var dmf = function() {
    'use strict';
    var moduleData = {};

    var default_settings = {
        debug: false,
        startup: null
    };

    return {
        classes: {},
        config: {},
        data: {},
        events: {},
        modules: moduleData,
        settings: {},
        templates: {},
        /**
         * Triggers starter logic for all game modules
         * @return {[type]} [description]
         */
        activate: function(settings) {
            this.settings = this.fn.extend(default_settings, settings);

            return this.startModule(settings.startup);
        },
        debug: function(on) {
            if (typeof on === 'undefined') {
                this.debug = !this.debug;
                return;
            }

            this.debug = on ? true : false;
        },
        createModule: function(moduleID, creator) {
            moduleData[moduleID] = {
                create: creator,
                config: this.config[moduleID],
                instance: null
            };
        },
        getModule: function(moduleID) {
            var mod = moduleData[moduleID];
            if (!mod) {
                return false;

            }
            return mod.create(this, mod.config);
        },
        startModule: function(moduleID) {
            var mod = moduleData[moduleID];

            if (!mod) {
                return false;
            }

            mod.instance = this.getModule(moduleID);

            if (!mod.instance.properties) {
                // Modules do not have to contain a properties object, but the framework will create one
                mod.instance.properties = {
                    id: moduleID
                };
            }

            // Modules do not require an initializing function, use it if exists
            if (mod.instance.initialize) {
                mod.instance.initialize();
            }

            if (mod.instance.properties.listeners) {
                this.registerEvents(mod.instance.properties.listeners, moduleID);
            }

            return mod.instance;
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
            var data = moduleData[moduleID];

            if (!data) {
                //module does not exist
                return false;
            } else if (!data.instance) {
                //module has not been started
                return false;
            }

            if (data.instance.properties.listeners) {
                this.removeEvents(Object.keys(data.instance.properties.listeners), moduleID);
            }

            // Modules do not require a destroy function, use it if exists
            if (data.instance.destroy && typeof data.instance.destroy === 'function') {
                data.instance.destroy();
            }

            data.instance = null;
            delete data.instance;

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
        },
        /**
         * Unsubscribes a single module from a set of events
         */
        removeEvents: function(evts, mod) {
            // Should be a named function, but mod would not be available
            evts.forEach(function(event, index, array) {
                delete dmf.events[event][mod];
            });
        },

        log: function(severity, messages) {
            console.warn('dmf.log is deprectated, use logging module');

            this.notify('log', {
                'severity': severity,
                'messages': messages
            });
        },
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
