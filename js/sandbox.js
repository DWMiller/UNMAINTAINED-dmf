dmf.Sandbox = {
    create: function(core, moduleProperties) {
        var moduleID = moduleProperties.id || null;
        var module_selector = moduleProperties.selector || null
 
        //Should allow any selector rather than only IDs, but will break existing modules
        var CONTAINER = document.getElementById(module_selector) || core.container;
        return {
            self: function() {
                return CONTAINER;
            },
            find: function(selector) {
                return core.dom.find(selector, CONTAINER);
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
