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
