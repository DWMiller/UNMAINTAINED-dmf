CORE.Templates = function() {
	return {
		'input-answer': function(data) {
			var input = document.createElement('input');
			input.type = 'text';
			input.className = 'input-answer';
			return input;
		}
	}
}();