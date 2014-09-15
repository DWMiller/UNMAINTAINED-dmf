CORE.createModule('controller', function(c) {
    'use strict';

    var p_properties = {
        id: 'controller'
    };

    var scope;

    var listeners = {};

    function p_initialize(sb) {
        scope = sb.create(c, p_properties.id);
        bindEvents();

        c.startModule('layout');
        c.startModule('demo');

        scope.notify({
            type: 'layout-update',
            data: {
                type: 'show',
                element: scope.find('#module-demo')
            }
        });
    }

    function p_destroy() {
        unbindEvents();
        c.stopAllModules();
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
