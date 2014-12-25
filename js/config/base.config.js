/**
 * Base config file
 * Not loaded in a specific order, so may override other config files with matching fields
 * Provided as a location for general config settings if an individual file is not appropriate or not preferred.
 * @type {Object}
 */
dmf.extendConfig({
	'system-server': {
		endpoint: 'http://127.0.0.1:8080/',
	},	
	'system-localize': {
		default_language: 'en',
		path:'js/localization/',
		ext: '.lang.json'		
	}	
});