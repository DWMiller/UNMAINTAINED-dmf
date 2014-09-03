var CORE = function() {
    'use strict';
    var moduleData = {}
    var debug = true;

    return {
        config: {},
        data: {},
        /**
         * Triggers starter logic for all game modules
         * @return {[type]} [description]
         */
        activate: function() {
            console.time('startup');
            this.startModule('controller');
            console.timeEnd('startup');
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
                return = mod.create(this);
            } else {
                return false;
            }
        },        
        startModule: function(moduleID) {
            var mod = moduleData[moduleID];

            if (mod) {
                mod.instance = this.getModule(moduleID);
                mod.instance.initialize(Sandbox);
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
                if (moduleData[mod]) {
                    moduleData[mod].events = evts;
                } else {
                    // this.log(1, mod);
                }
            } else {
                // this.log(1, mod);
            }
        },
        triggerEvent: function(evt) {
            var mod;

            for (mod in moduleData) {
                if (moduleData.hasOwnProperty(mod)) {
                    mod = moduleData[mod];
                    if (mod.events && mod.events[evt.type]) {
                        mod.events[evt.type](evt.data);
                    }
                }
            }
        },
        removeEvents: function(evts, mod) {
            if (this.is_obj(evts) && mod && (mod = moduleData[mod]) && mod.events) {
                delete mod.events;
            }
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
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
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