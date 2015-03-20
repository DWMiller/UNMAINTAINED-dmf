/**
 * [CORE description]
 */
var dmf = function() {
    'use strict';
    var moduleData = {};
    var debug = false;

    return {
        classes: {},
        config: {},
        data: {},
        events: {},
        fn: {},
        modules: moduleData,
        settings: {},
        templates: {},
        /**
         * Triggers starter logic for all game modules
         * @return {[type]} [description]
         */
        activate: function(settings) {
            if (typeof settings.debug !== 'undefined') {
                this.debug(settings.debug);
            }

            if (typeof settings.startup !== 'undefined') {
                this.startModule(settings.startup);
            }
        },
        debug: function(on) {
            if (on !== 'undefined') {
                debug = on ? true : false;
            } else {
                debug = !debug;
            }
        },
        extendConfig: function(moduleConfig) {
            this.extend(this.config, moduleConfig);
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

            if (mod) {
                mod.instance = this.getModule(moduleID);

                // Modules do not require an initializing function, use it if exists
                if (mod.instance.initialize && typeof mod.instance.initialize === 'function') {
                    mod.instance.initialize();
                }

                if (mod.instance.properties.listeners) {
                    this.registerEvents(mod.instance.properties.listeners, moduleID);
                }

                this.log(1, "Start Module '" + moduleID + "': SUCCESS");
            }
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

            if (!data || !data.instance) {
                this.log(2, "Stop Module '" + moduleID + "': FAILED : module does not exist or has not been started");
                return;
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
            if (!this.is_obj(evts) || !moduleId) {
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
        notify: function(event) {
            // Allows shorthand, trigged via event name only without requiring data
            if (typeof event === 'string') {
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
         * @param  {[type]} evts [description]
         * @param  {[type]} mod  [description]
         * @return {[type]}      [description]
         */
        removeEvents: function(evts, mod) {
            // Should be a named function, but mod would not be available
            evts.forEach(function(event, index, array) {
                delete dmf.events[event][mod];
            });
        },

        log: function(severity, messages) {
            if (!debug) {
                return;
            }

            // If message is not an array, make it an array so we can traverse it
            if (!this.is_arr(messages)) {
                messages = [messages];
            }

            for (var i = 0; i < messages.length; i++) {
                console[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](JSON.stringify(messages[i], null, 4));
            }

        },
        is_arr: function(arr) {
            return jQuery.isArray(arr);
        },
        is_obj: function(obj) {
            return jQuery.isPlainObject(obj);
        },
        extend: function(targetObject, extendObject) {
            jQuery.extend(true, targetObject, extendObject);
        }
    };
}();

//Deprecated namespace usage, delete in future versions
var CORE = dmf;

dmf.dom = function() {
    'use strict';
    return {
        find: function(selector, context) {
            var ret = {};

            if (context) {
                ret = context.querySelector(selector);
            } else {
                ret = document.querySelector(selector);
            }
            return ret;
        },
        hide: function(element) {
            dmf.dom.addClass(element, 'hidden');
            dmf.dom.removeClass(element, 'visible');
        },
        show: function(element) {
            dmf.dom.addClass(element, 'visible');
            dmf.dom.removeClass(element, 'hidden');
        },
        listen: function(element, evt, fn) {
            if (element && evt) {
                if (typeof evt === 'function') {
                    fn = evt;
                    evt = 'click';
                }
                element.addEventListener(evt, fn);
            } else {
                // log wrong arguments
            }
        },
        ignore: function(element, evt, fn) {
            if (element && evt) {
                if (typeof evt === 'function') {
                    fn = evt;
                    evt = 'click';
                }
                element.removeEventListener(evt, fn);
            } else {
                // log wrong arguments
            }
        },
        addClass: function(element, className) {
            jQuery(element).addClass(className);
        },
        removeClass: function(element, className) {
            jQuery(element).removeClass(className);
        },
        toggleClass: function(element, toggleClass) {
            jQuery(element).toggleClass(toggleClass);
        },
        emptyNode: function(element) {
            if (element instanceof jQuery) {
                element.html('');
            } else {
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
            }
        },
        append: function(element, toAppend) {
            if (!(element instanceof jQuery)) {
                element = $(element);
            }

            if (!(toAppend instanceof jQuery)) {
                toAppend = $(toAppend);
            }

            element.append(toAppend);
        }
    };
}();
