
lychee = typeof lychee !== 'undefined' ? lychee : (function(global) {

	/*
	 * NAMESPACE
	 */

	if (typeof lychee === 'undefined') {
		lychee = global.lychee = {};
	}



	/*
	 * POLYFILLS
	 */

	if (typeof Array.prototype.fill !== 'function') {

		Array.prototype.fill = function(value/*, start = 0, end = this.length */) {

			if (this === null || this === undefined) {
				throw new TypeError('Array.prototype.fill called on null or undefined');
			}

			var list      = Object(this);
			var length    = list.length >>> 0;
			var start     = arguments[1];
			var end       = arguments[2];
			var rel_start = start === undefined ?      0 : start >> 0;
			var rel_end   = end === undefined   ? length : end >> 0;


			var i_start = rel_start < 0 ? Math.max(length + rel_start, 0) : Math.min(rel_start, length);
			var i_end   = rel_end < 0   ? Math.max(length + rel_end, 0)   : Math.min(rel_end, length);

			for (var i = i_start; i < i_end; i++) {
				list[i] = value;
			}


			return list;

		};

	}

	if (typeof Array.prototype.find !== 'function') {

		Array.prototype.find = function(predicate/*, thisArg */) {

			if (this === null || this === undefined) {
				throw new TypeError('Array.prototype.find called on null or undefined');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			var list    = Object(this);
			var length  = list.length >>> 0;
			var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
			var value;

			for (var i = 0; i < length; i++) {

				value = list[i];

				if (predicate.call(thisArg, value, i, list)) {
					return value;
				}

			}


			return undefined;

		};

	}

	if (typeof Array.prototype.unique !== 'function') {

		Array.prototype.unique = function() {

			if (this === null || this === undefined) {
				throw new TypeError('Array.prototype.unique called on null or undefined');
			}


			var clone  = [];
			var list   = Object(this);
			var length = this.length >>> 0;
			var value;

			for (var i = 0; i < length; i++) {

				value = list[i];

				if (clone.indexOf(value) === -1) {
					clone.push(value);
				}
			}

			return clone;

		};

	}

	if (typeof Boolean.prototype.toJSON !== 'function') {

		Boolean.prototype.toJSON = function() {
			return this.valueOf();
		};

	}

	if (typeof Date.prototype.toJSON !== 'function') {

		var _format_date = function(n) {
			return n < 10 ? '0' + n : '' + n;
		};

		Date.prototype.toJSON = function() {

			if (isFinite(this.valueOf()) === true) {

				return this.getUTCFullYear()             + '-' +
					_format_date(this.getUTCMonth() + 1) + '-' +
					_format_date(this.getUTCDate())      + 'T' +
					_format_date(this.getUTCHours())     + ':' +
					_format_date(this.getUTCMinutes())   + ':' +
					_format_date(this.getUTCSeconds())   + 'Z';

			}


			return null;

		};

	}

	if (typeof Number.prototype.toJSON !== 'function') {

		Number.prototype.toJSON = function() {
			return this.valueOf();
		};

	}

	if (typeof Object.filter !== 'function') {

		Object.filter = function(object, predicate/*, thisArg */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.filter called on a non-object');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			var props   = [];
			var values  = [];
			var thisArg = arguments.length >= 3 ? arguments[2] : void 0;

			for (var prop in object) {

				var value = object[prop];

				if (Object.prototype.hasOwnProperty.call(object, prop)) {

					if (predicate.call(thisArg, value, prop, object)) {
						props.push(prop);
						values.push(value);
					}

				}

			}


			var filtered = {};

			for (var i = 0; i < props.length; i++) {
				filtered[props[i]] = values[i];
			}

			return filtered;

		};

	}

	if (typeof Object.find !== 'function') {

		Object.find = function(object, predicate/*, thisArg */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.find called on a non-object');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			var thisArg = arguments.length >= 3 ? arguments[2] : void 0;

			for (var prop in object) {

				var value = object[prop];

				if (Object.prototype.hasOwnProperty.call(object, prop)) {

					if (predicate.call(thisArg, value, prop, object)) {
						return value;
					}

				}

			}

			return undefined;

		};

	}

	if (typeof Object.keys !== 'function') {

		Object.keys = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('Object.keys called on a non-object');
			}


			var keys = [];

			for (var prop in object) {

				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					keys.push(prop);
				}

			}

			return keys;

		};

	}

	if (typeof Object.map !== 'function') {

		Object.map = function(object, predicate/*, thisArg */) {

			if (object !== Object(object)) {
				throw new TypeError('Object.map called on a non-object');
			}

			if (typeof predicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}


			var clone   = {};
			var keys    = Object.keys(object).sort();
			var length  = keys.length >>> 0;
			var thisArg = arguments.length >= 3 ? arguments[2] : void 0;
			var key;
			var value;
			var tmp;


			for (var k = 0; k < length; k++) {

				key   = keys[k];
				value = object[key];
				tmp   = predicate.call(thisArg, value, key);

				if (tmp !== undefined) {
					clone[key] = tmp;
				}

			}


			return clone;

		};

	}

	if (typeof Object.sort !== 'function') {

		Object.sort = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('Object.sort called on a non-object');
			}


			var clone  = {};
			var keys   = Object.keys(object).sort();
			var length = keys.length >>> 0;
			var key;
			var value;

			for (var k = 0; k < length; k++) {

				key   = keys[k];
				value = object[key];

				if (value instanceof Array) {

					clone[key] = value.map(function(element) {

						if (element instanceof Array) {
							return element;
						} else if (element instanceof Object) {
							return Object.sort(element);
						} else {
							return element;
						}

					});

				} else if (value instanceof Object) {

					clone[key] = Object.sort(value);

				} else {

					clone[key] = value;

				}

			}

			return clone;

		};

	}

	if (typeof Object.values !== 'function') {

		Object.values = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('Object.values called on a non-object');
			}


			var values = [];

			for (var prop in object) {

				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					values.push(object[prop]);
				}

			}

			return values;

		};

	}

	if (typeof String.prototype.replaceObject !== 'function') {

		String.prototype.replaceObject = function(object) {

			if (object !== Object(object)) {
				throw new TypeError('String.prototype.replaceObject called on a non-object');
			}


			var clone  = '' + this;
			var keys   = Object.keys(object);
			var values = Object.values(object);


			for (var k = 0, kl = keys.length; k < kl; k++) {

				var key   = keys[k];
				var value = values[k];

				if (value instanceof Array) {
					value = JSON.stringify(value);
				} else if (value instanceof Object) {
					value = JSON.stringify(value);
				} else if (typeof value !== 'string') {
					value = '' + value;
				}


				var pointers = [];
				var pointer  = clone.indexOf('${' + key + '}');

				while (pointer !== -1) {
					pointers.push(pointer);
					pointer = clone.indexOf('${' + key + '}', pointer + 1);
				}


				var offset = 0;

				for (var p = 0, pl = pointers.length; p < pl; p++) {

					var index = pointers[p];

					clone   = clone.substr(0, index + offset) + value + clone.substr(index + offset + key.length + 3);
					offset += (value.length - (key.length + 3));

				}

			}


			return clone;

		};

	}

	if (typeof String.prototype.toJSON !== 'function') {

		String.prototype.toJSON = function() {
			return this.valueOf();
		};

	}

	if (typeof String.prototype.trim !== 'function') {

		String.prototype.trim = function() {
			return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
		};

	}



	/*
	 * HELPERS
	 */

	var _environment = null;

	var _bootstrap_environment = function() {

		if (_environment === null) {

			_environment = new lychee.Environment({
				debug: false
			});

		}


		if (this.environment === null) {
			this.setEnvironment(_environment);
		}

	};

	var _resolve_reference = function(identifier) {

		var pointer = this;

		var ns = identifier.split('.');
		for (var n = 0, l = ns.length; n < l; n++) {

			var name = ns[n];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else {
				pointer = null;
				break;
			}

		}

		return pointer;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Module = {

		debug:        true,
		environment:  _environment,

		ENVIRONMENTS: {},
		ROOT:         {
			lychee:  null,
			project: null
		},
		VERSION:      "2016-Q1",



		/*
		 * LIBRARY API
		 */

		diff: function(aobject, bobject) {

			var akeys = Object.keys(aobject);
			var bkeys = Object.keys(bobject);

			if (akeys.length !== bkeys.length) {
				return true;
			}


			for (var a = 0, al = akeys.length; a < al; a++) {

				var key = akeys[a];

				if (bobject[key] !== undefined) {

					if (aobject[key] !== null && bobject[key] !== null) {

						if (aobject[key] instanceof Object && bobject[key] instanceof Object) {

							if (lychee.diff(aobject[key], bobject[key]) === true) {

								// Allows aobject[key].builds = {} and bobject[key].builds = { stuff: {}}
								if (Object.keys(aobject[key]).length > 0) {
									return true;
								}

							}

						} else if (typeof aobject[key] !== typeof bobject[key]) {
							return true;
						}

					}

				} else {
					return true;
				}

			}


			return false;

		},

		enumof: function(template, value) {

			if (template instanceof Object && typeof value === 'number') {

				var valid = false;

				for (var val in template) {

					if (value === template[val]) {
						valid = true;
						break;
					}

				}


				return valid;

			}


			return false;

		},

		extend: function(target) {

			for (var a = 1, al = arguments.length; a < al; a++) {

				var object = arguments[a];
				if (object) {

					for (var prop in object) {

						if (object.hasOwnProperty(prop) === true) {
							target[prop] = object[prop];
						}

					}

				}

			}


			return target;

		},

		extendsafe: function(target) {

			for (var a = 1, al = arguments.length; a < al; a++) {

				var object = arguments[a];
				if (object) {

					for (var prop in object) {

						if (object.hasOwnProperty(prop) === true) {

							var tvalue = target[prop];
							var ovalue = object[prop];
							if (tvalue instanceof Array && ovalue instanceof Array) {

								lychee.extendsafe(target[prop], object[prop]);

							} else if (tvalue instanceof Object && ovalue instanceof Object) {

								lychee.extendsafe(target[prop], object[prop]);

							} else if (typeof tvalue === typeof ovalue) {

								target[prop] = object[prop];

							}

						}

					}

				}

			}


			return target;

		},

		extendunlink: function(target) {

			for (var a = 1, al = arguments.length; a < al; a++) {

				var object = arguments[a];
				if (object) {

					for (var prop in object) {

						if (object.hasOwnProperty(prop) === true) {

							var tvalue = target[prop];
							var ovalue = object[prop];
							if (tvalue instanceof Array && ovalue instanceof Array) {
								target[prop] = [];
								lychee.extendunlink(target[prop], object[prop]);
							} else if (tvalue instanceof Object && ovalue instanceof Object) {
								target[prop] = {};
								lychee.extendunlink(target[prop], object[prop]);
							} else {
								target[prop] = object[prop];
							}

						}

					}

				}

			}


			return target;

		},

		interfaceof: function(template, instance) {

			var valid = false;
			var method, property;

			// 1. Interface validation on Template
			if (template instanceof Function && template.prototype instanceof Object && instance instanceof Function && instance.prototype instanceof Object) {

				valid = true;

				for (method in template.prototype) {

					if (typeof template.prototype[method] !== typeof instance.prototype[method]) {
						valid = false;
						break;
					}

				}


			// 2. Interface validation on Instance
			} else if (template instanceof Function && template.prototype instanceof Object && instance instanceof Object) {

				valid = true;

				for (method in template.prototype) {

					if (typeof template.prototype[method] !== typeof instance[method]) {
						valid = false;
						break;
					}

				}


			// 3. Interface validation on Struct
			} else if (template instanceof Object && instance instanceof Object) {

				valid = true;

				for (property in template) {

					if (template.hasOwnProperty(property) && instance.hasOwnProperty(property)) {

						if (typeof template[property] !== typeof instance[property]) {
							valid = false;
							break;
						}

					}

				}

			}


			return valid;

		},



		/*
		 * ENTITY API
		 */

		deserialize: function(data) {

			data = data instanceof Object ? data : null;


			try {
				data = JSON.parse(JSON.stringify(data));
			} catch(e) {
				data = null;
			}


			if (data !== null) {

				var instance = null;
				var scope    = (this.environment !== null ? this.environment.global : global);


				if (typeof data.reference === 'string') {

					var resolved_module = _resolve_reference.call(scope, data.reference);
					if (typeof resolved_module === 'object') {
						instance = resolved_module;
					}

				} else if (typeof data.constructor === 'string' && data.arguments instanceof Array) {

					var resolved_class = _resolve_reference.call(scope, data.constructor);
					if (typeof resolved_class === 'function') {

						var bindargs = [].splice.call(data.arguments, 0).map(function(value) {

							if (typeof value === 'string' && value.charAt(0) === '#') {

								if (lychee.debug === true) {
									console.log('lychee.deserialize: Injecting "' + value + '" from global');
								}

								var resolved = _resolve_reference.call(scope, value.substr(1));
								if (resolved !== null) {
									value = resolved;
								}

							}

							return value;

						});


						bindargs.reverse();
						bindargs.push(resolved_class);
						bindargs.reverse();


						instance = new (
							resolved_class.bind.apply(
								resolved_class,
								bindargs
							)
						)();

					}

				}


				if (instance !== null) {

					// High-Level ENTITY API
					if (typeof instance.deserialize === 'function') {

						var blob = data.blob || null;
						if (blob !== null) {
							instance.deserialize(blob);
						}

					// Low-Level ASSET API
					} else if (typeof instance.load === 'function') {
						instance.load();
					}


					return instance;

				} else {

					if (lychee.debug === true) {
						console.warn('lychee.deserialize: Require ' + (data.reference || data.constructor) + ' to deserialize it.');
					}

				}

			}


			return null;

		},

		serialize: function(definition) {

			definition = definition !== undefined ? definition : null;


			var data = null;

			if (definition !== null) {

				if (typeof definition === 'object') {

					if (typeof definition.serialize === 'function') {

						data = definition.serialize();

					} else {

						try {
							data = JSON.parse(JSON.stringify(definition));
						} catch(e) {
							data = null;
						}

					}

				} else if (typeof definition === 'function') {

					data = definition.toString();

				}

			}


			return data;

		},



		/*
		 * CUSTOM API
		 */

		define: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				_bootstrap_environment.call(this);


				var definition = new lychee.Definition(identifier);
				var that       = this;

				// XXX: First sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Second sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}


				definition.exports = function(callback) {

					lychee.Definition.prototype.exports.call(this, callback);
					that.environment.define(this);

				};


				return definition;

			}


			return null;

		},

		import: function(reference) {

			reference = typeof reference === 'string' ? reference : null;


			if (reference !== null) {

				_bootstrap_environment.call(this);


				var instance = null;
				var that     = this;

				// XXX: First sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Second sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}


				var resolved_module = _resolve_reference.call(that.environment.global, reference);
				if (resolved_module !== null) {
					instance = resolved_module;
				}


				if (instance === null) {

					if (lychee.debug === true) {
						console.warn('lychee.deserialize: Require ' + (reference) + ' to import it.');
					}

				}


				return instance;

			}


			return null;

		},

		envinit: function(environment, profile) {

			environment = environment instanceof lychee.Environment ? environment : null;
			profile     = profile instanceof Object                 ? profile     : {};


			_bootstrap_environment.call(this);


			if (environment !== null) {

				var code        = '\n';
				var id          = lychee.ROOT.project.substr(lychee.ROOT.lychee.length) + '/custom';
				var env_profile = lychee.extend({}, environment.profile, profile);


				if (environment.id.substr(0, 19) === 'lychee-Environment-') {
					environment.setId(id);
				}


				if (_environment !== null) {

					Object.values(_environment.definitions).forEach(function(definition) {
						environment.define(definition);
					});

				}


				code += '\n\n';
				code += 'if (sandbox === null) {\n';
				code += '\tconsole.error("lychee: envinit() failed.");\n';
				code += '\treturn;\n';
				code += '}\n';
				code += '\n\n';


				code += [ 'lychee' ].concat(environment.packages.map(function(pkg) {
					return pkg.id;
				})).map(function(lib) {
					return 'var ' + lib + ' = sandbox.' + lib + ';';
				}).join('\n');

				code += '\n\n';
				code += 'sandbox.MAIN = new ' + environment.build + '(' + JSON.stringify(env_profile) + ');\n';
				code += '\n\n';
				code += 'if (typeof sandbox.MAIN.init === \'function\') {\n';
				code += '\tsandbox.MAIN.init();\n';
				code += '}\n';


				lychee.setEnvironment(environment);
				environment.init(new Function('sandbox', code));

			}

		},

		pkginit: function(identifier, settings, profile) {

			identifier = typeof identifier === 'string' ? identifier : null;
			settings   = settings instanceof Object     ? settings   : {};
			profile    = profile instanceof Object      ? profile    : {};


			_bootstrap_environment.call(this);


			if (identifier !== null) {

				var config = new Config('./lychee.pkg');

				config.onload = function() {

					var buffer = this.buffer || null;
					if (buffer instanceof Object) {

						if (buffer.build instanceof Object && buffer.build.environments instanceof Object) {

							var data = buffer.build.environments[identifier] || null;
							if (data instanceof Object) {

								var code         = '\n';
								var env_settings = lychee.extend({
									id: lychee.ROOT.project + '/' + identifier.split('/').pop()
								}, data, settings);
								var env_profile  = lychee.extend({}, data.profile, profile);
								var environment  = new lychee.Environment(env_settings);


								if (_environment !== null) {

									Object.values(_environment.definitions).forEach(function(definition) {
										environment.define(definition);
									});

								}


								code += '\n\n';
								code += 'if (sandbox === null) {\n';
								code += '\tconsole.error("lychee: pkginit() failed.");\n';
								code += '\treturn;\n';
								code += '}\n';
								code += '\n\n';

								code += [ 'lychee' ].concat(env_settings.packages.map(function(pkg) {
									return pkg.id;
								})).map(function(lib) {
									return 'var ' + lib + ' = sandbox.' + lib + ';';
								}).join('\n');

								code += '\n\n';
								code += 'sandbox.MAIN = new ' + env_settings.build + '(' + JSON.stringify(env_profile) + ');\n';
								code += '\n\n';
								code += 'if (typeof sandbox.MAIN.init === \'function\') {\n';
								code += '\tsandbox.MAIN.init();\n';
								code += '}\n';


								lychee.setEnvironment(environment);
								environment.init(new Function('sandbox', code));

							}

						}

					}

				};

				config.load();

			}

		},

		inject: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			_bootstrap_environment.call(this);


			if (environment !== null) {

				if (this.environment !== null) {

					var that = this;

					Object.values(environment.definitions).forEach(function(definition) {
						that.environment.define(definition);
					});


					return true;

				} else {

					if (lychee.debug === true) {
						console.warn('lychee.inject: Set Environment to inject another into it.');
					}

				}

			}


			return false;

		},

		setEnvironment: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			if (environment !== null) {

				this.environment = environment;
				this.debug       = this.environment.debug;

				return true;

			} else {

				this.environment = _environment;
				this.debug       = this.environment.debug;

			}


			return false;

		}

	};


	return Module.extend(lychee, Module);

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Asset = typeof lychee.Asset !== 'undefined' ? lychee.Asset : (function(global) {

	var lychee  = global.lychee;
	var console = global.console;



	/*
	 * HELPERS
	 */

	var _resolve_constructor = function(type) {

		var construct = null;


		if (type === 'json')  construct = global.Config;
		if (type === 'fnt')   construct = global.Font;
		if (type === 'msc')   construct = global.Music;
		if (type === 'pkg')   construct = global.Config;
		if (type === 'png')   construct = global.Texture;
		if (type === 'snd')   construct = global.Sound;
		if (type === 'store') construct = global.Config;


		if (construct === null) {
			construct = global.Stuff || null;
		}


		return construct;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Callback = function(url, type, ignore) {

		url    = typeof url === 'string'  ? url  : null;
		type   = typeof type === 'string' ? type : null;
		ignore = ignore === true;


		var asset = null;

		if (url !== null) {

			if (type === null) {

				if (url.substr(0, 5) === 'data:') {
					type = url.split(';')[0].split('/').pop();
				} else {
					type = url.split('/').pop().split('.').pop();
				}

			}


			var construct = _resolve_constructor(type);
			if (construct !== null) {

				if (url.substr(0, 5) === 'data:') {

					asset = new construct('/tmp/Asset.' + type, ignore);
					asset.deserialize({
						buffer: url
					});

				} else {

					asset = new construct(url, ignore);

				}

			}

		}


		return asset;

	};


	return Callback;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Debugger = typeof lychee.Debugger !== 'undefined' ? lychee.Debugger : (function(global) {

	/*
	 * HELPERS
	 */

	var _client      = null;
	var _environment = null;

	var _bootstrap_environment = function() {

		if (_environment === null) {

			var currentenv = lychee.environment;
			lychee.setEnvironment(null);

			var defaultenv = lychee.environment;
			lychee.setEnvironment(currentenv);

			_environment = defaultenv;

		}

	};

	var _diff_environment = function(environment) {

		var cache1 = {};
		var cache2 = {};

		var global1 = _environment.global;
		var global2 = environment.global;

		for (var prop1 in global1) {

			if (global1[prop1] === global2[prop1]) continue;

			if (typeof global1[prop1] !== typeof global2[prop1]) {
				cache1[prop1] = global1[prop1];
			}

		}

		for (var prop2 in global2) {

			if (global2[prop2] === global1[prop2]) continue;

			if (typeof global2[prop2] !== typeof global1[prop2]) {
				cache2[prop2] = global2[prop2];
			}

		}


		var diff = lychee.extend({}, cache1, cache2);
		if (Object.keys(diff).length > 0) {
			return diff;
		}


		return null;

	};

	var _report = function(environment, data) {

		var main = environment.global.MAIN || null;
		if (main !== null) {

			var client = main.client || null;
			if (client !== null) {

				var service = client.getService('debugger');
				if (service !== null) {
					service.report('lychee.Debugger', data);
				}

			}

		}


		console.error('lychee.Debugger: Report from ' + data.file + '#L' + data.line + ' in ' + data.method + '');
		console.error('lychee.Debugger:             ' + data.definition + ' - "' + data.message + '"');

	};



	/*
	 * IMPLEMENTATION
	 */

	var Module = {

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'lychee.Debugger',
				'blob':      null
			};

		},

		expose: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : lychee.environment;


			_bootstrap_environment();


			if (environment !== null && environment !== _environment) {

				var project = environment.id;
				if (project !== null) {

					if (lychee.diff(environment.global, _environment.global) === true) {

						var diff = _diff_environment(environment);
						if (diff !== null) {
							return diff;
						}

					}

				}

			}


			return null;

		},

		report: function(environment, error, referer) {


			_bootstrap_environment();


			environment = environment instanceof lychee.Environment ? environment : null;
			error       = error instanceof Error                    ? error       : null;
			referer     = referer instanceof Object                 ? referer     : null;


			if (environment !== null && error !== null) {

				var definition = null;

				if (referer !== null) {

					if (referer instanceof Stuff) {
						definition = referer.url;
					} else if (referer instanceof lychee.Definition) {
						definition = referer.id;
					}

				}


				var data = {
					project:     environment.id,
					definition:  definition,
					environment: environment.serialize(),
					file:        null,
					line:        null,
					method:      null,
					type:        error.toString().split(':')[0],
					message:     error.message
				};


				if (typeof Error.captureStackTrace === 'function') {

					var orig = Error.prepareStackTrace;

					Error.prepareStackTrace = function(err, stack) { return stack; };
					Error.captureStackTrace(new Error());


					var stack    = [].slice.call(error.stack);
					var callsite = stack.shift();
					var FILTER   = [ 'module.js', 'vm.js', 'internal/module.js' ];


					while (callsite !== undefined && FILTER.indexOf(callsite.getFileName()) !== -1) {
						callsite = stack.shift();
					}


					if (callsite !== undefined) {

						data.file   = callsite.getFileName();
						data.line   = callsite.getLineNumber();
						data.code   = '' + (callsite.getFunction() || '').toString();
						data.method = callsite.getFunctionName() || callsite.getMethodName();

					}


					Error.prepareStackTrace = orig;

				}


				_report(environment, data);


				return true;

			}


			return false;

		}

	};


	return Module;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Definition = typeof lychee.Definition !== 'undefined' ? lychee.Definition : (function(global) {

	var lychee = global.lychee;

	var Class = function(id) {

		id = typeof id === 'string' ? id : '';


		if (id.match(/\./)) {

			var tmp = id.split('.');

			this.id        = id;
			this.classId   = tmp.slice(1).join('.');
			this.packageId = tmp[0];

		} else {

			this.id        = 'lychee.' + id;
			this.classId   = id;
			this.packageId = 'lychee';

		}


		this._attaches = {};
		this._tags     = {};
		this._requires = [];
		this._includes = [];
		this._exports  = null;
		this._supports = null;


		return this;

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.attaches instanceof Object) {

				var attachesmap = {};

				for (var aid in blob.attaches) {
					attachesmap[aid] = lychee.deserialize(blob.attaches[aid]);
				}

				this.attaches(attachesmap);

			}

			if (blob.tags instanceof Object) {
				this.tags(blob.tags);
			}

			if (blob.requires instanceof Array) {
				this.requires(blob.requires);
			}

			if (blob.includes instanceof Array) {
				this.includes(blob.includes);
			}


			var index1, index2, tmp, bindargs;

			if (typeof blob.supports === 'string') {

				// Function head
				tmp      = blob.supports.split('{')[0].trim().substr('function '.length);
				bindargs = tmp.substr(1, tmp.length - 2).split(',');

				// Function body
				index1 = blob.supports.indexOf('{') + 1;
				index2 = blob.supports.lastIndexOf('}') - 1;
				bindargs.push(blob.supports.substr(index1, index2 - index1));

				this.supports(Function.apply(Function, bindargs));

			}

			if (typeof blob.exports === 'string') {

				// Function head
				tmp      = blob.exports.split('{')[0].trim().substr('function '.length);
				bindargs = tmp.substr(1, tmp.length - 2).split(',');

				// Function body
				index1 = blob.exports.indexOf('{') + 1;
				index2 = blob.exports.lastIndexOf('}') - 1;
				bindargs.push(blob.exports.substr(index1, index2 - index1));

				this.exports(Function.apply(Function, bindargs));

			}

		},

		serialize: function() {

			var settings = {};
			var blob     = {};


			if (Object.keys(this._attaches).length > 0) {

				blob.attaches = {};

				for (var aid in this._attaches) {
					blob.attaches[aid] = lychee.serialize(this._attaches[aid]);
				}

			}

			if (Object.keys(this._tags).length > 0) {

				blob.tags = {};

				for (var tid in this._tags) {
					blob.tags[tid] = this._tags[tid];
				}

			}

			if (this._requires.length > 0)          blob.requires = this._requires.slice(0);
			if (this._includes.length > 0)          blob.includes = this._includes.slice(0);
			if (this._supports instanceof Function) blob.supports = this._supports.toString();
			if (this._exports instanceof Function)  blob.exports  = this._exports.toString();


			return {
				'constructor': 'lychee.Definition',
				'arguments':   [ this.id ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		attaches: function(map) {

			map = map instanceof Object ? map : null;


			if (map !== null) {

				for (var id in map) {

					var value = map[id];
					if (value instanceof Font || value instanceof Music || value instanceof Sound || value instanceof Texture || value !== undefined) {
						this._attaches[id] = map[id];
					}

				}

			}


			return this;

		},

		exports: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {
				this._exports = callback;
			}


			return this;

		},

		includes: function(definitions) {

			definitions = definitions instanceof Array ? definitions : null;


			if (definitions !== null) {

				for (var d = 0, dl = definitions.length; d < dl; d++) {

					var definition = definitions[d];
					if (typeof definition === 'string') {

						if (definition.indexOf('.') !== -1 && this._includes.indexOf(definition) === -1) {
							this._includes.push(definition);
						}

					}

				}

			}


			return this;

		},

		requires: function(definitions) {

			definitions = definitions instanceof Array ? definitions : null;


			if (definitions !== null) {

				for (var d = 0, dl = definitions.length; d < dl; d++) {

					var definition = definitions[d];
					if (typeof definition === 'string') {

						if (definition.indexOf('.') !== -1 && this._requires.indexOf(definition) === -1) {
							this._requires.push(definition);
						}

					}

				}

			}


			return this;

		},

		supports: function(callback) {

			callback = callback instanceof Function ? callback : null;


			if (callback !== null) {
				this._supports = callback;
			}


			return this;

		},

		tags: function(map) {

			map = map instanceof Object ? map : null;


			if (map !== null) {

				for (var id in map) {

					var value = map[id];
					if (typeof value === 'string') {
						this._tags[id] = value;
					}

				}

			}


			return this;

		}

	};


	return Class;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Environment = typeof lychee.Environment !== 'undefined' ? lychee.Environment : (function(global) {

	var lychee  = global.lychee;
	var console = global.console;



	/*
	 * EVENTS
	 */

	var _export_loop = function(cache) {

		var that  = this;
		var load  = cache.load;
		var ready = cache.ready;
		var track = cache.track;

		var identifier, definition;


		for (var l = 0, ll = load.length; l < ll; l++) {

			identifier = load[l];
			definition = this.definitions[identifier] || null;


			if (definition !== null) {

				if (ready.indexOf(identifier) === -1) {
					ready.push(identifier);
				}

				load.splice(l, 1);
				track.splice(l, 1);
				ll--;
				l--;

			}

		}


		for (var r = 0, rl = ready.length; r < rl; r++) {

			identifier = ready[r];
			definition = this.definitions[identifier] || null;

			if (definition !== null) {

				var dependencies = _resolve_definition.call(this, definition);
				if (dependencies.length > 0) {

					for (var d = 0, dl = dependencies.length; d < dl; d++) {

						var dependency = dependencies[d];
						if (load.indexOf(dependency) === -1 && ready.indexOf(dependency) === -1) {

							that.load(dependency);
							load.push(dependency);
							track.push(identifier);

						}

					}

				} else {

					_export_definition.call(this, definition);

					ready.splice(r, 1);
					rl--;
					r--;

				}

			}

		}


		if (load.length === 0 && ready.length === 0) {

			cache.active = false;

		} else {

			if (Date.now() > cache.timeout) {
				cache.active = false;
			}

		}

	};



	/*
	 * HELPERS
	 */

	var _validate_definition = function(definition) {

		if (!(definition instanceof lychee.Definition)) {
			return false;
		}


		var supported = false;

		if (definition._supports !== null) {

			// TODO: We need a Proxy for determination of all required sandboxed properties
			supported = definition._supports.call(global, lychee, global);

		} else {
			supported = true;
		}


		var tagged = true;

		if (Object.keys(definition._tags).length > 0) {

			for (var tag in definition._tags) {

				var value = definition._tags[tag];
				var tags  = this.tags[tag] || null;
				if (tags instanceof Array) {

					if (tags.indexOf(value) === -1) {

						tagged = false;
						break;

					}

				}

			}

		}


		var type = this.type;
		if (type === 'build') {

			return tagged;

		} else if (type === 'export') {

			return tagged;

		} else if (type === 'source') {

			return supported && tagged;

		}


		return false;

	};

	var _resolve_definition = function(definition) {

		var dependencies = [];


		if (definition instanceof lychee.Definition) {

			for (var i = 0, il = definition._includes.length; i < il; i++) {

				var inc      = definition._includes[i];
				var incclass = _get_class.call(this.global, inc);
				if (incclass === null) {
					dependencies.push(inc);
				}

			}

			for (var r = 0, rl = definition._requires.length; r < rl; r++) {

				var req      = definition._requires[r];
				var reqclass = _get_class.call(this.global, req);
				if (reqclass === null) {
					dependencies.push(req);
				}

			}

		}


		return dependencies;

	};

	var _export_definition = function(definition) {

		if (_get_class.call(this.global, definition.id) !== null) {
			return false;
		}


		var namespace  = _get_namespace.call(this.global, definition.id);
		var packageId  = definition.packageId;
		var classId    = definition.classId.split('.').pop();


		if (this.debug === true) {
			var info = Object.keys(definition._attaches).length > 0 ? ('(' + Object.keys(definition._attaches).length + ' Attachment(s))') : '';
			this.global.console.log('lychee-Environment (' + this.id + '): Exporting "' + definition.id + '" ' + info);
		}



		/*
		 * 1. Export Class, Module or Callback
		 */

		var template = null;
		if (definition._exports !== null) {

			if (this.debug === true) {

				try {

					// TODO: This needs to be sandboxed, so global will be this.global

					template = definition._exports.call(
						definition._exports,
						this.global.lychee,
						global,
						definition._attaches
					) || null;

				} catch(err) {
					lychee.Debugger.report(this, err, definition);
				}

			} else {

				// TODO: This needs to be sandboxed, so global will be this.global

				template = definition._exports.call(
					definition._exports,
					this.global.lychee,
					global,
					definition._attaches
				) || null;

			}

		}



		/*
		 * 2. Extend Class, Module or Callback
		 */

		if (template !== null) {

			/*
			 * 2.1 Extend and export Class or Module
			 */

			var includes = definition._includes;
			if (includes.length > 0) {


				// Cache old prototype
				var oldprototype = null;
				if (template.prototype instanceof Object) {

					oldprototype = {};

					for (var property in template.prototype) {
						oldprototype[property] = template.prototype[property];
					}

				}



				// Define classId in namespace
				Object.defineProperty(namespace, classId, {
					value:        template,
					writable:     false,
					enumerable:   true,
					configurable: false
				});


				// Create new prototype
				namespace[classId].prototype = {};


				var extendargs = [];

				extendargs.push(namespace[classId].prototype);

				for (var i = 0, il = includes.length; i < il; i++) {

					var include = _get_template.call(this.global, includes[i]);
					if (include !== null) {

						extendargs.push(include.prototype);

					} else {

						if (this.debug === true) {
							console.error('lychee-Environment (' + this.id + '): Invalid Inclusion of "' + includes[i] + '"');
						}

					}

				}


				if (oldprototype !== null) {
					extendargs.push(oldprototype);
				}


				lychee.extend.apply(lychee, extendargs);

				Object.seal(namespace[classId].prototype);


			/*
			 * 2.2 Nothing to include, plain Definition
			 */

			} else {

				namespace[classId] = template;


				if (template instanceof Object) {
					Object.seal(namespace[classId]);
				}

			}

		} else {

			namespace[classId] = function() {};

			if (this.debug === true) {
				this.global.console.error('lychee-Environment (' + this.id + '): Invalid Definition "' + definition.id + '", it is a Dummy now.');
			}

		}


		return true;

	};

	var _get_class = function(identifier) {

		var id = identifier.split('.').pop();

		var pointer = _get_namespace.call(this, identifier);
		if (pointer[id] !== undefined) {
			return pointer;
		}


		return null;

	};

	var _get_namespace = function(identifier) {

		var pointer = this;

		var ns = identifier.split('.'); ns.pop();
		for (var n = 0, l = ns.length; n < l; n++) {

			var name = ns[n];

			if (pointer[name] === undefined) {
				pointer[name] = {};
			}

			pointer = pointer[name];

		}


		return pointer;

	};

	var _get_template = function(identifier) {

		var pointer = this;

		var ns = identifier.split('.');
		for (var n = 0, l = ns.length; n < l; n++) {

			var name = ns[n];

			if (pointer[name] !== undefined) {
				pointer = pointer[name];
			} else {
				pointer = null;
				break;
			}

		}


		return pointer;

	};



	/*
	 * STRUCTS
	 */

	var _Sandbox = function(settings) {

		var that     = this;
		var _std_err = '';
		var _std_out = '';


		this.console = {};
		this.console.log = function() {

			var str = '\n';

			for (var a = 0, al = arguments.length; a < al; a++) {

				var arg = arguments[a];
				if (arg instanceof Object) {
					str += JSON.stringify(arg, null, '\t');
				} else if (typeof arg.toString === 'function') {
					str += arg.toString();
				} else {
					str += arg;
				}

				if (a < al - 1) {
					str += '\t';
				}

			}


			if (str.substr(0, 5) === '\n(E)\t') {
				_std_err += str;
			} else {
				_std_out += str;
			}

		};

		this.console.info = function() {

			var args = [ '(I)\t' ];

			for (var a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.warn = function() {

			var args = [ '(W)\t' ];

			for (var a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.error = function() {

			var args = [ '(E)\t' ];

			for (var a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.deserialize = function(blob) {

			if (typeof blob.stdout === 'string') {
				_std_out = blob.stdout;
			}

			if (typeof blob.stderr === 'string') {
				_std_err = blob.stderr;
			}

		};

		this.console.serialize = function() {

			var blob = {};


			if (_std_out.length > 0) blob.stdout = _std_out;
			if (_std_err.length > 0) blob.stderr = _std_err;


			return {
				'reference': 'console',
				'blob':      Object.keys(blob).length > 0 ? blob : null
			};

		};


		this.Buffer  = global.Buffer;
		this.Config  = global.Config;
		this.Font    = global.Font;
		this.Music   = global.Music;
		this.Sound   = global.Sound;
		this.Texture = global.Texture;


		this.lychee              = {};
		this.lychee.environment  = null;
		this.lychee.ENVIRONMENTS = global.lychee.ENVIRONMENTS;
		this.lychee.VERSION      = global.lychee.VERSION;
		this.lychee.ROOT         = {};
		this.lychee.ROOT.lychee  = global.lychee.ROOT.lychee;
		this.lychee.ROOT.project = global.lychee.ROOT.project;

		[
			'debug',
			'diff',
			'enumof',
			'extend',
			'extendsafe',
			'extendunlink',
			'interfaceof',
			'deserialize',
			'serialize',
			'define',
			'import',
			'envinit',
			'pkginit',
			'setEnvironment',
			'Asset',
			'Debugger',
			'Definition',
			'Environment',
			'Package'
		].forEach(function(identifier) {

			that.lychee[identifier] = global.lychee[identifier];

		});


		this.require = function(path) {
			return global.require(path);
		};

		this.setTimeout = function(callback, timeout) {
			global.setTimeout(callback, timeout);
		};

		this.setInterval = function(callback, interval) {
			global.setInterval(callback, interval);
		};



		/*
		 * INITIALIZATION
		 */

		if (settings instanceof Object) {

			Object.keys(settings).forEach(function(key) {

				var instance = lychee.deserialize(settings[key]);
				if (instance !== null) {
					this[key] = instance;
				}

			}.bind(this));

		}

	};

	_Sandbox.prototype = {

		deserialize: function(blob) {

			if (blob.console instanceof Object) {
				this.console.deserialize(blob.console.blob);
			}

		},

		serialize: function() {

			var settings = {};
			var blob     = {};


			Object.keys(this).filter(function(key) {
				return key.charAt(0) !== '_' && key === key.toUpperCase();
			}).forEach(function(key) {
				settings[key] = lychee.serialize(this[key]);
			}.bind(this));


			blob.lychee         = {};
			blob.lychee.debug   = this.lychee.debug;
			blob.lychee.VERSION = this.lychee.VERSION;
			blob.lychee.ROOT    = this.lychee.ROOT;


			var data = this.console.serialize();
			if (data.blob !== null) {
				blob.console = data;
			}


			return {
				'constructor': '_Sandbox',
				'arguments':   [ settings ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var _id = 0;

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.id          = 'lychee-Environment-' + _id++;
		this.build       = 'app.Main';
		this.debug       = true;
		this.definitions = {};
		this.global      = global;
		this.packages    = [];
		this.sandbox     = false;
		this.tags        = {};
		this.timeout     = 10000;
		this.type        = 'source';


		this.__cache = {
			active:   false,
			start:    0,
			end:      0,
			timeout:  0,
			load:     [],
			ready:    [],
			track:    []
		};


		// Alternative API for lychee.pkg

		if (settings.packages instanceof Array) {

			for (var p = 0, pl = settings.packages.length; p < pl; p++) {

				var pkg = settings.packages[p];
				if (pkg instanceof Array) {
					settings.packages[p] = new lychee.Package(pkg[0], pkg[1]);
				}

			}

		}


		this.setSandbox(settings.sandbox);
		this.setDebug(settings.debug);

		this.setDefinitions(settings.definitions);
		this.setId(settings.id);
		this.setPackages(settings.packages);
		this.setTags(settings.tags);
		this.setTimeout(settings.timeout);

		// Needs this.packages to be ready
		this.setType(settings.type);
		this.setBuild(settings.build);


		settings = null;

	};



	/*
	 * BOOTSTRAP API
	 */

	Class.__FILENAME = null;



	/*
	 * IMPLEMENTATION
	 */

	Class.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.definitions instanceof Object) {

				for (var id in blob.definitions) {
					this.definitions[id] = lychee.deserialize(blob.definitions[id]);
				}

			}

			if (blob.packages instanceof Array) {

				var packages = [];

				for (var p = 0, pl = blob.packages.length; p < pl; p++) {
					packages.push(lychee.deserialize(blob.packages[p]));
				}

				this.setPackages(packages);

				// This is a dirty hack which is allowed here
				this.setType(blob.type);
				this.setBuild(blob.build);

			}

			if (blob.global instanceof Object) {

				this.global = new _Sandbox(blob.global.arguments[0]);

				if (blob.global.blob !== null) {
					this.global.deserialize(blob.global.blob);
				}

			}

		},

		serialize: function() {

			var settings = {};
			var blob     = {};


			if (this.id !== '0')           settings.id      = this.id;
			if (this.build !== 'app.Main') settings.build   = this.build;
			if (this.debug !== true)       settings.debug   = this.debug;
			if (this.sandbox !== true)     settings.sandbox = this.sandbox;
			if (this.timeout !== 10000)    settings.timeout = this.timeout;
			if (this.type !== 'source')    settings.type    = this.type;


			if (Object.keys(this.tags).length > 0) {

				settings.tags = {};

				for (var tagid in this.tags) {
					settings.tags[tagid] = this.tags[tagid];
				}

			}

			if (Object.keys(this.definitions).length > 0) {

				blob.definitions = {};

				for (var defid in this.definitions) {
					blob.definitions[defid] = lychee.serialize(this.definitions[defid]);
				}

			}

			if (this.packages.length > 0) {

				blob.packages = [];

				for (var p = 0, pl = this.packages.length; p < pl; p++) {
					blob.packages.push(lychee.serialize(this.packages[p]));
				}

				// This is a dirty hack which is allowed here
				blob.type  = this.type;
				blob.build = this.build;

			}

			if (this.sandbox === true) {
				blob.global = this.global.serialize();
			}


			return {
				'constructor': 'lychee.Environment',
				'arguments':   [ settings ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},



		/*
		 * CUSTOM API
		 */

		load: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				var packageId = identifier.split('.')[0];
				var classId   = identifier.split('.').slice(1).join('.');


				var definition = this.definitions[identifier] || null;
				if (definition !== null) {

					return true;

				} else {

					var pkg = this.packages.find(function(pkg) {
						return pkg.id === packageId;
					}) || null;

					if (pkg !== null && pkg.isReady() === true) {

						var result = pkg.load(classId, this.tags);
						if (result === true) {

							if (this.debug === true) {
								this.global.console.log('lychee-Environment (' + this.id + '): Loading "' + identifier + '" from Package "' + pkg.id + '"');
							}

						}


						return result;

					}

				}

			}


			return false;

		},

		define: function(definition) {

			var filename = Class.__FILENAME || null;
			if (filename !== null) {

				if (definition instanceof lychee.Definition) {

					var oldPackageId = definition.packageId;
					var newPackageId = null;

					for (var p = 0, pl = this.packages.length; p < pl; p++) {

						var root = this.packages[p].root;
						if (filename.substr(0, root.length) === root) {
							newPackageId = this.packages[p].id;
							break;
						}

					}


					if (newPackageId !== null && newPackageId !== oldPackageId) {

						if (this.debug === true) {
							this.global.console.log('lychee-Environment (' + this.id + '): Injecting Definition "' + definition.id + '" as "' + newPackageId + '.' + definition.classId + '"');
						}


						definition.packageId = newPackageId;
						definition.id        = definition.packageId + '.' + definition.classId;

						for (var i = 0, il = definition._includes.length; i < il; i++) {

							var inc = definition._includes[i];
							if (inc.substr(0, oldPackageId.length) === oldPackageId) {
								definition._includes[i] = newPackageId + inc.substr(oldPackageId.length);
							}

						}

						for (var r = 0, rl = definition._requires.length; r < rl; r++) {

							var req = definition._requires[r];
							if (req.substr(0, oldPackageId.length) === oldPackageId) {
								definition._requires[r] = newPackageId + req.substr(oldPackageId.length);
							}

						}

					}

				}

			}


			if (_validate_definition.call(this, definition) === true) {

				if (this.debug === true) {
					var info = Object.keys(definition._tags).length > 0 ? ('(' + JSON.stringify(definition._tags) + ')') : '';
					this.global.console.log('lychee-Environment (' + this.id + '): Mapping "' + definition.id + '" ' + info);
				}

				this.definitions[definition.id] = definition;


				return true;

			} else {

				if (this.debug === true) {
					this.global.console.error('lychee-Environment (' + this.id + '): Invalid Definition "' + definition.id + '"');
				}


				return false;

			}

		},

		init: function(callback) {

			callback = callback instanceof Function ? callback : function() {};


			if (this.debug === true) {
				this.global.lychee.ENVIRONMENTS[this.id] = this;
			}


			var build = this.build;
			var cache = this.__cache;
			var type  = this.type;
			var that  = this;


			if (type === 'source' || type === 'export') {

				var lypkg = this.packages.find(function(pkg) {
					return pkg.id === 'lychee';
				}) || null;

				if (lypkg === null) {

					lypkg = new lychee.Package('lychee', '/libraries/lychee/lychee.pkg');

					if (this.debug === true) {
						this.global.console.log('lychee-Environment (' + this.id + '): Injecting Package "lychee"');
					}

					lypkg.setEnvironment(this);
					this.packages.push(lypkg);

				}

			}


			if (build !== null && cache.active === false) {

				var result = this.load(build);
				if (result === true) {

					if (this.debug === true) {
						this.global.console.log('lychee-Environment (' + this.id + '): BUILD START ("' + this.build + '")');
					}


					cache.start   = Date.now();
					cache.timeout = Date.now() + this.timeout;
					cache.load    = [ build ];
					cache.ready   = [];
					cache.active  = true;


					var onbuildtimeout = function() {

						if (this.debug === true) {
							this.global.console.log('lychee-Environment (' + this.id + '): BUILD TIMEOUT (' + (cache.end - cache.start) + 'ms)');
						}


						// XXX: Always show Dependency Errors
						this.global.console.error('lychee-Environment (' + this.id + '): Invalid Dependencies ' + cache.load.map(function(value, index) {
							return '"' + value + '" (required by ' + cache.track[index] + ')';
						}).join(', '));


						if (this.debug === true) {

							try {
								callback.call(this.global, null);
							} catch(err) {
								lychee.Debugger.report(this, err, null);
							}

						} else {

							callback.call(this.global, null);

						}

					};

					var onbuildsuccess = function() {

						if (this.debug === true) {
							this.global.console.log('lychee-Environment (' + this.id + '): BUILD END (' + (cache.end - cache.start) + 'ms)');
						}


						if (this.debug === true) {

							try {
								callback.call(this.global, this.global);
							} catch(err) {
								lychee.Debugger.report(this, err, null);
							}

						} else {

							callback.call(this.global, this.global);

						}

					};


					var intervalId = setInterval(function() {

						var cache = that.__cache;
						if (cache.active === true) {

							_export_loop.call(that, cache);

						} else if (cache.active === false) {

							if (intervalId !== null) {
								clearInterval(intervalId);
								intervalId = null;
							}


							cache.end = Date.now();


							if (cache.end > cache.timeout) {
								onbuildtimeout.call(that);
							} else {
								onbuildsuccess.call(that);
							}

						}

					}, (1000 / 60) | 0);

				} else {

					if (this.debug === true) {
						this.global.console.log('lychee-Environment (' + this.id + '): Package not ready, retrying in 100ms ...');
					}


					setTimeout(function() {
						that.init(callback);
					}, 100);

				}

			}

		},

		resolve: function(path) {

			path = typeof path === 'string' ? path : '';


			var proto = path.split(':')[0] || '';
			if (proto.match(/http|https/g) === null) {
				path = (path.charAt(0) === '/' ? (lychee.ROOT.lychee + path) : (lychee.ROOT.project + '/' + path));
			}


			var tmp = path.split('/');

			for (var t = 0, tl = tmp.length; t < tl; t++) {

				if (tmp[t] === '.') {
					tmp.splice(t, 1);
					tl--;
					t--;
				} else if (tmp[t] === '..') {
					tmp.splice(t - 1, 2);
					tl -= 2;
					t  -= 2;
				}

			}

			return tmp.join('/');

		},

		setBuild: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				var type = this.type;
				if (type === 'build') {

					this.build = identifier;

					return true;

				} else {

					var pkg = this.packages.find(function(pkg) {
						return pkg.id === identifier.split('.')[0];
					});

					if (pkg !== null) {

						this.build = identifier;

						return true;

					}

				}

			}


			return false;

		},

		setDebug: function(debug) {

			if (debug === true || debug === false) {

				this.debug = debug;

				if (this.sandbox === true) {
					this.global.lychee.debug = debug;
				}

				return true;

			}


			return false;

		},

		setDefinitions: function(definitions) {

			definitions = definitions instanceof Object ? definitions : null;


			if (definitions !== null) {

				for (var identifier in definitions) {

					var definition = definitions[identifier];
					if (definition instanceof lychee.Definition) {
						this.definitions[identifier] = definition;
					}

				}


				return true;

			}


			return false;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.id = id;


				return true;

			}


			return false;

		},

		setPackages: function(packages) {

			packages = packages instanceof Array ? packages : null;


			if (packages !== null) {

				this.packages.forEach(function(pkg) {
					pkg.setEnvironment(null);
				});

				this.packages = packages.filter(function(pkg) {

					if (pkg instanceof lychee.Package) {

						if (this.debug === true) {
							this.global.console.log('lychee-Environment (' + this.id + '): Adding Package "' + pkg.id + '"');
						}

						pkg.setEnvironment(this);

						return true;

					}


					return false;

				}.bind(this));


				return true;

			}


			return false;

		},

		setSandbox: function(sandbox) {

			if (sandbox === true || sandbox === false) {


				if (sandbox !== this.sandbox) {

					this.sandbox = sandbox;


					if (sandbox === true) {

						this.global = new _Sandbox();
						this.global.lychee.setEnvironment(this);

					} else {

						this.global = global;

					}

				}


				return true;

			}


			return false;

		},

		setTags: function(tags) {

			tags = tags instanceof Object ? tags : null;


			if (tags !== null) {

				this.tags = {};


				for (var type in tags) {

					var values = tags[type];
					if (values instanceof Array) {

						this.tags[type] = values.filter(function(value) {
							return typeof value === 'string';
						});

					}

				}


				return true;

			}


			return false;

		},

		setTimeout: function(timeout) {

			timeout = typeof timeout === 'number' ? timeout : null;


			if (timeout !== null) {

				this.timeout = timeout;

				return true;

			}


			return false;

		},

		setType: function(type) {

			if (type === 'source' || type === 'export' || type === 'build') {

				this.type = type;


				for (var p = 0, pl = this.packages.length; p < pl; p++) {
					this.packages[p].setType(this.type);
				}


				return true;

			}


			return false;

		}

	};


	return Class;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Package = typeof lychee.Package !== 'undefined' ? lychee.Package : (function(global) {

	var lychee = global.lychee;


	/*
	 * HELPERS
	 */

	var _resolve_root = function() {

		var root = this.root;
		var type = this.type;
		if (type === 'source') {
			root += '/source';
		} else if (type === 'export') {
			root += '/source';
		} else if (type === 'build') {
			root += '/build';
		}


		return root;

	};

	var _resolve_path = function(candidate) {

		var path = typeof candidate === 'string' ? candidate.split('/') : null;


		if (path !== null) {

			var type = this.type;
			if (type === 'export') {
				type = 'source';
			}


			var pointer = this.__config.buffer[type].files || null;
			if (pointer !== null) {

				for (var p = 0, pl = path.length; p < pl; p++) {

					var name = path[p];
					if (pointer[name] !== undefined) {
						pointer = pointer[name];
					} else {
						pointer = null;
						break;
					}

				}

			}


			return pointer !== null ? true : false;

		}


		return false;

	};

	var _resolve_attachments = function(candidate) {

		var attachments = {};
		var path        = candidate.split('/');
		if (path.length > 0) {

			var pointer = this.__config.buffer.source.files || null;
			if (pointer !== null) {

				for (var pa = 0, pal = path.length; pa < pal; pa++) {

					var name = path[pa];
					if (pointer[name] !== undefined) {
						pointer = pointer[name];
					} else {
						pointer = null;
						break;
					}

				}


				if (pointer !== null && pointer instanceof Array) {

					var classpath = _resolve_root.call(this) + '/' + path.join('/');

					for (var po = 0, pol = pointer.length; po < pol; po++) {

						var type = pointer[po];
						if (type !== 'js') {
							attachments[type] = classpath + '.' + type;
						}

					}

				}

			}

		}


		return attachments;

	};

	var _resolve_candidates = function(id, tags) {

		tags = tags instanceof Object ? tags : null;


		var that          = this;
		var candidatepath = id.split('.').join('/');
		var candidates    = [];
		var filter_values = function(tags, tag) {

			return tags[tag].map(function(value) {
				return _resolve_tag.call(that, tag, value) + '/' + candidatepath;
			}).filter(function(path) {
				return _resolve_path.call(that, path);
			});

		};


		if (tags !== null) {

			for (var tag in tags) {

				var values = filter_values(tags, tag);
				if (values.length > 0) {
					candidates.push.apply(candidates, values);
				}

			}

		}


		if (_resolve_path.call(this, candidatepath) === true) {
			candidates.push(candidatepath);
		}


		return candidates;

	};

	var _resolve_tag = function(tag, value) {

		tag   = typeof tag === 'string'   ? tag   : null;
		value = typeof value === 'string' ? value : null;


		if (tag !== null && value !== null) {

			var type = this.type;
			if (type === 'export') {
				type = 'source';
			}


			var pointer = this.__config.buffer[type].tags || null;
			if (pointer !== null) {

				if (pointer[tag] instanceof Object) {

					var path = pointer[tag][value] || null;
					if (path !== null) {
						return path;
					}

				}

			}

		}


		return '';

	};

	var _load_candidate = function(id, candidates) {

		if (candidates.length > 0) {

			var map = {
				id:           id,
				candidate:    null,
				candidates:   [].concat(candidates),
				attachments:  [],
				dependencies: [],
				loading:      1
			};


			this.__requests[id] = map;


			var candidate = map.candidates.shift();

			while (candidate !== undefined) {

				if (this.__blacklist[candidate] === 1) {
					candidate = map.candidates.shift();
				} else {
					break;
				}

			}


			// Try to load the first suggested Candidate Implementation
			if (candidate !== undefined) {

				var url            = _resolve_root.call(this) + '/' + candidate + '.js';
				var implementation = new lychee.Asset(url, null, false);
				var attachments    = _resolve_attachments.call(this, candidate);

				if (implementation !== null) {
					_load_candidate_implementation.call(this, candidate, implementation, attachments, map);
				}

			}

		}

	};

	var _load_candidate_implementation = function(candidate, implementation, attachments, map) {

		var that       = this;
		var identifier = this.id + '.' + map.id;


		implementation.onload = function(result) {

			map.loading--;


			if (result === true) {

				var environment = that.environment;
				var definition  = environment.definitions[identifier] || null;
				if (definition !== null) {

					map.candidate = this;


					var attachmentIds = Object.keys(attachments);


					// Temporary delete definition from environment and re-define it after attachments are all loaded
					if (attachmentIds.length > 0) {

						delete environment.definitions[identifier];

						map.loading += attachmentIds.length;


						attachmentIds.forEach(function(assetId) {

							var url   = attachments[assetId];
							var asset = new lychee.Asset(url);
							if (asset !== null) {

								asset.onload = function(result) {

									map.loading--;

									var tmp = {};
									if (result === true) {
										tmp[assetId] = this;
									} else {
										tmp[assetId] = null;
									}

									definition.attaches(tmp);


									if (map.loading === 0) {
										environment.definitions[identifier] = definition;
									}

								};

								asset.load();

							} else {

								map.loading--;

							}

						});

					}


					for (var i = 0, il = definition._includes.length; i < il; i++) {
						environment.load(definition._includes[i]);
					}

					for (var r = 0, rl = definition._requires.length; r < rl; r++) {
						environment.load(definition._requires[r]);
					}


					return true;

				}

			}



			// If code runs through here, candidate was invalid
			delete that.environment.definitions[identifier];
			that.__blacklist[candidate] = 1;

			// Load next candidate, if any available
			if (map.candidates.length > 0) {
				_load_candidate.call(that, map.id, map.candidates);
			}

		};

		implementation.load();

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(id, url) {

		id  = typeof id === 'string'  ? id  : 'app';
		url = typeof url === 'string' ? url : null;


		// This is public to allow loading packages
		// as external renamespaced libraries

		this.id   = id;
		this.url  = null;
		this.root = null;

		this.environment = null;
		this.type        = 'source';

		this.__blacklist = {};
		this.__config    = null;
		this.__requests  = {};


		if (url !== null) {

			var that = this;
			var tmp  = url.split('/');

			var file = tmp.pop();
			if (file === 'lychee.pkg') {

				this.root = tmp.join('/');
				this.url  = url;

				this.__config = new Config(this.url);
				this.__config.onload = function(result) {

					if (that.isReady() === false) {
						result = false;
					}


					if (result === true) {

						if (lychee.debug === true) {
							console.info('lychee.Package-' + that.id + ': Package at ' + this.url + ' ready');
						}

					} else {

						if (lychee.debug === true) {
							console.error('lychee.Package-' + that.id + ': Package at ' + this.url + ' corrupt');
						}

					}

				};
				this.__config.load();

			}

		}

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'constructor': 'lychee.Package',
				'arguments':   [ this.id, this.url ]
			};

		},



		/*
		 * CUSTOM API
		 */

		isReady: function() {

			var ready  = false;
			var config = this.__config;

			if (config !== null && config.buffer !== null) {

				if (config.buffer.source instanceof Object && config.buffer.build instanceof Object) {
					ready = true;
				}

			}


			return ready;

		},

		load: function(id, tags) {

			id   = typeof id === 'string' ? id   : null;
			tags = tags instanceof Object ? tags : null;


			if (id !== null && this.isReady() === true) {

				var request = this.__requests[id] || null;
				if (request === null) {

					var candidates = _resolve_candidates.call(this, id, tags);
					if (candidates.length > 0) {

						_load_candidate.call(this, id, candidates);

						return true;

					} else {

						if (lychee.debug === true) {
							var info = Object.keys(tags).length > 0 ? ('(' + JSON.stringify(tags) + ')') : '';
							console.error('lychee.Package-' + this.id + ': Invalid Definition "' + id + '" ' + info);
						}

						return false;

					}

				} else {

					return true;

				}

			}


			return false;

		},

		setEnvironment: function(environment) {

			environment = environment instanceof lychee.Environment ? environment : null;


			if (environment !== null) {

				this.environment = environment;

				return true;

			}


			return false;

		},

		setType: function(type) {

			type = typeof type === 'string' ? type : null;


			if (type !== null) {

				if (type === 'source' || type === 'export' || type === 'build') {

					this.type = type;

					return true;

				}

			}


			return false;

		}

	};


	return Class;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


(function(lychee, global) {

	var _fs       = require('fs');
	var _filename = null;



	/*
	 * FEATURE DETECTION
	 */

	(function(process, selfpath) {

		var cwd  = typeof process.cwd === 'function' ? process.cwd() : '';
		var tmp1 = selfpath.indexOf('/libraries/lychee');

		if (tmp1 !== -1) {
			lychee.ROOT.lychee = selfpath.substr(0, tmp1);
		}


		var tmp2 = selfpath.split('/').slice(0, 3).join('/');
		if (tmp2.substr(0, 13) === '/opt/lycheejs') {
			lychee.ROOT.lychee = tmp2;
		}


		if (cwd !== '') {
			lychee.ROOT.project = cwd;
		}

	})(global.process || {}, typeof __filename === 'string' ? __filename : '');



	/*
	 * HELPERS
	 */

	var _load_asset = function(settings, callback, scope) {

		var path     = lychee.environment.resolve(settings.url);
		var encoding = settings.encoding === 'binary' ? 'binary': 'utf8';


		_fs.readFile(path, encoding, function(error, buffer) {

			var raw = null;
			if (!error) {
				raw = buffer;
			}

			try {
				callback.call(scope, raw);
			} catch(err) {
				lychee.Debugger.report(lychee.environment, err, null);
			}

		});

	};



	/*
	 * POLYFILLS
	 */

	var _log   = console.log   || function() {};
	var _info  = console.info  || console.log;
	var _warn  = console.warn  || console.log;
	var _error = console.error || console.log;


	console.log = function() {

		var al   = arguments.length;
		var args = new Array(al);
		for (var a = 0; a < al; a++) {
			args[a] = arguments[a];
		}

		args.reverse();
		args.push(' ');
		args.reverse();
		args.push(' ');

		_log.apply(console, args);

	};

	console.info = function() {

		var al   = arguments.length;
		var args = new Array(al);
		for (var a = 0; a < al; a++) {
			args[a] = arguments[a];
		}

		args.reverse();
		args.push('\u001b[37m');
		args.push('\u001b[42m');
		args.reverse();
		args.push('\u001b[49m');
		args.push('\u001b[39m');

		_info.apply(console, args);

	};

	console.warn = function() {

		var al   = arguments.length;
		var args = new Array(al);
		for (var a = 0; a < al; a++) {
			args[a] = arguments[a];
		}

		args.reverse();
		args.push('\u001b[37m');
		args.push('\u001b[43m');
		args.reverse();
		args.push('\u001b[49m');
		args.push('\u001b[39m');

		_warn.apply(console, args);

	};

	console.error = function() {

		var al   = arguments.length;
		var args = new Array(al);
		for (var a = 0; a < al; a++) {
			args[a] = arguments[a];
		}

		args.reverse();
		args.push('\u001b[37m');
		args.push('\u001b[41m');
		args.reverse();
		args.push('\u001b[49m');
		args.push('\u001b[39m');

		_error.apply(console, args);

	};



	var _META_KEYCODE     = /^(?:\x1b)([a-zA-Z0-9])$/;
	var _FUNCTION_KEYCODE = /^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/;

	var _parse_keypress   = function(str) {

		var parts;


		if (Buffer.isBuffer(str)) {

			if (str[0] > 127 && str[1] === undefined) {
				str[0] -= 128;
				str = '\x1b' + str.toString('utf8');
			} else {
				str = str.toString('utf8');
			}

		}


		var key = {
			name:     null,
			ctrl:     false,
			meta:     false,
			shift:    false
		};


		// Return
		if (str === '\r' || str === '\n') {

			key.name = 'return';

		// Tab
		} else if (str === '\t') {

			key.name = 'tab';

		// Backspace or Ctrl + H
		} else if (str === '\b' || str === '\x7f' || str === '\x1b\b' || str === '\x1b\x7f') {

			key.name = 'backspace';
			key.meta = (str.charAt(0) === '\x1b');

		// Escape
		} else if (str === '\x1b' || str === '\x1b\x1b') {

			key.name = 'escape';
			key.meta = (str.length === 2);

		// Space
		} else if (str === ' ' || str === '\x1b ') {

			key.name = 'space';
			key.meta = (str.length === 2);

		// Ctrl + Letter
		} else if (str <= '\x1a') {

			key.name = String.fromCharCode(str.charCodeAt(0) + 'a'.charCodeAt(0) - 1);
			key.ctrl = true;

		// Letter
		} else if (str.length === 1 && str >= 'a' && str <= 'z') {

			key.name = str;

		// Shift + Letter
		} else if (str.length === 1 && str >= 'A' && str <= 'Z') {

			// was: key.name = str.toLowerCase();
			key.name = str;
			key.shift = true;

		// Meta + Letter
		} else if ((parts = _META_KEYCODE.exec(str))) {

			key.name = parts[1].toLowerCase();
			key.meta = true;
			key.shift = /^[A-Z]$/.test(parts[1]);

		// Function Key (ANSI ESCAPE SEQUENCE)
		} else if ((parts = _FUNCTION_KEYCODE.exec(str))) {

			var code = (parts[1] || '') + (parts[2] || '') + (parts[4] || '') + (parts[6] || '');
			var mod  = (parts[3] || parts[5] || 1) - 1;

			key.ctrl = !!(mod & 4);
			key.meta = !!(mod & 10);
			key.shift = !!(mod & 1);


			// Parse the key itself
			switch (code) {

				/* xterm ESC O letter */
				case 'OP':   key.name = 'f1'; break;
				case 'OQ':   key.name = 'f2'; break;
				case 'OR':   key.name = 'f3'; break;
				case 'OS':   key.name = 'f4'; break;

				/* xterm ESC [ number ~ */
				case '[11~': key.name = 'f1'; break;
				case '[12~': key.name = 'f2'; break;
				case '[13~': key.name = 'f3'; break;
				case '[14~': key.name = 'f4'; break;

				/* Cygwin/libuv */
				case '[[A':  key.name = 'f1'; break;
				case '[[B':  key.name = 'f2'; break;
				case '[[C':  key.name = 'f3'; break;
				case '[[D':  key.name = 'f4'; break;
				case '[[E':  key.name = 'f5'; break;

				/* common */
				case '[15~': key.name = 'f5';  break;
				case '[17~': key.name = 'f6';  break;
				case '[18~': key.name = 'f7';  break;
				case '[19~': key.name = 'f8';  break;
				case '[20~': key.name = 'f9';  break;
				case '[21~': key.name = 'f10'; break;
				case '[23~': key.name = 'f11'; break;
				case '[24~': key.name = 'f12'; break;

				/* xterm ESC [ letter */
				case '[A':   key.name = 'up';    break;
				case '[B':   key.name = 'down';  break;
				case '[C':   key.name = 'right'; break;
				case '[D':   key.name = 'left';  break;
				case '[E':   key.name = 'clear'; break;
				case '[F':   key.name = 'end';   break;
				case '[H':   key.name = 'home';  break;

				/* xterm ESC O letter */
				case 'OA':   key.name = 'up';    break;
				case 'OB':   key.name = 'down';  break;
				case 'OC':   key.name = 'right'; break;
				case 'OD':   key.name = 'left';  break;
				case 'OE':   key.name = 'clear'; break;
				case 'OF':   key.name = 'end';   break;
				case 'OH':   key.name = 'home';  break;

				/* xterm ESC [ number ~ */
				case '[1~':  key.name = 'home';     break;
				case '[2~':  key.name = 'insert';   break;
				case '[3~':  key.name = 'delete';   break;
				case '[4~':  key.name = 'end';      break;
				case '[5~':  key.name = 'pageup';   break;
				case '[6~':  key.name = 'pagedown'; break;

				/* Putty */
				case '[[5~': key.name = 'pageup';   break;
				case '[[6~': key.name = 'pagedown'; break;

				/* misc. */
				case '[Z':   key.name = 'tab'; key.shift = true; break;
				default:     key.name = null;                    break;

			}

		}


		if (key.name !== null) {
			return key;
		}


		return null;

	};



	/*
	 * FEATURE DETECTION
	 */

	var _codecs = {
		aac: true,
		ogg: true,
		mp3: true
	};

	(function() {

		var consol  = 'console' in global;
		var audio   = false;
		var buffer  = true;
		var image   = false;


		if (lychee.debug === true) {

			var methods = [];

			if (consol)  methods.push('console');
			if (audio)   methods.push('Audio');
			if (buffer)  methods.push('Buffer');
			if (image)   methods.push('Image');

			if (methods.length === 0) {
				console.error('bootstrap.js: Supported methods are NONE');
			} else {
				console.info('bootstrap.js: Supported methods are ' + methods.join(', '));
			}

		}

	})();



	/*
	 * BUFFER IMPLEMENTATION
	 */

	Buffer.prototype.serialize = function() {

		return {
			'constructor': 'Buffer',
			'arguments':   [ this.toString('base64'), 'base64' ]
		};

	};

	Buffer.prototype.map = function(callback) {

		callback = callback instanceof Function ? callback : function(value) { return value; };


		var clone = new Buffer(this.length);

		for (var b = 0; b < this.length; b++) {
			clone[b] = callback(this[b], b);
		}

		return clone;

	};




	/*
	 * CONFIG IMPLEMENTATION
	 */

	var _config_cache = {};


	var _clone_config = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer = JSON.parse(JSON.stringify(origin.buffer));

			clone.__load = false;

		}

	};


	var Config = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url    = url;
		this.onload = null;
		this.buffer = null;

		this.__load = true;


		if (url !== null) {

			if (_config_cache[url] !== undefined) {
				_clone_config(_config_cache[url], this);
			} else {
				_config_cache[url] = this;
			}

		}

	};


	Config.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {
				this.buffer = JSON.parse(new Buffer(blob.buffer.substr(29), 'base64').toString('utf8'));
				this.__load = false;
			}

		},

		serialize: function() {

			var blob = {};


			if (this.buffer !== null) {
				blob.buffer = 'data:application/json;base64,' + new Buffer(JSON.stringify(this.buffer), 'utf8').toString('base64');
			}


			return {
				'constructor': 'Config',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			_load_asset({
				url:      this.url,
				encoding: 'utf8'
			}, function(raw) {

				var data = null;
				try {
					data = JSON.parse(raw);
				} catch(e) {
				}


				this.buffer = data;


				if (data !== null) {

				} else {

					if (lychee.debug === true) {
						console.error('bootstrap.js: Config at ' + this.url + ' is invalid (No JSON file)');
					}

				}


				if (this.onload instanceof Function) {
					this.onload(data !== null);
					this.onload = null;
				}

			}, this);

		}

	};



	/*
	 * FONT IMPLEMENTATION
	 */

	var _parse_font = function() {

		var data = this.__buffer;

		if (typeof data.kerning === 'number' && typeof data.spacing === 'number') {

			if (data.kerning > data.spacing) {
				data.kerning = data.spacing;
			}

		}


		if (data.texture !== undefined) {

			var texture = new Texture(data.texture);
			var that    = this;

			texture.onload = function() {
				that.texture = this;
			};

			texture.load();

		} else {

			if (lychee.debug === true) {
				console.error('bootstrap.js: Font at "' + this.url + '" is invalid (No FNT file)');
			}

		}


		this.baseline   = typeof data.baseline === 'number'    ? data.baseline   : this.baseline;
		this.charset    = typeof data.charset === 'string'     ? data.charset    : this.charset;
		this.spacing    = typeof data.spacing === 'number'     ? data.spacing    : this.spacing;
		this.kerning    = typeof data.kerning === 'number'     ? data.kerning    : this.kerning;
		this.lineheight = typeof data.lineheight === 'number'  ? data.lineheight : this.lineheight;


		if (data.map instanceof Array) {

			var offset = this.spacing;

			for (var c = 0, cl = this.charset.length; c < cl; c++) {

				var id = this.charset[c];

				var chr = {
					width:      data.map[c] + this.spacing * 2,
					height:     this.lineheight,
					realwidth:  data.map[c],
					realheight: this.lineheight,
					x:          offset - this.spacing,
					y:          0
				};

				offset += chr.width;


				this.__charset[id] = chr;

			}

		}

	};


	var _font_cache = {};


	var _clone_font = function(origin, clone) {

		if (origin.__buffer !== null) {

			clone.__buffer = origin.__buffer;
			clone.__load   = false;

			_parse_font.call(clone);

		}

	};


	var Font = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url        = url;
		this.onload     = null;
		this.texture    = null;

		this.baseline   = 0;
		this.charset    = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
		this.spacing    = 0;
		this.kerning    = 0;
		this.lineheight = 1;

		this.__buffer   = null;
		this.__load     = true;

		this.__charset     = {};
		this.__charset[''] = {
			width:      0,
			height:     this.lineheight,
			realwidth:  0,
			realheight: this.lineheight,
			x:          0,
			y:          0
		};


		if (url !== null) {

			if (_font_cache[url] !== undefined) {
				_clone_font(_font_cache[url], this);
			} else {
				_font_cache[url] = this;
			}

		}

	};


	Font.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {
				this.__buffer = JSON.parse(new Buffer(blob.buffer.substr(29), 'base64').toString('utf8'));
				this.__load   = false;
				_parse_font.call(this);
			}

		},

		serialize: function() {

			var blob = {};


			if (this.__buffer !== null) {
				blob.buffer = 'data:application/json;base64,' + new Buffer(JSON.stringify(this.__buffer), 'utf8').toString('base64');
			}


			return {
				'constructor': 'Font',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		measure: function(text) {

			text = typeof text === 'string' ? text : null;


			if (text !== null) {

				if (text.length === 1) {

					if (this.__charset[text] !== undefined) {
						return this.__charset[text];
					}

				} else if (text.length > 1) {

					var data = this.__charset[text] || null;
					if (data === null) {

						var width = 0;

						for (var t = 0, tl = text.length; t < tl; t++) {
							var chr = this.measure(text[t]);
							width  += chr.realwidth + this.kerning;
						}


						// TODO: Embedded Font ligatures will set x and y values based on settings.map

						data = this.__charset[text] = {
							width:      width,
							height:     this.lineheight,
							realwidth:  width,
							realheight: this.lineheight,
							x:          0,
							y:          0
						};

					}


					return data;

				}

			}


			return this.__charset[''];

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			_load_asset({
				url:      this.url,
				encoding: 'utf8'
			}, function(raw) {

				var data = null;
				try {
					data = JSON.parse(raw);
				} catch(e) {
				}


				if (data !== null) {

					this.__buffer = data;
					this.__load   = false;

					_parse_font.call(this);

				}


				if (this.onload instanceof Function) {
					this.onload(data !== null);
					this.onload = null;
				}

			}, this);

		}

	};



	/*
	 * MUSIC IMPLEMENTATION
	 */

	var _music_cache = {};


	var _clone_music = function(origin, clone) {

		if (origin.__buffer.ogg !== null || origin.__buffer.mp3 !== null) {

			clone.__buffer.ogg = origin.__buffer.ogg;
			clone.__buffer.mp3 = origin.__buffer.mp3;
			clone.__load       = false;

		}

	};


	var Music = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;
		this.volume   = 0.0;
		this.isIdle   = true;

		this.__buffer = { ogg: null, mp3: null };
		this.__load   = true;


		if (url !== null) {

			if (_music_cache[url] !== undefined) {
				_clone_music(_music_cache[url], this);
			} else {
				_music_cache[url] = this;
			}

		}

	};


	Music.prototype = {

		deserialize: function(blob) {

			if (blob.buffer instanceof Object) {

				if (typeof blob.buffer.ogg === 'string') {
					this.__buffer.ogg = new Buffer(blob.buffer.substr(28), 'base64');
				}

				if (typeof blob.buffer.mp3 === 'string') {
					this.__buffer.mp3 = new Buffer(blob.buffer.substr(22), 'base64');
				}


				this.__load = false;

			}

		},

		serialize: function() {

			var blob = {};


			if (this.__buffer.ogg !== null || this.__buffer.mp3 !== null) {

				blob.buffer = {};

				if (this.__buffer.ogg !== null) {
					blob.buffer.ogg = 'data:application/ogg;base64,' + new Buffer(this.__buffer.ogg, 'binary').toString('base64');
				}

				if (this.__buffer.mp3 !== null) {
					blob.buffer.mp3 = 'data:audio/mp3;base64,' + new Buffer(this.__buffer.mp3, 'binary').toString('base64');
				}

			}


			return {
				'constructor': 'Music',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			_load_asset({
				url:      this.url + '.ogg',
				encoding: 'binary'
			}, function(rawogg) {

				_load_asset({
					url:      this.url + '.mp3',
					encoding: 'binary'
				}, function(rawmp3) {

					if (rawogg !== null) {
						this.__buffer.ogg = new Buffer(rawogg, 'binary');
					}

					if (rawmp3 !== null) {
						this.__buffer.mp3 = new Buffer(rawmp3, 'binary');
					}


					this.__load = false;


					if (this.onload instanceof Function) {
						this.onload(rawogg !== null || rawmp3 !== null);
						this.onload = null;
					}

				}, this);

			}, this);

		},

		clone: function() {
			return new Music(this.url);
		},

		play: function() {
			this.isIdle = false;
		},

		pause: function() {
			this.isIdle = true;
		},

		resume: function() {
			this.isIdle = false;
		},

		stop: function() {
			this.isIdle = true;
		},

		setVolume: function(volume) {

			volume = typeof volume === 'number' ? volume : null;


			return false;

		}

	};



	/*
	 * SOUND IMPLEMENTATION
	 */

	var _sound_cache = {};


	var _clone_sound = function(origin, clone) {

		if (origin.__buffer.ogg !== null || origin.__buffer.mp3 !== null) {

			clone.__buffer.ogg = origin.__buffer.ogg;
			clone.__buffer.mp3 = origin.__buffer.mp3;
			clone.__load       = false;

		}

	};


	var Sound = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;
		this.volume   = 0.0;
		this.isIdle   = true;

		this.__buffer = { ogg: null, mp3: null };
		this.__load   = true;


		if (url !== null) {

			if (_sound_cache[url] !== undefined) {
				_clone_sound(_sound_cache[url], this);
			} else {
				_sound_cache[url] = this;
			}

		}

	};


	Sound.prototype = {

		deserialize: function(blob) {

			if (blob.buffer instanceof Object) {

				if (typeof blob.buffer.ogg === 'string') {
					this.__buffer.ogg = new Buffer(blob.buffer.substr(28), 'base64');
				}

				if (typeof blob.buffer.mp3 === 'string') {
					this.__buffer.mp3 = new Buffer(blob.buffer.substr(22), 'base64');
				}


				this.__load = false;

			}

		},

		serialize: function() {

			var blob = {};


			if (this.__buffer.ogg !== null || this.__buffer.mp3 !== null) {

				blob.buffer = {};

				if (this.__buffer.ogg !== null) {
					blob.buffer.ogg = 'data:application/ogg;base64,' + new Buffer(this.__buffer.ogg, 'binary').toString('base64');
				}

				if (this.__buffer.mp3 !== null) {
					blob.buffer.mp3 = 'data:audio/mp3;base64,' + new Buffer(this.__buffer.mp3, 'binary').toString('base64');
				}

			}


			return {
				'constructor': 'Sound',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			_load_asset({
				url:      this.url + '.ogg',
				encoding: 'binary'
			}, function(rawogg) {

				_load_asset({
					url:      this.url + '.mp3',
					encoding: 'binary'
				}, function(rawmp3) {

					if (rawogg !== null) {
						this.__buffer.ogg = new Buffer(rawogg, 'binary');
					}

					if (rawmp3 !== null) {
						this.__buffer.mp3 = new Buffer(rawmp3, 'binary');
					}


					this.__load = false;


					if (this.onload instanceof Function) {
						this.onload(rawogg !== null || rawmp3 !== null);
						this.onload = null;
					}

				}, this);

			}, this);

		},

		clone: function() {
			return new Sound(this.url);
		},

		play: function() {
			this.isIdle = false;
		},

		pause: function() {
			this.isIdle = true;
		},

		resume: function() {
			this.isIdle = false;
		},

		stop: function() {
			this.isIdle = true;
		},

		setVolume: function(volume) {

			volume = typeof volume === 'number' ? volume : null;


			return false;

		}

	};



	/*
	 * TEXTURE IMPLEMENTATION
	 */

	var _texture_id    = 0;
	var _texture_cache = {};

	var _parse_texture = function(data) {

		this.width  = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3];
		this.height = (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7];

	};


	var _clone_texture = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.id     = origin.id;

			clone.buffer = origin.buffer;
			clone.width  = origin.width;
			clone.height = origin.height;

			clone.__load = false;

		}

	};


	var Texture = function(url) {

		url = typeof url === 'string' ? url : null;


		this.id     = _texture_id++;
		this.url    = url;
		this.onload = null;
		this.buffer = null;
		this.width  = 0;
		this.height = 0;

		this.__load = true;


		if (url !== null && url.substr(0, 10) !== 'data:image') {

			if (_texture_cache[url] !== undefined) {
				_clone_texture(_texture_cache[url], this);
			} else {
				_texture_cache[url] = this;
			}

		}

	};


	Texture.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {
				this.buffer = new Buffer(blob.buffer.substr(22), 'base64');
				this.__load = false;
			}

		},

		serialize: function() {

			var blob = {};


			if (this.buffer !== null) {
				blob.buffer = 'data:image/png;base64,' + this.buffer.toString('base64');
			}


			return {
				'constructor': 'Texture',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				if (this.onload instanceof Function) {
					this.onload(true);
					this.onload = null;
				}

				return;

			}


			var url = this.url;
			if (url.substr(0, 5) === 'data:') {

				if (url.substr(0, 15) === 'data:image/png;') {

					var b64data = url.substr(15, url.length - 15);
					this.buffer = new Buffer(b64data, 'base64');
					this.__load = false;

					_parse_texture.call(this, this.buffer.slice(16, 24));


					var is_power_of_two = (this.width & (this.width - 1)) === 0 && (this.height & (this.height - 1)) === 0;
					if (lychee.debug === true && is_power_of_two === false) {
						console.warn('bootstrap.js: Texture at data:image/png; is NOT power-of-two');
					}

				} else {

					if (lychee.debug === true) {
						console.error('bootstrap.js: Texture at "' + url.substr(0, 15) + '" is invalid (no PNG file)');
					}

				}


				if (this.onload instanceof Function) {
					this.onload(this.buffer !== null);
					this.onload = null;
				}

			} else {

				if (url.split('.').pop() === 'png') {

					_load_asset({
						url:      url,
						encoding: 'binary'
					}, function(raw) {

						if (raw !== null) {

							this.buffer = new Buffer(raw, 'binary');
							this.__load = false;

							_parse_texture.call(this, this.buffer.slice(16, 24));

						}


  						var is_power_of_two = (this.width & (this.width - 1)) === 0 && (this.height & (this.height - 1)) === 0;
						if (lychee.debug === true && is_power_of_two === false) {
							console.warn('bootstrap.js: Texture at ' + this.url + ' is NOT power-of-two');
						}


						if (this.onload instanceof Function) {
							this.onload(raw !== null);
							this.onload = null;
						}

					}, this);

				} else {

					if (lychee.debug === true) {
						console.error('bootstrap.js: Texture at "' + this.url + '" is invalid (no PNG file)');
					}


					if (this.onload instanceof Function) {
						this.onload(false);
						this.onload = null;
					}

				}

			}

		}

	};



	/*
	 * PRELOADER IMPLEMENTATION
	 */

	var _stuff_cache = {};


	var _clone_stuff = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer = origin.buffer;

			clone.__load = false;

		}

	};

	var _execute_stuff = function(callback, stuff) {

		var type = stuff.url.split('/').pop().split('.').pop();
		if (type === 'js' && stuff.__ignore === false) {

			_filename = stuff.url;

			var cid = lychee.environment.resolve(stuff.url);
			if (require.cache[cid] !== undefined) {
				delete require.cache[cid];
			}


			try {
				require(cid);
			} catch(err) {
				lychee.Debugger.report(lychee.environment, err, stuff);
			}


			_filename = null;


			callback.call(stuff, true);

		} else {

			callback.call(stuff, true);

		}

	};


	var Stuff = function(url, ignore) {

		url    = typeof url === 'string' ? url : null;
		ignore = ignore === true;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;

		this.__ignore = ignore;
		this.__load   = true;


		if (url !== null) {

			if (_stuff_cache[url] !== undefined) {
				_clone_stuff(_stuff_cache[url], this);
			} else {
				_stuff_cache[url] = this;
			}

		}

	};


	Stuff.prototype = {

		deserialize: function(blob) {

			if (typeof blob.buffer === 'string') {
				this.buffer = new Buffer(blob.buffer.substr(blob.buffer.indexOf(',') + 1), 'base64').toString('utf8');
				this.__load = false;
			}

		},

		serialize: function() {

			var blob = {};
			var type = this.url.split('/').pop().split('.').pop();
			var mime = 'application/octet-stream';


			if (type === 'js') {
				mime = 'application/javascript';
			}


			if (this.buffer !== null) {
				blob.buffer = 'data:' + mime + ';base64,' + new Buffer(this.buffer, 'utf8').toString('base64');
			}


			return {
				'constructor': 'Stuff',
				'arguments':   [ this.url ],
				'blob':        Object.keys(blob).length > 0 ? blob : null
			};

		},

		load: function() {

			if (this.__load === false) {

				_execute_stuff(function(result) {

					if (this.onload instanceof Function) {
						this.onload(result);
						this.onload = null;
					}

				}, this);


				return;

			}


			_load_asset({
				url:      this.url,
				encoding: 'utf8'
			}, function(raw) {

				if (raw !== null) {
					this.buffer = raw.toString('utf8');
				} else {
					this.buffer = '';
				}


				_execute_stuff(function(result) {

					if (this.onload instanceof Function) {
						this.onload(result);
						this.onload = null;
					}

				}, this);

			}, this);

		}

	};



	/*
	 * EXPORTS
	 */

	// global.Buffer  = Buffer; // Not necessary, IOJS data type
	global.Config  = Config;
	global.Font    = Font;
	global.Music   = Music;
	global.Sound   = Sound;
	global.Texture = Texture;
	global.Stuff   = Stuff;


	global.require = require;

	Object.defineProperty(lychee.Environment, '__FILENAME', {

		get: function() {

			if (_filename !== null) {
				return _filename;
			}

			return null;

		},

		set: function() {
			return false;
		}

	});



	module.exports = function(root) {

		var stream      = process.stdin;
		var is_emitting = stream._emitsKeypress === true;
		if (is_emitting === false) {

			// Note: This fixes issues with running IOJS with nohup
			if (stream.isTTY === true) {

				stream._emitsKeypress = true;

				stream.setEncoding('utf8');
				stream.setRawMode(true);
				stream.resume();

				stream.on('data', function(data) {

					if (this.listeners('keypress').length > 0) {

						var key = _parse_keypress(data);
						if (key !== null) {
							this.emit('keypress', key);
						}

					}

				});

			}

		}


		if (typeof root === 'string') {
			lychee.ROOT.project = root;
		}


		return lychee;

	};

})(lychee, global);


