
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("jquery.parts/jquery.callbacks.js", function(exports, require, module){
/*!
 * jQuery JavaScript Library v1.8.3
 * http://jquery.com/
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

/*

jQuery.Callbacks() extracted from the jQuery 1.8.3 source

Credit: @sindresorhus, @wibblymat


Same as jQuery, but `Callbacks` instead of `$.Callbacks`.

Usage:
function fn1( value ){
    console.log( value );
}

function fn2( value ){
    fn1("fn2 says:" + value);
    return false;
}

var callbacks = Callbacks();

callbacks.add( fn1 );
callbacks.fire( "foo!" ); // outputs: foo!

callbacks.add( fn2 );
callbacks.fire( "bar!" ); // outputs: bar!, fn2 says: bar!


Demo: http://jsfiddle.net/mofle/7E6d2/


See the jQuery API for documentation:
http://api.jquery.com/jQuery.Callbacks/


*/
(function( window, exports ) {
	"use strict";
	var Callbacks;

	// jquery core functions, cut-down to just the cases we need
	var each = function( obj, callback ) {
		var i = 0,
			length = obj.length;

		for ( ; i < length; ) {
			if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
				break;
			}
		}

		return obj;
	};

	var extend = function() {
		var options, name, copy,
			target = arguments[0] || {};

		// Only deal with non-null/undefined values
		if ( (options = arguments[ 1 ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}

		// Return the modified object
		return target;
	};

	var inArray = function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( Array.prototype.indexOf ) {
				return Array.prototype.indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	};

	var classType = (function() {
		var class2type = {};

		each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
			class2type[ "[object " + name + "]" ] = name.toLowerCase();
		});

		return function( obj ) {
			return obj == null ?
				String( obj ) :
				class2type[ Object.prototype.toString.call(obj) ] || "object";
		};
	})();

	// String to Object options format cache
	var optionsCache = {};

	// Convert String-formatted options into Object-formatted ones and store in cache
	function createOptions( options ) {
		var object = optionsCache[ options ] = {};
		each( options.split( /\s+/ ), function( _, flag ) {
			object[ flag ] = true;
		});
		return object;
	}

	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	Callbacks = function( options ) {

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			( optionsCache[ options ] || createOptions( options ) ) :
			extend( {}, options );

		var // Last fire value (for non-forgettable lists)
			memory,
			// Flag to know if list was already fired
			fired,
			// Flag to know if list is currently firing
			firing,
			// First callback to fire (used internally by add and fireWith)
			firingStart,
			// End of the loop when firing
			firingLength,
			// Index of currently firing callback (modified by remove if needed)
			firingIndex,
			// Actual callback list
			list = [],
			// Stack of fire calls for repeatable lists
			stack = !options.once && [],
			// Fire callbacks
			fire = function( data ) {
				memory = options.memory && data;
				fired = true;
				firingIndex = firingStart || 0;
				firingStart = 0;
				firingLength = list.length;
				firing = true;
				for ( ; list && firingIndex < firingLength; firingIndex++ ) {
					if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
						memory = false; // To prevent further calls using add
						break;
					}
				}
				firing = false;
				if ( list ) {
					if ( stack ) {
						if ( stack.length ) {
							fire( stack.shift() );
						}
					} else if ( memory ) {
						list = [];
					} else {
						self.disable();
					}
				}
			},
			// Actual Callbacks object
			self = {
				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {
						// First, we save the current length
						var start = list.length;
						(function add( args ) {
							each( args, function( _, arg ) {
								var type = classType( arg );
								if ( type === "function" ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && type !== "string" ) {
									// Inspect recursively
									add( arg );
								}
							});
						})( arguments );
						// Do we need to add the callbacks to the
						// current firing batch?
						if ( firing ) {
							firingLength = list.length;
						// With memory, if we're not firing then
						// we should call right away
						} else if ( memory ) {
							firingStart = start;
							fire( memory );
						}
					}
					return this;
				},
				// Remove a callback from the list
				remove: function() {
					if ( list ) {
						each( arguments, function( _, arg ) {
							var index;
							while( ( index = inArray( arg, list, index ) ) > -1 ) {
								list.splice( index, 1 );
								// Handle firing indexes
								if ( firing ) {
									if ( index <= firingLength ) {
										firingLength--;
									}
									if ( index <= firingIndex ) {
										firingIndex--;
									}
								}
							}
						});
					}
					return this;
				},
				// Control if a given callback is in the list
				has: function( fn ) {
					return inArray( fn, list ) > -1;
				},
				// Remove all callbacks from the list
				empty: function() {
					list = [];
					return this;
				},
				// Have the list do nothing anymore
				disable: function() {
					list = stack = memory = undefined;
					return this;
				},
				// Is it disabled?
				disabled: function() {
					return !list;
				},
				// Lock the list in its current state
				lock: function() {
					stack = undefined;
					if ( !memory ) {
						self.disable();
					}
					return this;
				},
				// Is it locked?
				locked: function() {
					return !stack;
				},
				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( list && ( !fired || stack ) ) {
						if ( firing ) {
							stack.push( args );
						} else {
							fire( args );
						}
					}
					return this;
				},
				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},
				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};

		return self;
	};

	exports.Callbacks = Callbacks;

})( window, exports );

});
require.register("jquery.parts/jquery.documentReady.js", function(exports, require, module){
/*
	jQuery's document.ready/$(function(){}) should
	you wish to use a cross-browser DOMReady solution
	without opting for a library.

	Demo: http://jsfiddle.net/zKLpb/

	usage:
	$(function(){
		// your code
	});

	Parts: jQuery project, Diego Perini, Lucent M.
	This version: Addy Osmani
*/
(function( window, exports ) {
	"use strict";

	// Define a local copy of $
	var $ = function( callback ) {
			readyBound = false;
			$.isReady = false;
			if ( typeof callback === "function" ) {
				DOMReadyCallback = callback;
			}
			bindReady();
		},

		// Use the correct document accordingly with window argument (sandbox)
		document = window.document,
		readyBound = false,
		DOMReadyCallback = function() {},

		// The ready event handler
		DOMContentLoaded = function() {
			if ( document.addEventListener ) {
					document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			} else {
					// we're here because readyState !== "loading" in oldIE
					// which is good enough for us to call the dom ready!
					document.detachEvent( "onreadystatechange", DOMContentLoaded );
			}
			DOMReady();
		},

		// Handle when the DOM is ready
		DOMReady = function() {
			// Make sure that the DOM is not already loaded
			if ( !$.isReady ) {
				// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
				if ( !document.body ) {
					return setTimeout( DOMReady, 1 );
				}
				// Remember that the DOM is ready
				$.isReady = true;
				// If there are functions bound, to execute
				DOMReadyCallback();
				// Execute all of them
			}
		}, // /ready()

		bindReady = function() {
			var toplevel = false;

			if ( readyBound ) {
				return;
			}
			readyBound = true;

			// Catch cases where $ is called after the
			// browser event has already occurred.
			if ( document.readyState !== "loading" ) {
				DOMReady();
			}

			// Mozilla, Opera and webkit nightlies currently support this event
			if ( document.addEventListener ) {
				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
				// A fallback to window.onload, that will always work
				window.addEventListener( "load", DOMContentLoaded, false );
				// If IE event model is used
			} else if ( document.attachEvent ) {
				// ensure firing before onload,
				// maybe late but safe also for iframes
				document.attachEvent( "onreadystatechange", DOMContentLoaded );
				// A fallback to window.onload, that will always work
				window.attachEvent( "onload", DOMContentLoaded );
				// If IE and not a frame
				// continually check to see if the document is ready
				try {
					toplevel = window.frameElement == null;
				} catch (e) {}
				if ( document.documentElement.doScroll && toplevel ) {
					doScrollCheck();
				}
			}
		},

		// The DOM ready check for Internet Explorer
		doScrollCheck = function() {
			if ( $.isReady ) {
				return;
			}
			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left");
			} catch ( error ) {
				setTimeout( doScrollCheck, 1 );
				return;
			}
			// and execute any waiting functions
			DOMReady();
		};

	// Is the DOM ready to be used? Set to true once it occurs.
	$.isReady = false;

	// Expose $ to the global object
	exports.documentReady = $;

})( window, exports );

});
require.register("jquery.parts/jquery.extend.js", function(exports, require, module){
/*!
 * jQuery JavaScript Library v1.8.3
 * http://jquery.com/
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

/*
  jQuery.extend extracted from the jQuery source
  Here's a demo: http://jsfiddle.net/8EkqF/
  Credits: @FGRibreau, @addyosmani, @wibblymat

  Usage:
  // Extend
  var obj = extend({opt1:true, opt2:true}, {opt1:false});

  // Deep Copy
  var clonedObject = extend(true, {}, myObject);
  var clonedArray = extend(true, [], ['a',['b','c',['d']]]);
*/

(function ( window, exports ) {
	"use strict";
	// [[Class]] -> type pairs
	var class2type = {},
		core_toString = Object.prototype.toString,
		core_hasOwn = Object.prototype.hasOwnProperty;

	var each = function( obj, callback ) {
		var i = 0,
			length = obj.length;

		for ( ; i < length; ) {
			if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
				break;
			}
		}

		return obj;
	};


	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	var isFunction = function( obj ) {
		return classType(obj) === "function";
	};

	var isArray = Array.isArray || function( obj ) {
		return classType(obj) === "array";
	};

	var isWindow = function( obj ) {
		return obj != null && obj == obj.window;
	};

	var classType = function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ core_toString.call(obj) ] || "object";
	};

	var isPlainObject = function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || classType(obj) !== "object" || obj.nodeType || isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	};


	// Populate the class2type map
	each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});

	exports.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !isFunction(target) ) {
			target = {};
		}

		// extend jQuery itself if only one argument is passed
		if ( length === i ) {
			target = this;
			--i;
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( isPlainObject(copy) || (copyIsArray = isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];

						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = exports.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};
}( window, exports ));

});
require.register("jquery.parts/jquery.proxy.js", function(exports, require, module){
/*!
 * jQuery JavaScript Library v1.8.3
 * http://jquery.com/
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

/*
  jQuery.proxy extracted from the jQuery source
  Here's a demo: http://jsfiddle.net/BuZ7J/
  Credits: @coutoantisocial, @wibblymat

  Usage:
  // Extend
  var obj = proxy(function () {
      return this;
  }, document);

  obj() // returns document
*/

(function ( window, exports ) {
	"use strict";
	// [[Class]] -> type pairs
	var class2type = {},
		core_toString = Object.prototype.toString,
		core_slice = Array.prototype.slice,
		guid = 1;

	var each = function( obj, callback ) {
		var i = 0,
			length = obj.length;

		for ( ; i < length; ) {
			if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
				break;
			}
		}

		return obj;
	};

	var isFunction = function( obj ) {
		return classType(obj) === "function";
	};

	var classType = function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ core_toString.call(obj) ] || "object";
	};

    // Bind a function to a context, optionally partially applying any
	// arguments.
  exports.proxy = function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || guid++;

		return proxy;
	};

	// Populate the class2type map
	each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});
}( window, exports ));

});
require.register("jquery.parts/jquery.type.js", function(exports, require, module){
/*!
 * jQuery JavaScript Library v1.8.3
 * http://jquery.com/
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

/*

jQuery.type() and other specific type checks
extracted from the jQuery 1.8.3 source

Credit: @sindresorhus, @wibblymat


Usage:
console.log( isFunction( function(){} ) ); // true
console.log( isFunction( ['a','b'] ) ); // false
console.log( isArray( ['a','b'] ) ); // true


Demo: http://jsfiddle.net/mofle/AzdKq/


See the jQuery API for documentation:
http://api.jquery.com/category/utilities/


*/
(function( window, exports ) {
	"use strict";

	// [[Class]] -> type pairs
	var class2type = {},
		core_toString = Object.prototype.toString,
		core_hasOwn = Object.prototype.hasOwnProperty;

	var each = function( obj, callback ) {
		var i = 0,
			length = obj.length;

		for ( ; i < length; ) {
			if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
				break;
			}
		}

		return obj;
	};


	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	exports.isFunction = function( obj ) {
		return exports.type(obj) === "function";
	};

	exports.isArray = Array.isArray || function( obj ) {
		return exports.type(obj) === "array";
	};

	exports.isWindow = function( obj ) {
		return obj != null && obj == obj.window;
	};

	exports.isNumeric = function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	};

	exports.type = function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ core_toString.call(obj) ] || "object";
	};

	exports.isPlainObject = function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || exports.type(obj) !== "object" || obj.nodeType || exports.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	};

	exports.isEmptyObject = function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	};


	// Populate the class2type map
	each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});
})( window, exports );

});