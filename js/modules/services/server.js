dmf.createModule('system-server', function(c) {
    'use strict';

    var p_properties = {
        id: 'system-server'
    };

    var config, scope, session;

    var listeners = {
        'server-request': request,
        'server-post': post,
        'session-set': setSession,
        'session-clear': clearSession
    };

    function p_initialize(sb) {
        scope = sb.create(c, p_properties.id);
        config = CORE.config[p_properties.id];
        bindEvents();
    }

    function p_destroy() {
        unbindEvents();
    }

    function bindEvents() {
        scope.listen(listeners);
    }

    function unbindEvents() {
        scope.ignore(Object.keys(listeners));
    }

    function request() {
        //TODO - for GET requests
    }
    
    function post(data) {
        c.log(1, ['REQUEST', data]);

        if (session) {
            data.session = session;
        }

        var settings = {
            url: config.endpoint,
            data: JSON.stringify(data),
            type: 'POST',
            dataType: 'json',
            crossDomain: true,
        };

        return $.ajax(settings)
            .done(function(result) {
                c.log(1, ['RESPONSE', result]);

                for (var obj in result) {
                    scope.notify({
                        type: obj,
                        data: result[obj]
                    });
                }
            })
            .fail(function() {
                //console.log("error");
            })
            .always(function(result) {
                // console.log("complete");
            });
    }

    function setSession(sessionString) {
        session = sessionString;
    }

    function clearSession() {
        session = null;
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };

});
