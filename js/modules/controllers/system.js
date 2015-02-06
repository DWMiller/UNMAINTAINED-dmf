dmf.createModule('system-controller', function(c) {
    'use strict';

    var properties = {
        id: 'system-controller',
        listeners: {}
    };

    function initialize(scope) {
        c.startModules(['system-server', 'system-data', 'system-localize']);
    }

    function destroy() {
        c.stopModules(['system-server', 'system-data', 'system-localize']);
    }

    return {
        properties: properties,
        initialize: initialize,
        destroy: destroy,
    };

});
