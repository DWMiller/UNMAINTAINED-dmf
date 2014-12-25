dmf.Sandbox = {
    create: function(core, moduleID, module_selector) {
        //Should allow any selector rather than only IDs, but will break existing modules
        var CONTAINER = document.getElementById(module_selector) || core.container;
        return {
            self: function() {
                return CONTAINER;
            },
            find: function(selector) {
                return core.dom.find(selector, CONTAINER);
            },
            addEvent: function(element, type, fn) {
                console.log('Sandbox.addEvent is deprecated - use dmf.dom.listen with same args');
                core.dom.listen(element, type, fn);
            },
            removeEvent: function(element, type, fn) {
                console.log('Sandbox.removeEvent is deprecated - use dmf.dom.ignore with same args');
                core.dom.ignore(element, type, fn);
            },
            // Deprecated as sandbox component, used within CORE now
            notify: function(evt) {
                // console.log('"notify" function access via sandbox is deprecated, access via CORE instead ');
                if (core.is_obj(evt) && evt.type) {
                    core.triggerEvent(evt);
                }
            },
            // Deprecated as sandbox component, used within CORE now
            listen: function(evts) {
                // console.log('"listen" function access via sandbox is deprecated, access via CORE instead ');
                core.registerEvents(evts, moduleID);
            },
            // Deprecated as sandbox component, used within CORE now
            ignore: function(evts) {
                // console.log('"ignore" function access via sandbox is deprecated, access via CORE instead ');
                if (!core.is_arr(evts)) {
                    var e = evts;
                    evts = [e];
                }

                core.removeEvents(evts, moduleID);
            },
            hide: function(element) {
                if (typeof element === 'undefined') {
                    element = CONTAINER;
                }

                core.dom.removeClass(element, 'visible');
                core.dom.addClass(element, 'hidden');
            },
            show: function(element) {
                if (typeof element === 'undefined') {
                    element = CONTAINER;
                }

                core.dom.addClass(element, 'visible');
                core.dom.removeClass(element, 'hidden');
            }
        };
    }
}
