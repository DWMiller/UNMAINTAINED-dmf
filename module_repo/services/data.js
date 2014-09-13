CORE.createModule('data', function(c) {
    'use strict';

    var p_properties = {
        id: 'data'
    };

    var scope;

    var listeners = {
        'data-set': setData,
        'data-clear': clearData
    };

    function p_initialize(sb) {
        scope = sb.create(c, p_properties.id);
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

    function setData(content) {
        c.extend(c.data, content);
    }

    function clearData(field) {
        if (typeof field !== 'undefined') {
            c.data[field] = {};
            delete c.data[field];
        } else {
            c.data = {};
            delete c.data;
        }
    }

    return {
        properties: p_properties,
        initialize: p_initialize,
        destroy: p_destroy,
    };

});
