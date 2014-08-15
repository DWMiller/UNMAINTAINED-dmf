CORE.createModule('controller', function(c) {
    'use strict';

    var p_properties = {
        id: 'controller'
    };

    var scope;

    var listeners = {
        'login.success': function() {
            c.startModule('logout');
            c.startModule('lobby');
            //c.startModule('room');
        },
        'login.logoutResult': function() {
            c.startModule('login');
            c.startModule('register');
        },
    };

    function p_initialize(sb) {
        scope = sb.create(c, p_properties.id);
        bindEvents();

        c.startModule('server');
        c.startModule('data');
        c.startModule('audio');
        c.startModule('login');
        c.startModule('register');
        c.startModule('layout');

        scope.notify({
            type: 'layout-update',
            data: {
                type: 'show',
                element: scope.find('#page-auth')
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
