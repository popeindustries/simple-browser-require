(function(root) {
	// Load or return cached version of requested module with id 'path' or 'path/index'
	// @param {String} path
	function require (path) {
		// Convert relative path to absolute for cases where 'require' is called outside of a module
		if (!this.module && path.charAt(0) == '.') {
			path = path.slice(2)
		}
		// Find in cache
		var m = require.modules[path] || require.modules[path += '/index'];
		if (!m) {
			throw "Couldn't find module for: " + path;
		}
		// Instantiate the module if it's export object is not yet defined
		if (!m.exports) {
			m.exports = {};
			m.filename = path;
			m.call(m.exports, m, m.exports, require.resolve(path));
		}
		// Return the exports object
		return m.exports;
	};

	// Cache of module objects
	require.modules = {};

	// Partial completion of the module's inner 'require' function
	// Resolves paths relative to the module's current location
	require.resolve = function(path) {
		return function(p) {
			var part, paths, ps;
			// Non relative path
			if (p.charAt(0) !== '.') {
				return require(p);
			}
			// Use the module's own path to resolve relative paths
			paths = path.split('/');
			paths.pop();
			ps = p.split('/');
			for (var i = 0, n = ps.length; i < n; i++) {
				part = ps[i];
				if (part === '..') {
					paths.pop();
				} else if (part !== '.') {
					paths.push(part);
				}
			}
			// Return resolved path
			return require(paths.join('/'));
		};
	};

	// Register a module with id of 'path' and callback of 'fn'
	// @param {String} path
	// @param {Function} fn [signature should be of type (module, exports, require)]
	require.register = function(path, fn) {
		return require.modules[path] = fn;
	};

	// Expose
	root.require = require;
})(this);
