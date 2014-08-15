var Sandbox = {
    create: function(core, moduleID, module_selector) {
        var CONTAINER = document.getElementById(module_selector) || document.getElementById('main-container');
        return {
            self: function() {
                return CONTAINER;
            },
            find: function(selector) {
                return core.dom.find(selector, CONTAINER);
            },
            addEvent: function(element, type, fn) {
                core.dom.bind(element, type, fn);
            },
            removeEvent: function(element, type, fn) {
                core.dom.unbind(element, type, fn);
            },
            notify: function(evt) {
                if (core.is_obj(evt) && evt.type) {
                    core.triggerEvent(evt);
                }
            },
            listen: function(evts) {
                if (core.is_obj(evts)) {
                    core.registerEvents(evts, moduleID);
                }
            },
            ignore: function(evts) {
                if (core.is_arr) {
                    core.removeEvents(evts, moduleID);
                }
            },
            hide: function(element) {
                if (typeof element === 'undefined') {
                    element = CONTAINER;
                }

                this.notify({
                    type: 'layout-update',
                    data: {
                        type: 'hide',
                        element: element
                    }
                });
            },
            show: function(element) {
                if (typeof element === 'undefined') {
                    element = CONTAINER;
                }

                this.notify({
                    type: 'layout-update',
                    data: {
                        type: 'show',
                        element: element
                    }
                });
            }
        };
    }
}
