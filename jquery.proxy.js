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
