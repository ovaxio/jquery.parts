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
