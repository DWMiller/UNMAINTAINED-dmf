CORE.createModule('logout', function(c) {
    'use strict';

    var p_properties = {
        id: 'logout',
        listeners:{}
    };

    var scope, elements;

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
        c.dom.listen(elements.logout, 'click', logout);
    }

    function unbindEvents() {
        c.dom.ignore(elements.logout, 'click', logout);
    }

    function logout(event) {
        event.preventDefault();

        c.notify({
            type: 'server-post',
            data: {
                'login.logout': {}
            }
        });

        c.notify({
            type: 'server-post',
            data: {
                'login.logout': {}
            }
        });

        c.notify({
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
