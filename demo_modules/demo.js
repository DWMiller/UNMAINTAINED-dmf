CORE.createModule('demo', function(c) {
    'use strict';

    var p_properties = {
        id: 'demo',
        listeners:{
            'wont-happen': demoFunction,
            'login.failure': loginFailure,
            'register.success': login
        }
    };

    var scope, elements;

    function p_initialize(sb) {
        scope = sb.create(c, p_properties.id, 'module-demo');

        elements = {
            first: scope.find('.first'),
            second: scope.find('.second'),
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

    function demoFunction(somevar) {
        if (somevar) {
            alert(somevar);
        }
    }

    function bindEvents() {
        c.dom.listen(elements.first, 'click', demoFunction(1));
        c.dom.listen(elements.second, 'click', demoFunction(2));
    }

    function unbindEvents() {
        c.dom.ignore(elements.first, 'click', demoFunction);
        c.dom.ignore(elements.second, 'click', demoFunction);
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };

});
