# browser-require

**browser-require** is a simple, node.js-like ```require()``` for the browser. It is not an asynchronous script loader.

## Usage

Wrapping each module in a ```require.register``` call:

```javascript
require.register('my/module/id', function(module, exports, require) {
	// module code here
});
```

...allows the ```require``` function to return the module's public contents:

```javascript
var lib = require('my/module/id');
```

...exposed by decorating the ```exports``` object:

```javascript
var myModuleVar = 'my module';

exports.myModuleMethod = function() {
  return myModuleVar;
};
```

...or overwritting the ```exports``` object completely:

```javascript
function MyModule() {
  this.myVar = 'my instance var';
};

MyModule.prototype.myMethod = function() {
  return this.myVar;
};

module.exports = MyModule;
```

Each module is supplied with a ```require``` function that resolves relative module ids:

```javascript
var lib = require('./my/lib'); // in current package
var SomeClass = require('../someclass'); // in parent package
var util = require('utils/util'); // from root package
```
