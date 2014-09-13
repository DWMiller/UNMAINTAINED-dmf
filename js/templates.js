CORE.Templates = function() {
	return {
		'exampleTemplate': function(data) {
			var input = document.createElement('input');
			input.type = 'text';
			return input;
		}
	}
}();