lychee.define('Input').tags({
	platform: 'node'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof process !== 'undefined') {

		if (typeof process.stdin === 'object' && typeof process.stdin.on === 'function') {
			return true;
		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	/*
	 * EVENTS
	 */

	var _instances = [];

	var _listeners = {

		keyboard: function(key) {

			// This is apparently a hack to have a TTY conform behaviour
			if (key.ctrl === true && key.name === 'c') {

				key.name  = 'escape';
				key.ctrl  = false;
				key.alt   = false;
				key.shift = false;

			}


			for (var i = 0, l = _instances.length; i < l; i++) {
				_process_key.call(_instances[i], key.name, key.ctrl, key.meta, key.shift);
			}

		}

	};



	/*
	 * FEATURE DETECTION
	 */

	(function() {

		process.stdin.on('keypress', _listeners.keyboard);


		if (lychee.debug === true) {
			console.info('lychee.Input: Supported methods are Keyboard');
		}

	})();



	/*
	 * HELPERS
	 */

	// TODO: Modifier support is missing, I have no idea how to work around the TTY behaviour.

	var _process_key = function(key, ctrl, alt, shift) {

		if (this.key === false) return false;


		// 2. Only fire after the enforced delay
		var delta = Date.now() - this.__clock.key;
		if (delta < this.delay) {
			return;
		}


		// 3. Check for current key being a modifier
		if (this.keymodifier === false) {

			if (key === 'ctrl' || key === 'meta' || key === 'shift') {
				return true;
			}

		}


		var name = '';

		if (ctrl  === true) name += 'ctrl-';
		if (alt   === true) name += 'alt-';
		if (shift === true) name += 'shift-';

		name += key.toLowerCase();



		var handled = false;

		if (key !== null) {

			// allow bind('key') and bind('ctrl-a');

			handled = this.trigger('key', [ key, name, delta ]) || handled;
			handled = this.trigger(name,  [ delta ])            || handled;

		}


		this.__clock.key = Date.now();


		return handled;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.delay       = 0;
		this.key         = false;
		this.keymodifier = false;
		this.touch       = false;
		this.swipe       = false;

		this.__clock  = {
			key:   Date.now(),
			touch: Date.now(),
			swipe: Date.now()
		};


		this.setDelay(settings.delay);
		this.setKey(settings.key);
		this.setKeyModifier(settings.keymodifier);
		this.setTouch(settings.touch);
		this.setSwipe(settings.swipe);


		lychee.event.Emitter.call(this);

		_instances.push(this);

		settings = null;

	};


	Class.prototype = {

		destroy: function() {

			var found = false;

			for (var i = 0, il = _instances.length; i < il; i++) {

				if (_instances[i] === this) {
					_instances.splice(i, 1);
					found = true;
					il--;
					i--;
				}

			}

			this.unbind();


			return found;

		},



		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.Input';

			var settings = {};


			if (this.delay !== 0)           settings.delay       = this.delay;
			if (this.key !== false)         settings.key         = this.key;
			if (this.keymodifier !== false) settings.keymodifier = this.keymodifier;
			if (this.touch !== false)       settings.touch       = this.touch;
			if (this.swipe !== false)       settings.swipe       = this.swipe;


			data['arguments'][0] = settings;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setDelay: function(delay) {

			delay = typeof delay === 'number' ? delay : null;


			if (delay !== null) {

				this.delay = delay;

				return true;

			}


			return false;

		},

		setKey: function(key) {

			if (key === true || key === false) {

				this.key = key;

				return true;

			}


			return false;

		},

		setKeyModifier: function(keymodifier) {

			if (keymodifier === true || keymodifier === false) {

				this.keymodifier = keymodifier;

				return true;

			}


			return false;

		},

		setTouch: function(touch) {

			if (touch === true || touch === false) {
				return false;
			}

			return false;

		},

		setSwipe: function(swipe) {

			if (swipe === true || swipe === false) {
				return false;
			}

			return false;

		}

	};


	return Class;

});


lychee.define('Renderer').tags({
	platform: 'node'
}).supports(function(lychee, global) {

	if (typeof process !== 'undefined') {

		if (typeof process.stdout === 'object') {
			return true;
		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	var _color_cache = {};

	var _is_color = function(color) {

		if (typeof color === 'string') {

			if (color.match(/(#[AaBbCcDdEeFf0-9]{6})/) || color.match(/(#[AaBbCcDdEeFf0-9]{8})/)) {
				return true;
			}

		}


		return false;

	};

	var _hex_to_rgba = function(hex) {

		if (_color_cache[hex] !== undefined) {
			return _color_cache[hex];
		}

		var rgba = [ 0, 0, 0, 255 ];

		if (typeof hex === 'string') {

			if (hex.length === 7) {

				rgba[0] = parseInt(hex[1] + hex[2], 16);
				rgba[1] = parseInt(hex[3] + hex[4], 16);
				rgba[2] = parseInt(hex[5] + hex[6], 16);
				rgba[3] = 255;

			} else if (hex.length === 9) {

 				rgba[0] = parseInt(hex[1] + hex[2], 16);
				rgba[1] = parseInt(hex[3] + hex[4], 16);
				rgba[2] = parseInt(hex[5] + hex[6], 16);
				rgba[3] = parseInt(hex[7] + hex[8], 16);

			}

		}


		var color = 'rgba(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ',' + (rgba[3] / 255) + ')';

		_color_cache[hex] = color;


		return color;

	};

	var _draw_ctx = function(x, y, value) {

		var max_x = (this[0] || '').length;
		var max_y = (this    || '').length;

		if (x >= 0 && x < max_x && y >= 0 && y < max_y) {
			this[y][x] = value;
		}

	};



	/*
	 * STRUCTS
	 */

	var _buffer = function(width, height) {

		this.width  = typeof width === 'number'  ? width  : 1;
		this.height = typeof height === 'number' ? height : 1;


		this.__ctx = [];


		this.resize(this.width, this.height);

	};

	_buffer.prototype = {

		clear: function() {

			var ctx    = this.__ctx;
			var width  = this.width;
			var height = this.height;

			for (var y = 0; y < this.height; y++) {

				for (var x = 0; x < this.width; x++) {
					this.__ctx[y][x] = ' ';
				}

			}

		},

		resize: function(width, height) {

			this.width  = width;
			this.height = height;


			this.__ctx = [];


			for (var y = 0; y < this.height; y++) {

				var line = new Array(this.width);
				for (var x = 0; x < this.width; x++) {
					line[x] = ' ';
				}

				this.__ctx.push(line);

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	var _id = 0;

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.alpha      = 1.0;
		this.background = '#000000';
		this.id         = 'lychee-Renderer-' + _id++;
		this.width      = null;
		this.height     = null;
		this.offset     = { x: 0, y: 0 };


		this.__buffer = this.createBuffer(0, 0);
		this.__ctx    = this.__buffer.__ctx;


		this.setAlpha(settings.alpha);
		this.setBackground(settings.background);
		this.setId(settings.id);
		this.setWidth(settings.width);
		this.setHeight(settings.height);


		settings = null;

	};


	Class.prototype = {

		destroy: function() {

		},



		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var settings = {};


			if (this.alpha !== 1.0)                           settings.alpha      = this.alpha;
			if (this.background !== '#000000')                settings.background = this.background;
			if (this.id.substr(0, 16) !== 'lychee-Renderer-') settings.id         = this.id;
			if (this.width !== null)                          settings.width      = this.width;
			if (this.height !== null)                         settings.height     = this.height;


			return {
				'constructor': 'lychee.Renderer',
				'arguments':   [ settings ],
				'blob':        null
			};

		},



		/*
		 * SETTERS AND GETTERS
		 */

		setAlpha: function(alpha) {

			alpha = typeof alpha === 'number' ? alpha : null;


			if (alpha !== null) {

				if (alpha >= 0 && alpha <= 1) {
					this.alpha = alpha;
				}

			}

		},

		setBackground: function(color) {

			color = _is_color(color) === true ? color : null;


			if (color !== null) {
				this.background = color;
			}

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {
				this.id = id;
			}

		},

		setWidth: function(width) {

			width = typeof width === 'number' ? width : null;


			if (width !== null) {
				this.width = width;
			} else {
				this.width = process.stdout.columns - 1;
			}


			this.__buffer.resize(this.width, this.height);
			this.__ctx = this.__buffer.__ctx;
			this.offset.x = 0;

		},

		setHeight: function(height) {

			height = typeof height === 'number' ? height : null;


			if (height !== null) {
				this.height = height;
			} else {
				this.height = process.stdout.rows - 1;
			}


			this.__buffer.resize(this.width, this.height);
			this.__ctx = this.__buffer.__ctx;
			this.offset.y = 0;

		},



		/*
		 * BUFFER INTEGRATION
		 */

		clear: function(buffer) {

			buffer = buffer instanceof _buffer ? buffer : null;


			if (buffer !== null) {

				buffer.clear();

			} else {

				process.stdout.write('\u001B[2J\u001B[0;0f');

				this.__buffer.clear();

			}

		},

		flush: function() {

			var ctx = this.__ctx;

			var line = ctx[0] || '';
			var info = this.width + 'x' + this.height;

			for (var i = 0; i < info.length; i++) {
				line[i] = info[i];
			}

			for (var y = 0; y < this.height; y++) {
				process.stdout.write(ctx[y].join('') + '\n');
			}

		},

		createBuffer: function(width, height) {
			return new _buffer(width, height);
		},

		setBuffer: function(buffer) {

			buffer = buffer instanceof _buffer ? buffer : null;


			if (buffer !== null) {
				this.__ctx = buffer.__ctx;
			} else {
				this.__ctx = this.__buffer.__ctx;
			}

		},



		/*
		 * DRAWING API
		 */

		drawArc: function(x, y, start, end, radius, color, background, lineWidth) {

			color      = _is_color(color) === true ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;
			var pi2 = Math.PI * 2;


			// TODO: Implement arc-drawing ASCII art algorithm

		},

		drawBox: function(x1, y1, x2, y2, color, background, lineWidth) {

			if (this.alpha < 0.5) return;

			x1 = x1 | 0;
			y1 = y1 | 0;
			x2 = x2 | 0;
			y2 = y2 | 0;

			color      = _is_color(color) === true ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;
			var x = 0;
			var y = 0;


			if (background === true) {

				for (x = x1 + 1; x < x2; x++) {

					for (y = y1 + 1; y < y2; y++) {
						_draw_ctx.call(ctx, x, y, '+');
					}

				}

			}


			// top - right - bottom - left

			y = y1;
			for (x = x1 + 1; x < x2; x++) _draw_ctx.call(ctx, x, y, '-');

			x = x2;
			for (y = y1 + 1; y < y2; y++) _draw_ctx.call(ctx, x, y, '|');

			y = y2;
			for (x = x1 + 1; x < x2; x++) _draw_ctx.call(ctx, x, y, '-');

			x = x1;
			for (y = y1 + 1; y < y2; y++) _draw_ctx.call(ctx, x, y, '|');

		},

		drawBuffer: function(x1, y1, buffer) {

			buffer = buffer instanceof _buffer ? buffer : null;


			if (buffer !== null) {

				var ctx = this.__ctx;


				var x2 = Math.min(x1 + buffer.width,  this.__buffer.width);
				var y2 = Math.min(y1 + buffer.height, this.__buffer.height);


				for (var y = y1; y < y2; y++) {

					for (var x = x1; x < x2; x++) {
						this.__ctx[y][x] = buffer.__ctx[y - y1][x - x1];
					}

				}

			}

		},

		drawCircle: function(x, y, radius, color, background, lineWidth) {

			color      = _is_color(color) === true ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			// TODO: Implement circle-drawing ASCII art algorithm

		},

		drawLight: function(x, y, radius, color, background, lineWidth) {

			color      = _is_color(color) ? _hex_to_rgba(color) : 'rgba(255,255,255,1.0)';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			// TODO: Implement light-drawing ASCII art algorithm

		},

		drawLine: function(x1, y1, x2, y2, color, lineWidth) {

			color     = _is_color(color) === true ? color : '#000000';
			lineWidth = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			// TODO: Implement line-drawing ASCII art algorithm

		},

		drawTriangle: function(x1, y1, x2, y2, x3, y3, color, background, lineWidth) {

			color      = _is_color(color) === true ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			var ctx = this.__ctx;


			// TODO: Implement triangle-drawing ASCII art algorithm

		},

		// points, x1, y1, [ ... x(a), y(a) ... ], [ color, background, lineWidth ]
		drawPolygon: function(points, x1, y1) {

			var l = arguments.length;

			if (points > 3) {

				var optargs = l - (points * 2) - 1;


				var color, background, lineWidth;

				if (optargs === 3) {

					color      = arguments[l - 3];
					background = arguments[l - 2];
					lineWidth  = arguments[l - 1];

				} else if (optargs === 2) {

					color      = arguments[l - 2];
					background = arguments[l - 1];

				} else if (optargs === 1) {

					color      = arguments[l - 1];

				}


				color      = _is_color(color) === true ? color : '#000000';
				background = background === true;
				lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


				var ctx = this.__ctx;


				// TODO: Implement polygon-drawing ASCII art algorithm

			}

		},

		drawSprite: function(x1, y1, texture, map) {

			texture = texture instanceof Texture ? texture : null;
			map     = map instanceof Object      ? map     : null;


			if (texture !== null) {

				if (map === null) {

				} else {

				}

			}

		},

		drawText: function(x1, y1, text, font, center) {

			font   = font instanceof Font ? font : null;
			center = center === true;


			if (font !== null) {

				if (center === true) {

					var dim = font.measure(text);

					x1 -= dim.realwidth / 2;
					y1 -= (dim.realheight - font.baseline) / 2;

				}


				y1 -= font.baseline / 2;


				x1 = x1 | 0;
				y1 = y1 | 0;


				var ctx = this.__ctx;

				var margin  = 0;
				var texture = font.texture;
				if (texture !== null && texture.buffer !== null) {

					for (var t = 0, l = text.length; t < l; t++) {

						var chr = font.measure(text[t]);

						var x = x1 + margin - font.spacing;
						var y = y1;


						_draw_ctx.call(ctx, x, y, text[t]);


						margin += chr.realwidth + font.kerning;

					}

				}

			}

		}

	};


	return Class;

});


lychee.define('Stash').tags({
	platform: 'node'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	var fs = require('fs');
	if (typeof fs.unlinkSync === 'function' && typeof fs.writeFileSync === 'function') {
		return true;
	}

	return false;

}).exports(function(lychee, global, attachments) {

	var _PERSISTENT = {
		data: {},
		read: function() {
			return null;
		},
		write: function(id, asset) {
			return false;
		}
	};
	var _TEMPORARY  = {
		data: {},
		read: function() {

			if (Object.keys(this.data).length > 0) {
				return this.data;
			}


			return null;

		},
		write: function(id, asset) {

			if (asset !== null) {
				this.data[id] = asset;
			} else {
				delete this.data[id];
			}

			return true;

		}
	};



	/*
	 * FEATURE DETECTION
	 */

	(function() {

		var _ENCODING = {
			'Config':  'utf8',
			'Font':    'utf8',
			'Music':   'binary',
			'Sound':   'binary',
			'Texture': 'binary',
			'Stuff':   'utf8'
		};


		var _fs      = require('fs');
		var _path    = require('path');
		var _mkdir_p = function(path, mode) {

			if (mode === undefined) {
				mode = 0777 & (~process.umask());
			}


			var is_directory = false;

			try {

				is_directory = _fs.lstatSync(path).isDirectory();

			} catch(err) {

				if (err.code === 'ENOENT') {

					if (_mkdir_p(_path.dirname(path), mode) === true) {
						_fs.mkdirSync(path, mode);
					}

					try {
						is_directory = _fs.lstatSync(path).isDirectory();
					} catch(err) {
					}

				}

			} finally {

				return is_directory;

			}

		};


		var unlink = 'unlinkSync' in _fs;
		var write  = 'writeFileSync' in _fs;
		if (write === true && unlink === true) {

			_PERSISTENT.write = function(id, asset) {

				var result = false;


				var path = lychee.environment.resolve(id);
				if (path.substr(0, lychee.ROOT.project.length) === lychee.ROOT.project) {

					if (asset !== null) {

						var dir = path.split('/').slice(0, -1).join('/');
						if (dir.substr(0, lychee.ROOT.project.length) === lychee.ROOT.project) {
							_mkdir_p(dir);
						}


						var data = lychee.serialize(asset);
						if (data !== null && data.blob !== null && typeof data.blob.buffer === 'string') {

							var encoding = _ENCODING[data.constructor] || _ENCODING['Stuff'];
							var index    = data.blob.buffer.indexOf('base64,') + 7;
							if (index > 7) {

								var buffer = new Buffer(data.blob.buffer.substr(index, data.blob.buffer.length - index), 'base64');

								try {
									_fs.writeFileSync(path, buffer, encoding);
									result = true;
								} catch(e) {
									result = false;
								}

							}

						}

					} else {

						try {
							_fs.unlinkSync(path);
							result = true;
						} catch(e) {
							result = false;
						}

					}

				}


				return result;

			};

		}


		if (lychee.debug === true) {

			var methods = [];

			if (write && unlink) methods.push('Persistent');
			if (_TEMPORARY)      methods.push('Temporary');


			if (methods.length === 0) {
				console.error('lychee.Stash: Supported methods are NONE');
			} else {
				console.info('lychee.Stash: Supported methods are ' + methods.join(', '));
			}

		}

	})();



	/*
	 * HELPERS
	 */

	var _is_asset = function(asset) {

		if (asset instanceof Object && typeof asset.serialize === 'function') {
			return true;
		}

		return false;

	};

	var _on_batch_remove = function(stash, others) {

		var keys = Object.keys(others);

		for (var k = 0, kl = keys.length; k < kl; k++) {

			var key   = keys[k];
			var index = this.load.indexOf(key);
			if (index !== -1) {

				if (this.ready.indexOf(key) === -1) {
					this.ready.push(null);
					this.load.splice(index, 1);
				}

			}

		}


		if (this.load.length === 0) {
			stash.trigger('batch', [ 'remove', this.ready ]);
			stash.unbind('sync', _on_batch_remove);
		}

	};

	var _on_batch_write = function(stash, others) {

		var keys = Object.keys(others);

		for (var k = 0, kl = keys.length; k < kl; k++) {

			var key   = keys[k];
			var index = this.load.indexOf(key);
			if (index !== -1) {

				if (this.ready.indexOf(key) === -1) {
					this.ready.push(others[key]);
					this.load.splice(index, 1);
				}

			}

		}


		if (this.load.length === 0) {
			stash.trigger('batch', [ 'write', this.ready ]);
			stash.unbind('sync', _on_batch_write);
		}

	};

	var _read_stash = function(silent) {

		silent = silent === true;


		var blob = null;


		var type = this.type;
		if (type === Class.TYPE.persistent) {

			blob = _PERSISTENT.read();

		} else if (type === Class.TYPE.temporary) {

			blob = _TEMPORARY.read();

		}


		if (blob !== null) {

			if (Object.keys(this.__assets).length !== Object.keys(blob).length) {

				this.__assets = {};

				for (var id in blob) {
					this.__assets[id] = blob[id];
				}


				if (silent === false) {
					this.trigger('sync', [ this.__assets ]);
				}

			}


			return true;

		}


		return false;

	};

	var _write_stash = function(silent) {

		silent = silent === true;


		var operations = this.__operations;
		var filtered   = {};

		if (operations.length !== 0) {

			while (operations.length > 0) {

				var operation = operations.shift();
				if (operation.type === 'update') {

					filtered[operation.id] = operation.asset;

					if (this.__assets[operation.id] !== operation.asset) {
						this.__assets[operation.id] = operation.asset;
					}

				} else if (operation.type === 'remove') {

					filtered[operation.id] = null;

					if (this.__assets[operation.id] !== null) {
						this.__assets[operation.id] = null;
					}

				}

			}


			var type = this.type;
			if (type === Class.TYPE.persistent) {

				for (var id in filtered) {
					_PERSISTENT.write(id, filtered[id]);
				}

			} else if (type === Class.TYPE.temporary) {

				for (var id in filtered) {
					_TEMPORARY.write(id, filtered[id]);
				}

			}


			if (silent === false) {
				this.trigger('sync', [ this.__assets ]);
			}


			return true;

		}


		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	var _id = 0;

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.id   = 'lychee-Stash-' + _id++;
		this.type = Class.TYPE.persistent;


		this.__assets     = {};
		this.__operations = [];


		this.setId(settings.id);
		this.setType(settings.type);


		lychee.event.Emitter.call(this);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		_read_stash.call(this);

	};


	Class.TYPE = {
		persistent: 0,
		temporary:  1
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		sync: function(silent) {

			silent = silent === true;


			var result = false;


			if (Object.keys(this.__assets).length > 0) {

				this.__operations.push({
					type: 'sync'
				});

			}


			if (this.__operations.length > 0) {
				result = _write_stash.call(this, silent);
			} else {
				result = _read_stash.call(this, silent);
			}


			return result;

		},

		deserialize: function(blob) {

			if (blob.assets instanceof Object) {

				this.__assets = {};

				for (var id in blob.assets) {
					this.__assets[id] = lychee.deserialize(blob.assets[id]);
				}

			}

		},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.Stash';

			var settings = {};
			var blob     = (data['blob'] || {});


			if (this.id.substr(0, 13) !== 'lychee-Stash-') settings.id   = this.id;
			if (this.type !== Class.TYPE.persistent)       settings.type = this.type;


			if (Object.keys(this.__assets).length > 0) {

				blob.assets = {};

				for (var id in this.__assets) {
					blob.assets[id] = lychee.serialize(this.__assets[id]);
				}

			}


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		batch: function(action, ids, assets) {

			action = typeof action === 'string' ? action : null;
			ids    = ids instanceof Array       ? ids    : null;
			assets = assets instanceof Array    ? assets : null;


			if (action !== null) {

				var cache  = {
					load:  [].slice.call(ids),
					ready: []
				};


				var result = true;
				var that   = this;
				var i      = 0;
				var il     = ids.length;

				if (action === 'read') {

					for (i = 0; i < il; i++) {

						var asset = this.read(ids[i]);
						if (asset !== null) {

							asset.onload = function(result) {

								var index = cache.load.indexOf(this.url);
								if (index !== -1) {
									cache.ready.push(this);
									cache.load.splice(index, 1);
								}

								if (cache.load.length === 0) {
									that.trigger('batch', [ 'read', cache.ready ]);
								}

							};

							asset.load();

						} else {

							result = false;

						}

					}


					return result;

				} else if (action === 'remove') {

					this.bind('#sync', _on_batch_remove, cache);

					for (i = 0; i < il; i++) {

						if (this.remove(ids[i]) === false) {
							result = false;
						}

					}

					if (result === false) {
						this.unbind('sync', _on_batch_remove);
					}


					return result;

				} else if (action === 'write' && ids.length === assets.length) {

					this.bind('#sync', _on_batch_write, cache);

					for (i = 0; i < il; i++) {

						if (this.write(ids[i], assets[i]) === false) {
							result = false;
						}

					}

					if (result === false) {
						this.unbind('sync', _on_batch_write);
					}


					return result;

				}

			}


			return false;

		},

		read: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				var asset = new lychee.Asset(id, null, true);
				if (asset !== null) {

					this.__assets[id] = asset;

					return asset;

				}

			}


			return null;

		},

		remove: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.__operations.push({
					type: 'remove',
					id:   id
				});


				_write_stash.call(this);


				return true;

			}


			return false;

		},

		write: function(id, asset) {

			id    = typeof id === 'string'    ? id    : null;
			asset = _is_asset(asset) === true ? asset : null;


			if (id !== null && asset !== null) {

				this.__operations.push({
					type:  'update',
					id:    id,
					asset: asset
				});


				_write_stash.call(this);


				return true;

			}


			return false;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.id = id;

				return true;

			}


			return false;

		},

		setType: function(type) {

			type = lychee.enumof(Class.TYPE, type) ? type : null;


			if (type !== null) {

				this.type = type;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('Storage').tags({
	platform: 'node'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	var fs = require('fs');
	if (typeof fs.readFileSync === 'function' && typeof fs.writeFileSync === 'function') {
		return true;
	}

	return false;

}).exports(function(lychee, global, attachments) {

	var _JSON       = {
		encode: JSON.stringify,
		decode: JSON.parse
	};
	var _PERSISTENT = {};
	var _TEMPORARY  = {};



	/*
	 * FEATURE DETECTION
	 */

	var _read_persistent  = function() { return false; };
	var _write_persistent = function() { return false; };

	(function() {

		var _fs = require('fs');


		var read = 'readFileSync' in _fs;
		if (read === true) {

			_read_persistent = function() {

				var url = lychee.environment.resolve('./lychee.store');


				var raw = null;
				try {
					raw = _fs.readFileSync(url, 'utf8');
				} catch(e) {
					raw = null;
				}


				var buffer = null;
				try {
					buffer = JSON.parse(raw);
				} catch(e) {
					buffer = null;
				}


				if (buffer !== null) {

					for (var id in buffer) {
						_PERSISTENT[id] = buffer[id];
					}


					return true;

				}


				return false;

			};

		}


		var write = 'writeFileSync' in _fs;
		if (write === true) {

			_write_persistent = function() {

				var buffer = _JSON.encode(_PERSISTENT);
				var url    = lychee.environment.resolve('./lychee.store');


				var result = false;
				try {
					result = _fs.writeFileSync(url, buffer, 'utf8');
				} catch(e) {
					result = false;
				}


				return result;

			};

		}


		if (lychee.debug === true) {

			var methods = [];

			if (read && write) methods.push('Persistent');
			if (_TEMPORARY)    methods.push('Temporary');

			if (methods.length === 0) {
				console.error('lychee.Storage: Supported methods are NONE');
			} else {
				console.info('lychee.Storage: Supported methods are ' + methods.join(', '));
			}

		}


		_read_persistent();

	})();



	/*
	 * HELPERS
	 */

	var _read_storage = function(silent) {

		silent = silent === true;


		var id   = this.id;
		var blob = null;


		var type = this.type;
		if (type === Class.TYPE.persistent) {
			blob = _PERSISTENT[id] || null;
		} else if (type === Class.TYPE.temporary) {
			blob = _TEMPORARY[id]  || null;
		}


		if (blob !== null) {

			if (this.model === null) {

				if (blob['@model'] instanceof Object) {
					this.model = blob['@model'];
				}

			}


			if (Object.keys(this.__objects).length !== Object.keys(blob['@objects']).length) {

				if (blob['@objects'] instanceof Object) {

					this.__objects = {};

					for (var o in blob['@objects']) {
						this.__objects[o] = blob['@objects'][o];
					}


					if (silent === false) {
						this.trigger('sync', [ this.__objects ]);
					}


					return true;

				}

			}

		}


		return false;

	};

	var _write_storage = function(silent) {

		silent = silent === true;


		var operations = this.__operations;
		if (operations.length > 0) {

			while (operations.length > 0) {

				var operation = operations.shift();
				if (operation.type === 'update') {

					if (this.__objects[operation.id] !== operation.object) {
						this.__objects[operation.id] = operation.object;
					}

				} else if (operation.type === 'remove') {

					if (this.__objects[operation.id] !== undefined) {
						delete this.__objects[operation.id];
					}

				}

			}


			var id   = this.id;
			var blob = {
				'@model':   this.model,
				'@objects': this.__objects
			};


			var type = this.type;
			if (type === Class.TYPE.persistent) {

				_PERSISTENT[id] = blob;
				_write_persistent();

			} else if (type === Class.TYPE.temporary) {

				_TEMPORARY[id] = blob;

			}


			if (silent === false) {
				this.trigger('sync', [ this.__objects ]);
			}


			return true;

		}


		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	var _id = 0;

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.id    = 'lychee-Storage-' + _id++;
		this.model = {};
		this.type  = Class.TYPE.persistent;


		this.__objects    = {};
		this.__operations = [];


		this.setId(settings.id);
		this.setModel(settings.model);
		this.setType(settings.type);


		lychee.event.Emitter.call(this);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		_read_storage.call(this);

	};


	Class.TYPE = {
		persistent: 0,
		temporary:  1
	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		sync: function(silent) {

			silent = silent === true;


			var result = false;


			if (this.__operations.length > 0) {
				result = _write_storage.call(this, silent);
			} else {
				result = _read_storage.call(this, silent);
			}


			return result;

		},

		deserialize: function(blob) {

			if (blob.objects instanceof Object) {

				this.__objects = {};

				for (var o in blob.objects) {

					var object = blob.objects[o];

					if (lychee.interfaceof(this.model, object) === true) {
						this.__objects[o] = object;
					}

				}

			}

		},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.Storage';

			var settings = {};
			var blob     = (data['blob'] || {});


			if (this.id.substr(0, 15) !== 'lychee-Storage-') settings.id    = this.id;
			if (Object.keys(this.model).length !== 0)        settings.model = this.model;
			if (this.type !== Class.TYPE.persistent)         settings.type  = this.type;


			if (Object.keys(this.__objects).length > 0) {

				blob.objects = {};

				for (var o in this.__objects) {

					var object = this.__objects[o];
					if (object instanceof Object) {
						blob.objects[o] = _JSON.decode(_JSON.encode(object));
					}

				}

			}


			data['arguments'][0] = settings;
			data['blob']         = Object.keys(blob).length > 0 ? blob : null;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		create: function() {
			return lychee.extendunlink({}, this.model);
		},

		filter: function(callback, scope) {

			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;


			var filtered = [];


			if (callback !== null) {

				for (var o in this.__objects) {

					var object = this.__objects[o];

					if (callback.call(scope, object, o) === true) {
						filtered.push(object);
					}

				}


			}


			return filtered;

		},

		read: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				var object = this.__objects[id] || null;
				if (object !== null) {
					return object;
				}

			}


			return null;

		},

		remove: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				var object = this.__objects[id] || null;
				if (object !== null) {

					this.__operations.push({
						type:   'remove',
						id:     id,
						object: object
					});


					_write_storage.call(this);

					return true;

				}

			}


			return false;

		},

		write: function(id, object) {

			id     = typeof id === 'string'                    ? id     : null;
			object = lychee.diff(this.model, object) === false ? object : null;


			if (id !== null && object !== null) {

				this.__operations.push({
					type:   'update',
					id:     id,
					object: object
				});


				_write_storage.call(this);

				return true;

			}


			return false;

		},

		setId: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				this.id = id;

				return true;

			}


			return false;

		},

		setModel: function(model) {

			model = model instanceof Object ? model : null;


			if (model !== null) {

				this.model = _JSON.decode(_JSON.encode(model));

				return true;

			}


			return false;

		},

		setType: function(type) {

			type = lychee.enumof(Class.TYPE, type) ? type : null;


			if (type !== null) {

				this.type = type;

				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('Viewport').tags({
	platform: 'node'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof process !== 'undefined') {

		if (typeof process.stdout === 'object' && typeof process.stdout.on === 'function') {
			return true;
		}

	}

	return false;

}).exports(function(lychee, global, attachments) {

	/*
	 * EVENTS
	 */

	var _instances = [];

	var _listeners = {

		resize: function() {

			for (var i = 0, l = _instances.length; i < l; i++) {
				_process_reshape.call(_instances[i], process.stdout.columns, process.stdout.rows);
			}

		}

	};



	/*
	 * FEATURE DETECTION
	 */

	(function() {

		var resize = true;
		if (resize === true) {
			process.stdout.on('resize', _listeners.resize);
		}


		if (lychee.debug === true) {

			var methods = [];

			if (resize) methods.push('Resize');

			if (methods.length === 0) {
				console.error('lychee.Viewport: Supported methods are NONE');
			} else {
				console.info('lychee.Viewport: Supported methods are ' + methods.join(', '));
			}

		}

	})();



	/*
	 * HELPERS
	 */

	var _process_reshape = function(width, height) {

		if (width === this.width && height === this.height) {
			return false;
		}


		this.width  = width;
		this.height = height;



		var orientation = null;
		var rotation    = null;

		if (width > height) {

			orientation = 'landscape';
			rotation    = 'landscape';

		} else {

			orientation = 'landscape';
			rotation    = 'landscape';

		}


		return this.trigger('reshape', [ orientation, rotation, width, height ]);

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.fullscreen = false;
		this.width      = process.stdout.columns;
		this.height     = process.stdout.rows;

		this.__orientation = 0; // Unsupported


		lychee.event.Emitter.call(this);

		_instances.push(this);


		this.setFullscreen(settings.fullscreen);



		/*
		 * INITIALIZATION
		 */

		setTimeout(function() {

			this.width  = 0;
			this.height = 0;

			_process_reshape.call(this, process.stdout.columns, process.stdout.rows);

		}.bind(this), 100);


		settings = null;

	};


	Class.prototype = {

		destroy: function() {

			var found = false;

			for (var i = 0, il = _instances.length; i < il; i++) {

				if (_instances[i] === this) {
					_instances.splice(i, 1);
					found = true;
					il--;
					i--;
				}

			}

			this.unbind();


			return found;

		},



		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.Viewport';

			var settings = {};


			if (this.fullscreen !== false) settings.fullscreen = this.fullscreen;


			data['arguments'][0] = settings;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setFullscreen: function(fullscreen) {
			return false;
		}

	};


	return Class;

});


lychee.define('lychee.net.Client').tags({
	platform: 'node'
}).requires([
	'lychee.net.protocol.HTTP',
	'lychee.net.protocol.WS',
	'lychee.net.client.Debugger',
	'lychee.net.client.Stash',
	'lychee.net.client.Storage'
]).includes([
	'lychee.net.Tunnel'
]).supports(function(lychee, global) {

	try {

		require('http');
		require('crypto');

		return true;

	} catch(e) {
	}


	return false;

}).exports(function(lychee, global, attachments) {

	var http   = require('http');
	var crypto = require('crypto');



	/*
	 * HELPERS
	 */

	var _get_websocket_nonce = function() {

		var buffer = new Buffer(16);
		for (var b = 0; b < 16; b++) {
			buffer[b] = Math.round(Math.random() * 0xff);
		}

		return buffer.toString('base64');

	};

	var _upgrade_to_websocket = function(response, socket, head) {

		var connection = (response.headers.connection || '').toLowerCase();
		var upgrade    = (response.headers.upgrade    || '').toLowerCase();
		var protocol   = (response.headers['sec-websocket-protocol'] || '').toLowerCase();

		if (connection === 'upgrade' && upgrade === 'websocket' && protocol === 'lycheejs') {

			var accept   = (response.headers['sec-websocket-accept'] || '');
			var expected = (function(nonce) {

				var sha1 = crypto.createHash('sha1');
				sha1.update(nonce + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
				return sha1.digest('base64');

			})(this.__nonce);


			if (accept === expected) {

				socket.setTimeout(0);
				socket.setNoDelay(true);
				socket.setKeepAlive(true, 0);
				socket.removeAllListeners('timeout');

				return true;

			}

		}


		socket.end();
		socket.destroy();

		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.__nonce       = null;
		this.__socket      = null;
		this.__isConnected = false;


		lychee.net.Tunnel.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		if (lychee.debug === true) {

			this.bind('connect', function() {
				this.addService(new lychee.net.client.Debugger(this));
			}, this);

		}


		this.bind('connect', function() {

			this.__isConnected = true;

			this.addService(new lychee.net.client.Stash(this));
			this.addService(new lychee.net.client.Storage(this));

		}, this);

		this.bind('disconnect', function() {
			this.__isConnected = false;
		}, this);

		this.bind('send', function(blob) {

			if (this.__socket !== null) {
				this.__socket.send(blob);
			}

		}, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.net.Tunnel.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.Client';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		connect: function() {

			if (this.__isConnected === false) {

				var that = this;


				this.__nonce = _get_websocket_nonce();

				var request  = http.request({
					hostname: this.host,
					port:     this.port,
					method:   'GET',
					headers:  {
						'Upgrade':                'websocket',
						'Connection':             'Upgrade',
						'Origin':                 'ws://' + this.host + ':' + this.port,
						'Host':                   this.host + ':' + this.port,
						'Sec-WebSocket-Key':      this.__nonce,
						'Sec-WebSocket-Version':  '13',
						'Sec-WebSocket-Protocol': 'lycheejs'
					}
				});


				request.on('upgrade', function(response, socket, head) {

					if (_upgrade_to_websocket.call(that, response, socket, head) === true) {

						that.__socket = new lychee.net.protocol.WS(socket, lychee.net.protocol.WS.TYPE.client);

						that.__socket.ondata = function(blob) {
							that.receive(blob);
						};

						that.__socket.onclose = function() {
							that.__socket = null;
							that.trigger('disconnect');
						};

						that.trigger('connect');

					}

				});


				request.on('response', function(response) {

					var socket = response.socket || null;
					if (socket !== null) {
						socket.end();
						socket.destroy();
					}

				});


				request.end();


				if (lychee.debug === true) {
					console.log('lychee.net.Client: Connected to ' + this.host + ':' + this.port);
				}


				return true;

			}


			return false;

		},

		disconnect: function() {

			if (this.__isConnected === true) {

				if (this.__socket !== null) {
					this.__socket.close();
				}


				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.net.Remote').tags({
	platform: 'node'
}).requires([
	'lychee.net.protocol.HTTP',
	'lychee.net.protocol.WS',
	'lychee.net.remote.Debugger',
	'lychee.net.remote.Stash',
	'lychee.net.remote.Storage'
]).includes([
	'lychee.net.Tunnel'
]).supports(function(lychee, global) {

	if (typeof process !== 'undefined') {
		return true;
	}


	return false;

}).exports(function(lychee, global, attachments) {

	/*
	 * IMPLEMENTATION
	 */

	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.__socket      = null;
		this.__isConnected = false;


		lychee.net.Tunnel.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('connect', function() {

			this.__isConnected = true;

			this.addService(new lychee.net.remote.Debugger(this));
			this.addService(new lychee.net.remote.Stash(this));
			this.addService(new lychee.net.remote.Storage(this));

		}, this);

		this.bind('disconnect', function() {
			this.__isConnected = false;
		}, this);

		this.bind('send', function(blob) {

			if (this.__socket !== null) {
				this.__socket.send(blob);
			}

		}, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.net.Tunnel.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.Remote';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		connect: function(socket) {

			if (this.__isConnected === false) {

				var that = this;


				this.__socket = new lychee.net.protocol.WS(socket, lychee.net.protocol.WS.TYPE.remote);

				this.__socket.ondata = function(blob) {
					that.receive(blob);
				};

				this.__socket.onclose = function() {
					that.__socket = null;
					that.trigger('disconnect');
				};


				if (lychee.debug === true) {
					console.log('lychee.net.Remote: Connected to ' + this.host + ':' + this.port);
				}


				return true;

			}


			return false;

		},

		disconnect: function() {

			if (this.__isConnected === true) {

				if (lychee.debug === true) {
					console.log('lychee.net.Remote: Disconnected from ' + this.host + ':' + this.port);
				}

				if (this.__socket !== null) {
					this.__socket.close();
				}


				return true;

			}


			return false;

		}

	};


	return Class;

});


lychee.define('lychee.net.Server').tags({
	platform: 'node'
}).requires([
	'lychee.Storage',
	'lychee.crypto.SHA1',
	'lychee.data.JSON',
	'lychee.net.Remote'
]).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof process !== 'undefined') {
		return true;
	}


	return false;

}).exports(function(lychee, global, attachments) {

	var http  = require('http');
	var _JSON = lychee.data.JSON;
	var _SHA1 = lychee.crypto.SHA1;



	/*
	 * HELPERS
	 */

	var _get_websocket_handshake = function(request) {

		var origin   = request.headers.origin || null;
		var host     = request.headers.host   || null;
		var nonce    = request.headers['sec-websocket-key'] || null;

		if (origin !== null && nonce !== null) {

			var handshake = '';
			var accept    = (function(nonce) {

				var sha1 = new lychee.crypto.SHA1();
				sha1.update(nonce + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
				return sha1.digest().toString('base64');

			})(nonce);


			// HEAD

			handshake += 'HTTP/1.1 101 WebSocket Protocol Handshake\r\n';
			handshake += 'Upgrade: WebSocket\r\n';
			handshake += 'Connection: Upgrade\r\n';

			handshake += 'Sec-WebSocket-Version: '  + '13'       + '\r\n';
			handshake += 'Sec-WebSocket-Origin: '   + origin     + '\r\n';
			handshake += 'Sec-WebSocket-Protocol: ' + 'lycheejs' + '\r\n';
			handshake += 'Sec-WebSocket-Accept: '   + accept     + '\r\n';


			// BODY
			handshake += '\r\n';


			return handshake;

		}


		return null;

	};

	var _upgrade_to_websocket = function(request, socket, head) {

		var connection = (request.headers.connection || '').toLowerCase();
		var upgrade    = (request.headers.upgrade    || '').toLowerCase();
		var protocol   = (request.headers['sec-websocket-protocol'] || '').toLowerCase();

		if (connection.indexOf('upgrade') !== -1 && upgrade.indexOf('websocket') !== -1 && protocol === 'lycheejs') {

			var handshake = _get_websocket_handshake(request);
			if (handshake !== null) {

				socket.write(handshake, 'ascii');
				socket.setTimeout(0);
				socket.setNoDelay(true);
				socket.setKeepAlive(true, 0);
				socket.removeAllListeners('timeout');

				return true;

			}

		}


		socket.end();
		socket.destroy();

		return false;

	};



	/*
	 * IMPLEMENTATION
	 */

	var _storage = new lychee.Storage({
		id:    'server',
		type:  lychee.Storage.TYPE.persistent,
		model: {
			id:   '::ffff:1337',
			host: '::ffff',
			port: 1337
		}
	});


	var Class = function(data) {

		var settings = lychee.extend({}, data);


		this.codec = lychee.interfaceof(settings.codec, _JSON) ? settings.codec : _JSON;
		this.host  = null;
		this.port  = 1337;


		this.__socket = null;


		this.setHost(settings.host);
		this.setPort(settings.port);


		lychee.event.Emitter.call(this);

		settings = null;


		/*
		 * INITIALIZATION
		 */

		this.bind('connect', function(remote) {

			var id  = remote.host + ':' + remote.port;
			var obj = _storage.create();
			if (obj !== null) {

				obj.id   = id;
				obj.host = remote.host;
				obj.port = remote.port;

				_storage.write(id, obj);

			}

		}, this);

		this.bind('disconnect', function(remote) {

			var id  = remote.host + ':' + remote.port;
			var obj = _storage.read(id);
			if (obj !== null) {
				_storage.remove(id);
			}

		}, this);

	};


	Class.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			var data = lychee.event.Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.Server';

			var settings = {};


			if (this.codec !== _JSON)      settings.codec = lychee.serialize(this.codec);
			if (this.host !== 'localhost') settings.host  = this.host;
			if (this.port !== 1337)        settings.port  = this.port;


			data['arguments'][0] = settings;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		connect: function() {

			if (this.__socket === null) {

				if (lychee.debug === true) {
					console.log('lychee.net.Server: Connected to ' + this.host + ':' + this.port);
				}


				var that = this;


				this.__socket = new http.Server();

				this.__socket.on('upgrade', function(request, socket, headers) {

					if (_upgrade_to_websocket.call(that, request, socket, headers) === true) {

						var host = socket.remoteAddress || socket.server._connectionKey.split(':')[1];
						var port = socket.remotePort    || socket.server._connectionKey.split(':')[2];


						var remote = new lychee.net.Remote({
							host:  host,
							port:  port,
							codec: that.codec
						});

						remote.bind('connect', function() {
							that.trigger('connect', [ this ]);
						}, remote);

						remote.bind('disconnect', function() {
							that.trigger('disconnect', [ this ]);
						}, remote);

						remote.connect(socket);
						remote.trigger('connect');

					}

				});

				this.__socket.on('error', function(err) {
					console.error('lychee.net.Server: Error "' + err + '" on ' + that.host + ':' + that.port);
				});

				this.__socket.on('close', function() {
					that.__socket = null;
				});

				this.__socket.listen(this.port, this.host);


				return true;

			}


			return false;

		},

		disconnect: function() {

			if (this.__socket !== null) {
				this.__socket.close();
			}


			return true;

		},



		/*
		 * TUNNEL API
		 */

		setHost: function(host) {

			host = typeof host === 'string' ? host : null;


			if (host !== null) {

				this.host = host;

				return true;

			}


			return false;

		},

		setPort: function(port) {

			port = typeof port === 'number' ? (port | 0) : null;


			if (port !== null) {

				this.port = port;

				return true;

			}


			return false;

		}

	};


	return Class;

});


(function(lychee, global) {

	if (environment !== null) {
		environment.init();
	}

	lychee.ENVIRONMENTS['/libraries/lychee/dist'] = environment;

})(lychee, typeof global !== 'undefined' ? global : this);


lychee.inject(lychee.ENVIRONMENTS["/libraries/lychee/dist"]);
