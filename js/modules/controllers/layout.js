CORE.createModule('layout',function(c) {
'use strict';

	var p_properties = {
		id: 'layout'
	};

	var scope,elements;

	var listeners = {
		'layout-update' : updateLayout
	};

	function p_initialize(sb) {
		scope = sb.create(c,p_properties.id);
		bindEvents();
	}

	function p_destroy() {
		unbindEvents();
		scope = null;
	}

	function bindEvents() {
        scope.listen(listeners);
	}

	function unbindEvents() {
		scope.ignore(Object.keys(listeners));
	}

	function updateLayout(event) {
		actions[event.type](event.element);
	}

	function showElement(element) {
		c.dom.addClass(element,'visible');
		c.dom.removeClass(element,'hidden');
	}

	function hideElement(element) {
		c.dom.removeClass(element,'visible');
		c.dom.addClass(element,'hidden');
	}

	var actions = {
		hide: hideElement,
		show: showElement
	};
	
	return {
		properties:p_properties,
		initialize: p_initialize,
		destroy: p_destroy,
	};



});

