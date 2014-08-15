CORE.createModule('logout', function(c) {
    'use strict';

    var p_properties = {
        id: 'logout'
    };

    var scope, elements;

    var listeners = {};

    function p_initialize(sb) {
        scope = sb.create(c, p_properties.id, 'form-logout');

        elements = {
            logout: scope.find('#form-logout-logout')
        };

        bindEvents();

        scope.show();
    }

    function p_destroy() {
        scope.hide();

        unbindEvents();
        scope = null;
        elements = {};
    }

    function bindEvents() {
        scope.listen(listeners);

        scope.addEvent(elements.logout, 'click', logout);
    }

    function unbindEvents() {
        scope.ignore(Object.keys(listeners));
        scope.removeEvent(elements.logout, 'click', logout);
    }

    function logout(event) {
        event.preventDefault();

        scope.notify({
            type: 'server-post',
            data: {
                'login.logout': {}
            }
        });

        scope.notify({
            type: 'server-post',
            data: {
                'login.logout': {}
            }
        });

        scope.notify({
            type: 'data-clear',
            data: 'user'
        });


        c.stopModule(p_properties.id);
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };

});
