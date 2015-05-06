var dmf = function() {
    'use strict';
    var moduleData = {};

    var default_settings = {
        debug: false,
        startup: null
    }

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

            if (!this.settings.startup) {
                this.log(3, 'A startup module has not been specified')
                return false;
            }

            return this.startModule(settings.startup);
        },
        debug: function(on) {
            if (typeof on == 'undefined') {
                this.debug = !this.debug;
                return;
            }

            this.debug = on ? true : false;
        },
        createModule: function(moduleID, creator) {
            if (typeof moduleID === 'string' && typeof creator === 'function') {

                moduleData[moduleID] = {
                    create: creator,
                    config: this.config[moduleID],
                    instance: null
                };

                this.log(1, "Module '" + moduleID + "' Registration : SUCCESS");
            } else {
                this.log(2, "Module '" + moduleID + "' Registration : FAILED : one or more arguments are of incorrect type");
            }
        },
        getModule: function(moduleID) {
            var mod = moduleData[moduleID];
            if (mod) {
                return mod.create(this, mod.config);
            } else {
                return false;
            }
        },
        startModule: function(moduleID) {
            var mod = moduleData[moduleID];

            if (!mod) {
                this.log(2, "Could not start module: " + moduleID + ". Module does not exist");
                return false;
            }

            mod.instance = this.getModule(moduleID);

            if (!mod.instance.properties) {
                // Modules do not have to contain a properties object, but the framework will create one
                mod.instance.properties = {
                    id: moduleID
                }
            }

            // Modules do not require an initializing function, use it if exists
            if (mod.instance.initialize && typeof mod.instance.initialize === 'function') {
                mod.instance.initialize();
            }

            if (mod.instance.properties.listeners) {
                this.registerEvents(mod.instance.properties.listeners, moduleID);
            }

            this.log(1, "Start module '" + moduleID + "': SUCCESS");

            return mod.instance;
        },
        /**
         * Starts multiple modules
         * @param  {String[]} modules An array of the module ids to start
         * @return {[type]}         [description]
         */
        startModules: function(modules) {
            modules.forEach(this.startModule, this);
        },
        startAllModules: function() {
            var moduleID;
            for (moduleID in moduleData) {
                if (moduleData.hasOwnProperty(moduleID)) {
                    this.startModule(moduleID);
                }
            }
        },
        stopModule: function(moduleID) {
            var data = moduleData[moduleID];

            if (!data) {
                this.log(2, "Stop Module '" + moduleID + "': FAILED : module does not exist");
                return false;
            } else if (!data.instance) {
                this.log(2, "Stop Module '" + moduleID + "': FAILED : module has not been started");
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

            this.log(1, "Stop Module '" + moduleID + "': SUCCESS");

            return true;
        },
        stopModules: function(modules) {
            modules.forEach(this.stopModule, this);
        },
        stopAllModules: function() {
            var moduleID;
            for (moduleID in moduleData) {
                if (moduleData.hasOwnProperty(moduleID)) {
                    this.stopModule(moduleID);
                }
            }
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

            if (!this.fn.is_obj(evts)) {
                this.log(1, "Error registering events for: " + moduleId);
            }

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

            if (arguments.length == 2) {
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
            if (!this.settings.debug) {
                return;
            }

            // If message is not an array, make it an array so we can traverse it
            if (!this.fn.is_arr(messages)) {
                messages = [messages];
            }

            for (var i = 0; i < messages.length; i++) {
                console[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](JSON.stringify(messages[i], null, 4));
            }
        },
    };
}();
