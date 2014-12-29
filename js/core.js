/**
 * [CORE description]
 */
var dmf = function() {
    'use strict';
    var moduleData = {}
    var debug = false;

    return {
        container: null,
        modules: moduleData,
        config: {},
        data: {},
        events: {},
        templates: {},
        classes: {},
        /**
         * Triggers starter logic for all game modules
         * @return {[type]} [description]
         */
        activate: function(settings) {
            if (typeof settings.debug !== 'undefined') {
                this.debug(settings.debug);
            }

            if (typeof settings.container !== 'undefined') {
                this.container = document.querySelector(settings.container);
            } else {
                this.container = document.querySelector('body');
            }

            this.startModule('system-controller');

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
            $.extend(true, this.config, moduleConfig);
        },
        createModule: function(moduleID, creator) {
            var temp;
            if (typeof moduleID === 'string' && typeof creator === 'function') {

                temp = creator(this);
                // if (temp.initialize && typeof temp.initialize === 'function' && temp.destroy && typeof temp.destroy === 'function') {
                temp = null;
                moduleData[moduleID] = {
                    create: creator,
                    config: this.config[moduleID],
                    instance: null
                };
                this.log(1, "Module '" + moduleID + "' Registration : SUCCESS");
                // } else {
                //     this.log(2, "Module '" + moduleID + "' Registration : FAILED : instance has no initialize or destroy functions");
                // }

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
                    mod.instance.initialize(this.Sandbox.create(this, mod.instance.properties));
                } 

                if (mod.instance.properties.listeners) {
                    this.registerEvents(mod.instance.properties.listeners, moduleID);
                    console.log("Events Registered - " + moduleID)
                }

                this.log(1, "Start Module '" + moduleID + "': SUCCESS");
            }
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
            var data;
            if ((data = moduleData[moduleID]) && data.instance) {

                if (data.instance.properties.listeners) {
                    console.log("Events Ignored - " + moduleID)
                    this.removeEvents(Object.keys(data.instance.properties.listeners), moduleID);
                }

                // Modules do not require a destroy function, use it if exists
                if (data.instance.destroy && typeof data.instance.destroy === 'function') {
                    data.instance.destroy();
                } else {
                    // define scope/sandbox here if initialization function is not present
                    if (data.instance.scope) {
                        data.instance.scope = null;
                    }
                    // this.dispose(data.instance);
                }

                data.instance = null;
                delete data.instance;

                this.log(1, "Stop Module '" + moduleID + "': SUCCESS");
            } else {
                this.log(2, "Stop Module '" + moduleID + "': FAILED : module does not exist or has not been started");
            }
        },
        stopAllModules: function() {
            var moduleID;
            for (moduleID in moduleData) {
                if (moduleData.hasOwnProperty(moduleID)) {
                    this.stopModule(moduleID);
                }
            }
        },
        registerEvents: function(evts, mod) {
            if (this.is_obj(evts) && mod) {
                for (var eventKey in evts) {
                    if (!this.events[eventKey]) {
                        this.events[eventKey] = {};
                    }
                    this.events[eventKey][mod] = evts[eventKey];
                }
            } else {
                this.log(1, "Error registering events for: " + mod);
            }
        },
        notify: function(evt) {
            if (this.is_obj(evt) && evt.type) {
                this.triggerEvent(evt);
            }
        },
        //listen & ignore should be here, but moduleID is not available and would need to be passed from the module
        // listen: function(evts) {
        //     this.registerEvents(evts, moduleID);
        // },
        // ignore: function(evts) {
        //     if (!this.is_arr(evts)) {
        //         var e = evts;
        //         evts = [e];
        //     }

        // this.removeEvents(evts, moduleID);
        // },

        triggerEvent: function(evt) {
            var bindings = this.events[evt.type];
            if (!bindings) {
                return;
            }

            for (var binding in bindings) {
                bindings[binding](evt.data);
            }
        },
        /**
         * Unsubscribes a single module from a set of events
         * @param  {[type]} evts [description]
         * @param  {[type]} mod  [description]
         * @return {[type]}      [description]
         */
        removeEvents: function(evts, mod) {
            evts.forEach(function(event, index, array) {
                delete dmf.events[event][mod];
            });
        },
        log: function(severity, message) {
            if (debug) {

                if (!this.is_arr(message)) {
                    message = [message];
                }

                for (var i = 0; i < message.length; i++) {
                    console[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](JSON.stringify(message[i], null, 4));
                };
            }
        },
        changeLanguage: function(lang) {
            var event = {
                type: 'language-change',
                data: {
                    language: lang
                }
            };
            this.triggerEvent(event);
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
            // dispose: function(obj) {
            //     for (var o in obj)
            //         if (isNaN(parseInt(o))) {
            //             this.dispose(obj[o]);
            //         }
            //     delete obj; 
            // }
    };
}()

//Deprecated namespace usage, delete in future versions
var CORE = dmf;
