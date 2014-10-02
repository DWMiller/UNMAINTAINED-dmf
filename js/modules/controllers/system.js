CORE.createModule('system-controller', function(c) {
    'use strict';

    var p_properties = {
        id: 'system-controller'
    };

    var scope;

    var listeners = {};

    function p_initialize(sb) {
        scope = sb.create(c, p_properties.id);
        c.startModule('system-server');
        c.startModule('system-data');

        bindEvents();
    }

    function p_destroy() {
        unbindEvents();
        c.stopModule('system-server');
        c.stopModule('system-data');
    }

    function bindEvents() {
        scope.listen(listeners);
    }

    function unbindEvents() {
        scope.ignore(Object.keys(listeners));
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };

});
