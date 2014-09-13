CORE.extendConfig({
	server: {
		endpoint: 'http://127.0.0.1:8080/',
	}
});

CORE.createModule('server', function(c) {
	'use strict';

	var p_properties = {
		id: 'server'
	};

	var config, scope, cookie;

	var listeners = {
		'server-request': request,
		'server-post': post
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

	function request(path) {
		return $.ajax({
				url: config.endpoint + path,
				dataType: 'json',
			})
			.done(function(result) {
				console.log(result);
				//console.log("success");
			})
			.fail(function() {
				//console.log("error");
			})
			.always(function() {
				//console.log("complete");
			});
	}

	function post(data) {
		c.log(1, ['REQUEST',data]);

		var settings = {
			url: config.endpoint,
			data: JSON.stringify(data),
			type: 'POST',
			dataType: 'json',
			crossDomain: true,
		};

		return $.ajax(settings)
			.done(function(result) {
				c.log(1, ['RESPONSE',result]);

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

	return {
		properties: p_properties,
		initialize: p_initialize,
		destroy: p_destroy,
	};

});