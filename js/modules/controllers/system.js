dmf.createModule('system-controller', function(c) {
    'use strict';

    var properties = {
        id: 'system-controller',
        listeners: {}
    };

    var scope;

    function initialize(sb) {
        scope = sb.create(c, properties.id);
        
        c.startModule('system-server');
        c.startModule('system-data');
        c.startModule('system-localize');
    }

    function destroy() {
        unbindEvents();
        c.stopModule('system-server');
        c.stopModule('system-data');
        c.stopModule('system-localize');
    }

    return {
        properties: properties,
        initialize: initialize,
        destroy: destroy,
    };

});
