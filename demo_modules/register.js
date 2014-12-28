CORE.createModule('register', function(c) {
    'use strict';

    var p_properties = {
        id: 'register',
        listeners: {
            'login.registerResult': registerSuccess,
            'login.success': loggedIn
                //failure creates a login.failure event, and this is handled by the login module
        }
    };

    var scope, elements;

    function p_initialize(sb) {
        scope = sb.create(c, p_properties.id, 'form-register');

        elements = {
            username: scope.find('#form-register-username'),
            password: scope.find('#form-register-password'),
            lname: scope.find('#form-register-lname'),
            fname: scope.find('#form-register-fname'),
            email: scope.find('#form-register-email'),
            register: scope.find('#form-register-register'),
            password_mask: scope.find('#form-register-password_mask'),
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
        c.dom.listen(elements.password_mask, 'click', togglePasswordMask);
        c.dom.listen(elements.register, 'click', register);
    }

    function unbindEvents() {
        c.dom.ignore(elements.password_mask, 'click', togglePasswordMask);
        c.dom.ignore(elements.register, 'click', register);
    }

    function register(event) {
        if (event.preventDefault) {
            event.preventDefault();
        }

        c.notify({
            type: 'server-post',
            data: {
                'login.register': {
                    username: elements.username.value,
                    password: elements.password.value,
                    first_name: elements.fname.value,
                    last_name: elements.lname.value,
                    email: elements.email.value,
                    player_interests: []
                }
            }
        });
    }

    function registerSuccess(data) {
        // data.callback_time: 0
        // data.cookie: "a65e8a58626a11b121f5d92ea3b0a6d2"
        // data.player_id: "5836"
        c.notify({
            type: 'server-post',
            data: {
                'login.outsmart': {
                    username: elements.username.value,
                    password: elements.password.value
                }
            }
        });
    }


    /**
     * [loggedIn description]
     * @return {[type]}
     */
    function loggedIn() {
        //Successfully registration will trigger a login, so wait for login success to stop this module

        c.notify({
            type: 'layout-update',
            data: {
                type: 'hide',
                element: scope.self()
            }
        });

        c.stopModule(p_properties.id);
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
