CORE.createModule('demo', function(c) {
    'use strict';

    var p_properties = {
        id: 'demo'
    };

    var scope, elements;

    var listeners = {
        'wont-happen': demoFunction,
    };

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
        if(somevar) {
            alert(somevar);
        }
    }

    function bindEvents() {
        scope.listen(listeners);
        scope.addEvent(elements.first, 'click', function() {
            demoFunction(1);
        });
            
        scope.addEvent(elements.second, 'click', function() {
            demoFunction(2);
        });
    }

    function unbindEvents() {
        scope.ignore(Object.keys(listeners));
        scope.removeEvent(elements.first, 'click', demoFunction);
        scope.removeEvent(elements.second, 'click', demoFunction);        
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };

});
