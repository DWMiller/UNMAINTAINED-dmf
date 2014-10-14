/**
 * [CORE description]
 * @version  0.15
 */
var CORE = function() {
    'use strict';
    var moduleData = {}
    var debug = true;

    return {
        modules: moduleData,
        config: {},
        data: {},
        events: {},
        /**
         * Triggers starter logic for all game modules
         * @return {[type]} [description]
         */
        activate: function(starter) {
            this.startModule('system-controller');
            if (typeof starter !== 'undefined') {
                this.startModule(starter);
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
                if (temp.initialize && typeof temp.initialize === 'function' && temp.destroy && typeof temp.destroy === 'function') {
                    temp = null;
                    moduleData[moduleID] = {
                        create: creator,
                        instance: null
                    };
                    this.log(1, "Module '" + moduleID + "' Registration : SUCCESS");
                } else {
                    this.log(2, "Module '" + moduleID + "' Registration : FAILED : instance has no initialize or destroy functions");
                }
            } else {
                this.log(2, "Module '" + moduleID + "' Registration : FAILED : one or more arguments are of incorrect type");
            }
        },
        getModule: function(moduleID) {
            var mod = moduleData[moduleID];
            if (mod) {
                return mod.create(this);
            } else {
                return false;
            }
        },
        startModule: function(moduleID) {
            var mod = moduleData[moduleID];

            if (mod) {
                mod.instance = this.getModule(moduleID);
                mod.instance.initialize(this.Sandbox);
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
                data.instance.destroy();
                data.instance = null;
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
                delete CORE.events[event][mod];
            });
        },
        log: function(severity, message) {
            if (debug) {

                if (!this.is_arr(message)) {
                    message = [message];
                }

                for (var i = 0; i < message.length; i++) {
                    console[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message[i]);
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
        dom: {
            find: function(selector, context) {
                var ret = {};

                if (context) {
                    ret = context.querySelector(selector);
                } else {
                    ret = document.querySelector(selector);
                }
                return ret;
            },
            bind: function(element, evt, fn) {
                if (element && evt) {
                    if (typeof evt === 'function') {
                        fn = evt;
                        evt = 'click';
                    }
                    element.addEventListener(evt, fn)
                } else {
                    // log wrong arguments
                }
            },
            unbind: function(element, evt, fn) {
                if (element && evt) {
                    if (typeof evt === 'function') {
                        fn = evt;
                        evt = 'click';
                    }
                    element.removeEventListener(evt, fn)
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
                    console.log('test');
                    element = $(element);
                }

                if (!(toAppend instanceof jQuery)) {
                    toAppend = $(toAppend);
                }

                element.append(toAppend);
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
}()
