dmf.Sandbox = {
    create: function(core, moduleProperties) {
        var moduleID = moduleProperties.id || null;
        var module_selector = moduleProperties.selector || null
 
        //Should allow any selector rather than only IDs, but will break existing modules
        var CONTAINER = document.getElementById(module_selector) || core.container;
        return {
            self: function() {
                core.log(2,'Sandbox:self() deprecated, sandbox being removed');
                return CONTAINER;
            },
            find: function(selector) {
                core.log(2,'Sandbox:find() deprecated, sandbox being removed');
                return core.dom.find(selector, CONTAINER);
            },            
            hide: function(element) {
                core.log(2,'Sandbox:hide() deprecated, sandbox being removed');
                if (typeof element === 'undefined') {
                    element = CONTAINER;
                }

                core.dom.removeClass(element, 'visible');
                core.dom.addClass(element, 'hidden');
            },
            show: function(element) {
                core.log(2,'Sandbox:show() deprecated, sandbox being removed');
                if (typeof element === 'undefined') {
                    element = CONTAINER;
                }

                core.dom.addClass(element, 'visible');
                core.dom.removeClass(element, 'hidden');
            }
        };
    }
}
