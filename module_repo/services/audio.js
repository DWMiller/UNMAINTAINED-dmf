CORE.createModule('audio', function(c) {
	'use strict';

	var p_properties = {
		id: 'audio'
	};

	var scope;

	var listeners = {
		'audio-play': playSound
	};

	function p_initialize(sb) {
		scope = sb.create(c, p_properties.id);
		bindEvents();
	}

	function p_destroy() {
		unbindEvents();
		c.stopAllModules();
	}

	function bindEvents() {
		scope.listen(listeners);
	}

	function unbindEvents() {
		scope.ignore(Object.keys(listeners));
	}

	function playSound(data) {
		var file = data.file;
		
		return false;
	}

	return {
		properties: p_properties,
		initialize: p_initialize,
		destroy: p_destroy,
	};

});