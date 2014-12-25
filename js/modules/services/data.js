dmf.createModule('system-data', function(c) {
    'use strict';

    var p_properties = {
        id: 'system-data'
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
        console.log('Data module is deprecated, too be removed or redesigned in future build');
        c.extend(c.data, content);

        //Maybe work out a way to customize event based on data updated
        scope.notify({
            type: 'data-update',
            data: content
        });
    }

    function clearData(field) {
        console.log('Data module is deprecated, too be removed or redesigned in future build')        ;
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
