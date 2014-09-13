CORE.createModule('login', function(c) {
    'use strict';

    var p_properties = {
        id: 'login'
    };

    var scope, elements;

    var listeners = {
        'login.success': loginSuccess,
        'login.failure': loginFailure,
        'register.success': login
    };

    function p_initialize(sb) {
        scope = sb.create(c, p_properties.id, 'form-login');

        elements = {
            username: scope.find('#form-login-username'),
            password: scope.find('#form-login-password'),
            login: scope.find('#form-login-login'),
            password_mask: scope.find('#form-login-password_mask'),
            msg: scope.find('#form-login-msg')
        };

        scope.show();

        bindEvents();
    }

    function p_destroy() {
        scope.hide();

        unbindEvents();
        scope = null;
        elements = {};
    }

    function bindEvents() {
        scope.listen(listeners);

        scope.addEvent(elements.login, 'click', login);
        scope.addEvent(elements.password_mask, 'click', togglePasswordMask);

    }

    function unbindEvents() {
        scope.ignore(Object.keys(listeners));

        scope.removeEvent(elements.login, 'click', login);
        scope.removeEvent(elements.password_mask, 'click', togglePasswordMask);
    }

    function login(event) {
        if (event.preventDefault) {
            event.preventDefault();
        }

        scope.notify({
            type: 'server-post',
            data: {
                'login.outsmart': {
                    username: elements.username.value,
                    password: elements.password.value
                }
            }
        });
    }

    function loginSuccess(data) {
        scope.notify({
            type: 'data-set',
            data: {
                user: {
                    id: data.player_id,
                    cookie: data.cookie
                }
            }
        });

        c.stopModule(p_properties.id);
    }

    function loginFailure(data) {
        data.type = 'error';

        c.dom.addClass(elements.msg, data.type);
        elements.msg.innerHTML = data.message;

        // scope.notify({
        //  type: 'auth-message',
        //  data: data
        // });
    }

    /**
     * Toggle masked state of password input
     * @return {[type]} [description]
     */
    function togglePasswordMask(event) {
        if (event.currentTarget.checked) {
            $(elements.password).attr('type', 'password');
        } else {
            $(elements.password).attr('type', 'text');
        }
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };

});
