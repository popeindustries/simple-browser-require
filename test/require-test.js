require('../require.js');
var should = require('should')
	, req = global.require;

describe('require', function() {
	describe('require.resolve(curr, path)', function() {
		it('should return the path when absolute', function() {
			req.resolve('some/path', 'some/other/path').should.eql('some/other/path');
		});
		it('should return a correctly resolved path when relative \'./\'', function() {
			req.resolve('some/dir/module', './path').should.eql('some/dir/path');
		});
		it('should return a correctly resolved path when relative \'../\'', function() {
			req.resolve('some/dir/module', '../path').should.eql('some/path');
			req.resolve('some/dir/module', '../../path').should.eql('path');
		});
	})
	describe('require.register(path, fn)', function() {
		it('should store a module by it\'s id', function() {
			req.register('mymodule', function(module, exports, require) {
				module.exports = 'mymodule';
			})
			should.exist(req.modules['mymodule']);
		});
	})
	describe('require(path)', function() {
		it('should return an empty object when an exports object is not defined', function() {
			req.register('mymodule', function(module, exports, require) { });
			should.exist(req('mymodule'));
			req('mymodule').should.eql({});
		});
		it('should return an exports object when defined', function() {
			req.register('mymodule', function(module, exports, require) {
				exports.hi = 'mymodule';
			});
			should.exist(req('mymodule'));
			req('mymodule').hi.should.eql('mymodule');
		});
		it('should allow a module to replace it\'s exports object', function() {
			req.register('mymodule', function(module, exports, require) {
				module.exports = 'mymodule';
			});
			req('mymodule').should.eql('mymodule');
		});
		it('should support neseted require()s', function() {
			req.register('foo', function(module, exports, require) {
				module.exports = 'foo'
			});
			req.register('bar', function(module, exports, require) {
				exports.foo = require('foo');
			});
			req('bar').foo.should.eql('foo');
		});
		it('should support neseted relative require()s', function() {
			req.register('dir/foo', function(module, exports, require) {
				module.exports = 'foo';
			});
			req.register('dir/bar', function(module, exports, require) {
				exports.foo = require('./foo');
			});
			req('dir/bar').foo.should.eql('foo');
		});
		it('should support package indexes', function() {
			req.register('dir/foo', function(module, exports, require) {
				module.exports = 'foo';
			});
			req.register('dir/bar', function(module, exports, require) {
				module.exports = 'bar';
			});
			req.register('dir/index', function(module, exports, require) {
				exports.foo = require('./foo');
				exports.bar = require('./bar');
			});
			req('dir').foo.should.eql('foo');
			req('dir').bar.should.eql('bar');
		});
		it('should resolve ./paths when called outside of a module', function() {
			req.register('foo', function(module, exports, require) {
				module.exports = 'foo';
			});
			req('./foo').should.eql('foo');
		});
		it('should resolve versioned modules when called without version number', function() {
			req.register('foo@1.0.0', function(module, exports, require) {
				module.exports = 'foo';
			});
			req('foo').should.eql('foo');
			req('foo@1.0.0').should.eql('foo');
		});
		it('should support lazy evaluation of modules as strings', function() {
			req.register('foo', "module.exports = \'foo\';")
			req('./foo').should.eql('foo');
		});
		it('should throw an error when called with an unrecognized path', function() {
			req('foo').should.throw();
		});
	})
})