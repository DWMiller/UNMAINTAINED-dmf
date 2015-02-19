dmf.createModule('system-server', function(c, config) {
    'use strict';

    var properties = {
        id: 'system-server',
        listeners: {
            'server-request': request,
            'server-post': post,
            'session-set': setSession,
            'session-clear': clearSession
        }
    };

    var session;

    // function initialize(scope) {
    // }

    // function destroy() {}

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
            timeout: config.timeout,
            data: JSON.stringify(data),
            type: 'POST',
            dataType: 'json',
            crossDomain: true,
        };

        return $.ajax(settings)
            .done(function(result) {
                c.log(1, ['RESPONSE', result]);

                for (var obj in result) {
                    c.notify({
                        type: obj,
                        data: result[obj]
                    });
                }

                c.notify({
                    type: 'server-response',
                    data: result
                });   
            })
            .fail(function(fail) {
                //console.log("error");
                c.notify({
                    type: 'server-fail',
                    data: fail
                });                
                
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
        properties: properties,
        // initialize: initialize,
        // destroy: destroy
    };

});
