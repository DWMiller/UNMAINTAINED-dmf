// dmf.createModule('system-data', function(c) {
//     'use strict';

//     var properties = {
//         id: 'system-data',
//         listeners:{
//             'data-set': setData,
//             'data-clear': clearData
//         }
//     };

//     var scope;

//     function initialize(sb) {
//         scope = sb.create(c, properties.id);
//     }

//     function destroy() {}

//     function setData(content) {
//         console.log('setData: Data module is deprecated, too be removed or redesigned in future build');
//         c.extend(c.data, content);

//         //Maybe work out a way to customize event based on data updated
//         c.notify({
//             type: 'data-update',
//             data: content
//         });
//     }

//     function clearData(field) {
//         console.log('clearData: Data module is deprecated, too be removed or redesigned in future build');
//         if (typeof field !== 'undefined') {
//             c.data[field] = {};
//             delete c.data[field];
//         } else {
//             c.data = {};
//             delete c.data;
//         }
//     }

//     return {
//         properties: properties,
//         initialize: initialize,
//         destroy: destroy,
//     };

// });
