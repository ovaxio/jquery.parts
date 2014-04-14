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
