var fs = require('fs'),
	path = require('path'),
	marked = require('marked'),
	nunjucks = require('nunjucks');

/**
 * Exports a function that renders a blockdown document according to the
 * specification. The provided option object allows insertion of URLs and
 * customization of the nunjucks renderer.
 */
module.exports = function(text, option) {
	// Ensure the first document is a string
	if (typeof text !== 'string') {
		console.err('First parameter to blockdown renderer must be a string.');
		return {};
	}
	// Set the second parameter as an option object
	if (typeof option !== 'object') {
		option = {};
	}

	// Split the text into blocks
	var content = text.split('\n---\n'),
		data = { content: [] },
		block, param, key, value, isJSON,
		i, j;

	// Render each block
	for (i = 0 ; i < content.length ; i++) {
		block = null;

		// Skip empty blocks
		if (content[i].trim().length == 0) {
			continue;
		}

		// While the block starts with a tab
		while (content[i].match(/^\s*\@\w+.*\n/)) {
			// Parse the parameter key and value
			param = content[i].substring(
				content[i].indexOf('@') + 1,
				content[i].indexOf('\n'));

			if (param.indexOf(' ') < 0) {
				key = param;
				value = true;
			}
			else {
				// Parse the key and the value
				key = param.substring(0, param.indexOf(' '));
				try {
					value = param.substring(param.indexOf(' ') + 1);
					value = JSON.parse(value);
				}
				catch(e) {
					// Add a .json ending if not yet there
					isJSON = (value.lastIndexOf('.json') == value.length - 5);

					// Read the file from the path specified
					value = fs.readFileSync((value.indexOf('/') == 0) ? value :
						path.join(option.dir || '', value), 'utf-8');

					// If the file is a JSON file, then parse it
					if (value.length > 0 && isJSON) {
						try {
							value = JSON.parse(value);
						}
						catch(e) {
							console.error(e);
							value = null;
						}
					}
				}
			}

			// Put the key-value pair onto either the global build object, or to the block's build object
			if (key.length > 0 && value != null) {
				if (! block)
					block = {};

				// Append keys of the first block to the top-level object that is returned
				if (i == 0) {
					if (Array.isArray(data[key]))
						data[key].push(value);
					else if (data[key] != null)
						data[key] = [ data[key], value ];
					else
						data[key] = value;
				}
				// Append to the block object
				if (Array.isArray(block[key]))
					block[key].push(value);
				else if (block[key] != null)
					block[key] = [ block[key], value ];
				else
					block[key] = value;
			}

			// Strip the parameter line
			content[i] = content[i].substring(content[i].indexOf('\n') + 1);
		}

		// Split the block into subblocks
		content[i] = content[i].split('\n+++\n');
		for (j = 0 ; j < content[i].length ; j++) {
			if (content[i][j].trim().length > 0) {

				// Set the block's content child
				if (! block)
					block = {};
				block.content = content[i];

				// Convert to markdown
				content[i][j] = marked(content[i][j]);
			}
		}

		// If a block object was generated
		if (block)
			data.content.push(block);
	}

	// If a template file was not provided
	if (! option.template)
		return data;

	// Render with nunjucks
	return nunjucks.renderString(option.template, data);
};
