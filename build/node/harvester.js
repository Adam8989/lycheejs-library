
lychee = typeof lychee !== 'undefined' ? lychee : (function(global) {

	const _INTERFACEOF_CACHE = {};



	/*
	 * NAMESPACE
	 */

	if (typeof lychee === 'undefined') {
		lychee = global.lychee = {};
	}



	/*
	 * POLYFILLS
	 */

	if (typeof Array.prototype.unique !== 'function') {

		Array.prototype.unique = function() {

			if (this === null || this === undefined) {
				throw new TypeError('Array.prototype.unique called on null or undefined');
			}


			let clone  = [];
			let list   = Object(this);
			let length = this.length >>> 0;
			let value;

			for (let i = 0; i < length; i++) {

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

		let _format_date = function(n) {
			return n < 10 ? '0' + n : '' + n;
		};

		Date.prototype.toJSON = function() {

			if (isFinite(this.valueOf()) === true) {

				let str = '';

				str += this.getUTCFullYear()                + '-';
				str += _format_date(this.getUTCMonth() + 1) + '-';
				str += _format_date(this.getUTCDate())      + 'T';
				str += _format_date(this.getUTCHours())     + ':';
				str += _format_date(this.getUTCMinutes())   + ':';
				str += _format_date(this.getUTCSeconds())   + 'Z';

				return str;

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


			let props   = [];
			let values  = [];
			let thisArg = arguments.length >= 3 ? arguments[2] : void 0;

			for (let prop in object) {

				let value = object[prop];

				if (Object.prototype.hasOwnProperty.call(object, prop)) {

					if (predicate.call(thisArg, value, prop, object)) {
						props.push(prop);
						values.push(value);
					}

				}

			}


			let filtered = {};

			for (let i = 0; i < props.length; i++) {
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


			let thisArg = arguments.length >= 3 ? arguments[2] : void 0;

			for (let prop in object) {

				let value = object[prop];

				if (Object.prototype.hasOwnProperty.call(object, prop)) {

					if (predicate.call(thisArg, value, prop, object)) {
						return value;
					}

				}

			}

			return undefined;

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


			let clone   = {};
			let keys    = Object.keys(object).sort();
			let length  = keys.length >>> 0;
			let thisArg = arguments.length >= 3 ? arguments[2] : void 0;
			let key;
			let value;
			let tmp;


			for (let k = 0; k < length; k++) {

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


			let clone  = {};
			let keys   = Object.keys(object).sort();
			let length = keys.length >>> 0;
			let key;
			let value;

			for (let k = 0; k < length; k++) {

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


			let values = [];

			for (let prop in object) {

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


			let clone  = '' + this;
			let keys   = Object.keys(object);
			let values = Object.values(object);


			for (let k = 0, kl = keys.length; k < kl; k++) {

				let key   = keys[k];
				let value = values[k];

				if (value instanceof Array) {
					value = JSON.stringify(value);
				} else if (value instanceof Object) {
					value = JSON.stringify(value);
				} else if (typeof value !== 'string') {
					value = '' + value;
				}


				let pointers = [];
				let pointer  = clone.indexOf('${' + key + '}');

				while (pointer !== -1) {
					pointers.push(pointer);
					pointer = clone.indexOf('${' + key + '}', pointer + 1);
				}


				let offset = 0;

				for (let p = 0, pl = pointers.length; p < pl; p++) {

					let index = pointers[p];

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



	/*
	 * HELPERS
	 */

	let _environment = null;

	const _bootstrap_environment = function() {

		if (_environment === null) {

			_environment = new lychee.Environment({
				debug: false
			});

		}


		if (this.environment === null) {
			this.setEnvironment(_environment);
		}

	};

	const _resolve_reference = function(identifier) {

		let pointer = this;

		let ns = identifier.split('.');
		for (let n = 0, l = ns.length; n < l; n++) {

			let name = ns[n];

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

	const Module = {

		debug:        true,
		environment:  _environment,

		ENVIRONMENTS: {},
		ROOT:         {
			lychee:  '/opt/lycheejs',
			project: null
		},
		VERSION:      "2017-Q2",



		/*
		 * LIBRARY API
		 */

		diff: function(aobject, bobject) {

			if (aobject instanceof Object && bobject instanceof Object) {

				let akeys = Object.keys(aobject);
				let bkeys = Object.keys(bobject);

				if (akeys.length !== bkeys.length) {
					return true;
				}


				for (let a = 0, al = akeys.length; a < al; a++) {

					let key = akeys[a];

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

			} else {

				if (aobject !== bobject) {
					return true;
				}

			}


			return false;

		},

		enumof: function(template, value) {

			if (template instanceof Object && typeof value === 'number') {

				let valid = false;

				for (let val in template) {

					if (value === template[val]) {
						valid = true;
						break;
					}

				}


				return valid;

			}


			return false;

		},

		assignsafe: function(target) {

			for (let a = 1, al = arguments.length; a < al; a++) {

				let object = arguments[a];
				if (object) {

					for (let prop in object) {

						if (object.hasOwnProperty(prop) === true) {

							let tvalue = target[prop];
							let ovalue = object[prop];
							if (tvalue instanceof Array && ovalue instanceof Array) {

								lychee.assignsafe(target[prop], object[prop]);

							} else if (tvalue instanceof Object && ovalue instanceof Object) {

								lychee.assignsafe(target[prop], object[prop]);

							} else if (typeof tvalue === typeof ovalue) {

								target[prop] = object[prop];

							}

						}

					}

				}

			}


			return target;

		},

		assignunlink: function(target) {

			for (let a = 1, al = arguments.length; a < al; a++) {

				let object = arguments[a];
				if (object) {

					for (let prop in object) {

						if (object.hasOwnProperty(prop) === true) {

							let tvalue = target[prop];
							let ovalue = object[prop];
							if (tvalue instanceof Array && ovalue instanceof Array) {
								target[prop] = [];
								lychee.assignunlink(target[prop], object[prop]);
							} else if (tvalue instanceof Object && ovalue instanceof Object) {
								target[prop] = {};
								lychee.assignunlink(target[prop], object[prop]);
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

			if (instance === null || instance === undefined) {
				return false;
			}


			let tname    = template.displayName;
			let iname    = instance.displayName;
			let hashable = typeof tname === 'string' && typeof iname === 'string';
			let hashmap  = _INTERFACEOF_CACHE;
			let valid    = false;


			// 0. Quick validation for identical constructors
			if (hashable === true) {

				if (hashmap[tname] !== undefined && hashmap[tname][iname] !== undefined) {

					return hashmap[tname][iname];

				} else if (tname === iname) {

					if (hashmap[tname] === undefined) {
						hashmap[tname] = {};
					}

					hashmap[tname][iname] = true;

					return true;

				}

			}


			// 1. Interface validation on Template
			if (template instanceof Function && template.prototype instanceof Object && instance instanceof Function && instance.prototype instanceof Object) {

				valid = true;

				for (let method in template.prototype) {

					if (typeof template.prototype[method] !== typeof instance.prototype[method]) {
						valid = false;
						break;
					}

				}


			// 2. Interface validation on Instance
			} else if (template instanceof Function && template.prototype instanceof Object && instance instanceof Object) {

				valid = true;

				for (let method in template.prototype) {

					if (typeof template.prototype[method] !== typeof instance[method]) {
						valid = false;
						break;
					}

				}


			// 3. Interface validation on Struct
			} else if (template instanceof Object && instance instanceof Object) {

				valid = true;

				for (let property in template) {

					if (template.hasOwnProperty(property) && instance.hasOwnProperty(property)) {

						if (typeof template[property] !== typeof instance[property]) {
							valid = false;
							break;
						}

					}

				}

			}


			if (hashable === true) {

				if (hashmap[tname] === undefined) {
					hashmap[tname] = {};
				}

				hashmap[tname][iname] = valid;

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
			} catch (err) {
				data = null;
			}


			if (data !== null) {

				let instance = null;
				let scope    = (this.environment !== null ? this.environment.global : global);


				if (typeof data.reference === 'string') {

					let resolved_module = _resolve_reference.call(scope, data.reference);
					if (typeof resolved_module === 'object') {
						instance = resolved_module;
					}

				} else if (typeof data.constructor === 'string' && data.arguments instanceof Array) {

					let resolved_class = _resolve_reference.call(scope, data.constructor);
					if (typeof resolved_class === 'function') {

						let bindargs = [].splice.call(data.arguments, 0).map(function(value) {

							if (typeof value === 'string' && value.charAt(0) === '#') {

								if (lychee.debug === true) {
									console.log('lychee.deserialize: Injecting "' + value + '" from global');
								}

								let resolved = _resolve_reference.call(scope, value.substr(1));
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

				} else if (data instanceof Object) {

					instance = data;

				}


				if (instance !== null) {

					// High-Level ENTITY API
					if (typeof instance.deserialize === 'function') {

						let blob = data.blob || null;
						if (blob !== null) {
							instance.deserialize(blob);
						}

					// Low-Level ASSET API
					} else if (typeof instance.load === 'function') {
						instance.load();
					}


					return instance;

				} else {

					console.info('lychee.deserialize: Require ' + (data.reference || data.constructor) + ' to deserialize it.');

				}

			}


			return null;

		},

		serialize: function(definition) {

			definition = definition !== undefined ? definition : null;


			let data = null;

			if (definition !== null) {

				if (typeof definition === 'object') {

					if (typeof definition.serialize === 'function') {

						data = definition.serialize();

					} else if (typeof definition.displayName !== 'undefined') {

						if (definition.prototype instanceof Object) {
							console.info('lychee.deserialize: Define ' + (definition.displayName) + '.prototype.serialize() to serialize it.');
						} else {
							console.info('lychee.deserialize: Define ' + (definition.displayName) + '.serialize() to serialize it.');
						}

					} else {

						try {
							data = JSON.parse(JSON.stringify(definition));
						} catch (err) {
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

		assimilate: function(target) {

			target = typeof target === 'string' ? target : null;


			if (target !== null) {

				_bootstrap_environment.call(this);


				let that = this;


				// XXX: First sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Second sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Third sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}


				let asset = new lychee.Asset(target, null, false);
				if (asset !== null) {
					asset.load();
				}


				return asset;

			} else {

				console.warn('lychee.assimilate: Invalid target');
				console.info('lychee.assimilate: Use lychee.assimilate(target) where target is a path to an Asset');

			}


			return null;

		},

		define: function(identifier) {

			identifier = typeof identifier === 'string' ? identifier : null;


			if (identifier !== null) {

				_bootstrap_environment.call(this);


				let definition = new lychee.Definition(identifier);
				let that       = this;


				// XXX: First sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Second sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Third sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}


				definition.exports = function(callback) {

					lychee.Definition.prototype.exports.call(this, callback);
					that.environment.define(this, false);

				};


				return definition;

			} else {

				console.warn('lychee.define: Invalid identifier');
				console.info('lychee.define: Use lychee.define(id).exports(closure)');

			}


			return null;

		},

		import: function(reference) {

			reference = typeof reference === 'string' ? reference : null;


			if (reference !== null) {

				_bootstrap_environment.call(this);


				let instance = null;
				let that     = this;

				// XXX: First sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Second sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}

				// XXX: Third sandboxed hierarchy
				if (that.environment.sandbox === true) {
					that = that.environment.global.lychee;
				}


				let resolved_module = _resolve_reference.call(that.environment.global, reference);
				if (resolved_module !== null) {
					instance = resolved_module;
				}


				if (instance === null) {
					console.info('lychee.deserialize: Require ' + (reference) + ' to import it.');
				}


				return instance;

			}


			return null;

		},

		envinit: function(environment, profile) {

			let message = environment !== null;

			environment = environment instanceof lychee.Environment ? environment : null;
			profile     = profile instanceof Object                 ? profile     : {};


			_bootstrap_environment.call(this);


			if (environment !== null) {

				let code        = '\n';
				let id          = (lychee.ROOT.project || '').substr((lychee.ROOT.lychee || '').length) + '/custom';
				let env_profile = Object.assign({}, environment.profile, profile);


				if (environment.id.substr(0, 19) === 'lychee-Environment-') {
					environment.setId(id);
				}


				if (_environment !== null) {

					Object.values(_environment.definitions).forEach(function(definition) {
						environment.define(definition, true);
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
					return 'let ' + lib + ' = sandbox.' + lib + ';';
				}).join('\n');

				code += '\n\n';
				code += 'sandbox.MAIN = new ' + environment.build + '(' + JSON.stringify(env_profile) + ');\n';
				code += '\n\n';
				code += 'if (typeof sandbox.MAIN.init === \'function\') {\n';
				code += '\tsandbox.MAIN.init();\n';
				code += '}\n';


				lychee.setEnvironment(environment);
				environment.init(new Function('sandbox', code));

			} else if (message === true) {

				console.warn('lychee.envinit: Invalid environment');
				console.info('lychee.envinit: Use lychee.envinit(env, profile) where env is a lychee.Environment instance');

			}

		},

		pkginit: function(identifier, settings, profile) {

			identifier = typeof identifier === 'string' ? identifier : null;
			settings   = settings instanceof Object     ? settings   : {};
			profile    = profile instanceof Object      ? profile    : {};


			_bootstrap_environment.call(this);


			if (identifier !== null) {

				let config = new Config('./lychee.pkg');

				config.onload = function() {

					let buffer = this.buffer || null;
					if (buffer instanceof Object) {

						if (buffer.build instanceof Object && buffer.build.environments instanceof Object) {

							let data = buffer.build.environments[identifier] || null;
							if (data instanceof Object) {

								let code         = '\n';
								let env_settings = Object.assign({
									id: lychee.ROOT.project + '/' + identifier.split('/').pop()
								}, data, settings);
								let env_profile  = Object.assign({}, data.profile, profile);
								let environment  = new lychee.Environment(env_settings);


								if (_environment !== null) {

									Object.values(_environment.definitions).forEach(function(definition) {
										environment.define(definition, true);
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
									return 'let ' + lib + ' = sandbox.' + lib + ';';
								}).join('\n');

								code += '\n\n';
								code += 'sandbox.MAIN = new ' + env_settings.build + '(' + JSON.stringify(env_profile) + ');\n';
								code += '\n\n';
								code += 'if (typeof sandbox.MAIN.init === \'function\') {\n';
								code += '\tsandbox.MAIN.init();\n';
								code += '}\n';


								lychee.setEnvironment(environment);
								environment.init(new Function('sandbox', code));

							} else {

								console.warn('lychee.pkginit: Invalid settings for "' + identifier + '" in lychee.pkg.');
								console.info('lychee.pkginit: Insert settings at "/build/environments/\"' + identifier + '\"" in lychee.pkg.');

							}

						} else {

							console.warn('lychee.pkginit: Invalid package at "' + this.url + '".');
							console.info('lychee.pkginit: Replace lychee.pkg with the one from "/projects/boilerplate".');

						}

					} else {

						console.warn('lychee.pkginit: Invalid package at "' + this.url + '".');
						console.info('lychee.pkginit: Replace lychee.pkg with the one from "/projects/boilerplate".');

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

					let that = this;

					Object.values(environment.definitions).forEach(function(definition) {
						that.environment.define(definition, true);
					});

					let build_old = this.environment.definitions[this.environment.build] || null;
					let build_new = environment.definitions[environment.build]           || null;

					if (build_old === null && build_new !== null) {
						this.environment.build = environment.build;
						this.environment.type  = environment.type;
					}


					return true;

				} else {

					console.warn('lychee.inject: Invalid default environment for injection.');
					console.info('lychee.inject: Use lychee.setEnvironment(env) before using lychee.inject(other).');

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


	return Object.assign(lychee, Module);

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Asset = typeof lychee.Asset !== 'undefined' ? lychee.Asset : (function(global) {

	/*
	 * HELPERS
	 */

	const _resolve_constructor = function(type) {

		let construct = null;


		if (type === 'fnt')   construct = global.Font;
		if (type === 'json')  construct = global.Config;
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

	const Callback = function(url, type, ignore) {

		url    = typeof url === 'string'  ? url  : null;
		type   = typeof type === 'string' ? type : null;
		ignore = ignore === true;


		let asset = null;

		if (url !== null) {

			if (type === null) {

				if (url.substr(0, 5) === 'data:') {
					type = url.split(';')[0].split('/').pop();
				} else {
					type = url.split('/').pop().split('.').pop();
				}

			}


			let construct = _resolve_constructor(type);
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


	Callback.displayName = 'lychee.Asset';


	return Callback;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Debugger = typeof lychee.Debugger !== 'undefined' ? lychee.Debugger : (function(global) {

	/*
	 * HELPERS
	 */

	let _client      = null;
	let _environment = null;

	const _bootstrap_environment = function() {

		if (_environment === null) {

			let currentenv = lychee.environment;
			lychee.setEnvironment(null);

			let defaultenv = lychee.environment;
			lychee.setEnvironment(currentenv);

			_environment = defaultenv;

		}

	};

	const _diff_environment = function(environment) {

		let cache1 = {};
		let cache2 = {};

		let global1 = _environment.global;
		let global2 = environment.global;

		for (let prop1 in global1) {

			if (global1[prop1] === global2[prop1]) continue;

			if (typeof global1[prop1] !== typeof global2[prop1]) {
				cache1[prop1] = global1[prop1];
			}

		}

		for (let prop2 in global2) {

			if (global2[prop2] === global1[prop2]) continue;

			if (typeof global2[prop2] !== typeof global1[prop2]) {
				cache2[prop2] = global2[prop2];
			}

		}


		let diff = Object.assign({}, cache1, cache2);
		if (Object.keys(diff).length > 0) {
			return diff;
		}


		return null;

	};

	const _report_error = function(environment, data) {

		let info = 'Report from ' + data.file + '#L' + data.line + ' in ' + data.method;
		let main = environment.global.MAIN || null;

		if (main !== null) {

			let client = main.client || null;
			if (client !== null) {

				let service = client.getService('debugger');
				if (service !== null) {
					service.report('lychee.Debugger: ' + info, data);
				}

			}

		}


		console.error('lychee.Debugger: ' + info);
		console.error('lychee.Debugger: ' + data.message.trim());

	};



	/*
	 * IMPLEMENTATION
	 */

	const Module = {

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

				let project = environment.id;
				if (project !== null) {

					if (lychee.diff(environment.global, _environment.global) === true) {

						let diff = _diff_environment(environment);
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

				let definition = null;

				if (referer !== null) {

					if (referer instanceof Stuff) {
						definition = referer.url;
					} else if (referer instanceof lychee.Definition) {
						definition = referer.id;
					}

				}


				let data = {
					project:     environment.id,
					definition:  definition,
					environment: environment.serialize(),
					file:        null,
					line:        null,
					method:      null,
					type:        error.toString().split(':')[0],
					message:     error.message
				};


				if (typeof error.stack === 'string') {

					let callsite = error.stack.split('\n')[0].trim();
					if (callsite.charAt(0) === '/') {

						data.file = callsite.split(':')[0];
						data.line = callsite.split(':')[1] || '';

					} else {

						callsite = error.stack.split('\n').find(function(val) {
							return val.trim().substr(0, 2) === 'at';
						});

						if (typeof callsite === 'string') {

							let tmp1 = callsite.trim().split(' ');
							let tmp2 = tmp1[2] || '';

							if (tmp2.charAt(0) === '(')               tmp2 = tmp2.substr(1);
							if (tmp2.charAt(tmp2.length - 1) === ')') tmp2 = tmp2.substr(0, tmp2.length - 1);

							// XXX: Thanks, Blink. Thanks -_-
							if (tmp2.substr(0, 4) === 'http') {
								tmp2 = '/' + tmp2.split('/').slice(3).join('/');
							}

							let tmp3 = tmp2.split(':');

							data.file   = tmp3[0];
							data.line   = tmp3[1];
							data.code   = '';
							data.method = tmp1[1];

						}

					}

				} else if (typeof Error.captureStackTrace === 'function') {

					let orig = Error.prepareStackTrace;

					Error.prepareStackTrace = function(err, stack) {
						return stack;
					};
					Error.captureStackTrace(new Error());


					let stack    = [].slice.call(error.stack);
					let callsite = stack.shift();
					let FILTER   = [ 'module.js', 'vm.js', 'internal/module.js' ];

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


				_report_error(environment, data);


				return true;

			} else {

				console.error(error);

			}


			return false;

		}

	};


	Module.displayName = 'lychee.Debugger';


	return Module;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Definition = typeof lychee.Definition !== 'undefined' ? lychee.Definition : (function(global) {

	const lychee = global.lychee;



	/*
	 * HELPERS
	 */

	const _fuzz_asset = function(type) {

		let asset = {
			url: '/tmp/Dummy.' + type,
			serialize: function() {
				return null;
			}
		};


		let file = this.__file;
		if (file !== null) {
			asset.url = file.split('.').slice(0, -1).join('.') + '.' + type;
		}


		Object.defineProperty(asset, 'buffer', {
			get: function() {
				console.warn('lychee.Definition: Injecting Attachment "' + this.url + '" (' + file + ')');
				return null;
			},
			set: function() {
				return false;
			},
			enumerable:   true,
			configurable: false
		});


		return asset;

	};

	const _fuzz_id = function() {

		let file = this.__file;
		if (file !== null) {

			let packages = lychee.environment.packages.filter(function(pkg) {
				return pkg.type === 'source';
			}).map(function(pkg) {

				return {
					id:  pkg.id,
					url: pkg.url.split('/').slice(0, -1).join('/')
				};

			});


			let ns  = file.split('/');
			let pkg = packages.find(function(pkg) {
				return file.substr(0, pkg.url.length) === pkg.url;
			}) || null;


			if (pkg !== null) {

				let id    = '';
				let tmp_i = ns.indexOf('source');
				let tmp_s = ns[ns.length - 1];

				if (/\.js$/g.test(tmp_s)) {
					ns[ns.length - 1] = tmp_s.split('.').slice(0, -1).join('.');
				}

				if (tmp_i !== -1) {
					id = ns.slice(tmp_i + 1).join('.');
				}


				this.id = pkg.id + '.' + id;

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(id) {

		id = typeof id === 'string' ? id : '';


		this.id     = '';

		this.__file = lychee.Environment.__FILENAME || null;


		if (/\./.test(id)) {

			this.id = id;

		} else if (/^([A-Za-z0-9\.]+)/g.test(id)) {

			this.id = 'lychee.' + id;

		} else {

			let fuzz_id = _fuzz_id.call(this);
			if (fuzz_id === true) {
				console.warn('lychee.Definition: Injecting Identifier "' + this.id + '" (' + this.__file + ')');
			} else {
				console.error('lychee.Definition: Invalid Identifier "' + id + '" (' + this.__file + ')');
			}

		}


		this._attaches = {
			'json':  _fuzz_asset.call(this, 'json'),
			'fnt':   _fuzz_asset.call(this, 'fnt'),
			'msc':   _fuzz_asset.call(this, 'msc'),
			'pkg':   _fuzz_asset.call(this, 'pkg'),
			'png':   _fuzz_asset.call(this, 'png'),
			'snd':   _fuzz_asset.call(this, 'snd'),
			'store': _fuzz_asset.call(this, 'store')
		};
		this._tags     = {};
		this._requires = [];
		this._includes = [];
		this._exports  = null;
		this._supports = null;


		return this;

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.attaches instanceof Object) {

				let attachesmap = {};

				for (let aid in blob.attaches) {
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


			let index1   = 0;
			let index2   = 0;
			let tmp      = null;
			let bindargs = null;

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

			let blob = {};


			if (Object.keys(this._attaches).length > 0) {

				blob.attaches = {};

				for (let aid in this._attaches) {

					let asset = lychee.serialize(this._attaches[aid]);
					if (asset !== null) {
						blob.attaches[aid] = asset;
					}

				}

			}

			if (Object.keys(this._tags).length > 0) {

				blob.tags = {};

				for (let tid in this._tags) {
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

				for (let id in map) {

					let value = map[id];
					if (value !== undefined) {
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

				for (let d = 0, dl = definitions.length; d < dl; d++) {

					let definition = definitions[d];
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

				for (let d = 0, dl = definitions.length; d < dl; d++) {

					let definition = definitions[d];
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

				for (let id in map) {

					let value = map[id];
					if (typeof value === 'string') {
						this._tags[id] = value;
					}

				}

			}


			return this;

		}

	};


	Composite.displayName           = 'lychee.Definition';
	Composite.prototype.displayName = 'lychee.Definition';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Environment = typeof lychee.Environment !== 'undefined' ? lychee.Environment : (function(global) {

	let   _id     = 0;
	const lychee  = global.lychee;
	const console = global.console;



	/*
	 * EVENTS
	 */

	const _export_loop = function(cache) {

		let that  = this;
		let load  = cache.load;
		let ready = cache.ready;
		let track = cache.track;

		let identifier, definition;


		for (let l = 0, ll = load.length; l < ll; l++) {

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


		for (let r = 0, rl = ready.length; r < rl; r++) {

			identifier = ready[r];
			definition = this.definitions[identifier] || null;

			if (definition !== null) {

				let dependencies = _resolve_definition.call(this, definition);
				if (dependencies.length > 0) {

					for (let d = 0, dl = dependencies.length; d < dl; d++) {

						let dependency = dependencies[d];
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

	const _detect_features = function(source) {

		if (typeof Proxy === 'undefined') {
			return source;
		}


		let clone = {};
		let proxy = new Proxy(clone, {

			get: function(target, name) {

				// XXX: Remove this and console will crash your program
				if (name === 'splice') return undefined;


				if (target[name] === undefined) {

					let type = typeof source[name];
					if (/boolean|number|string|function/g.test(type)) {
						target[name] = source[name];
					} else if (/object/g.test(type)) {
						target[name] = _detect_features(source[name]);
					} else if (/undefined/g.test(type)) {
						target[name] = undefined;
					}


					if (target[name] === undefined) {
						console.error('lychee.Environment: Unknown feature (data type) "' + name + '" in bootstrap.js');
					}

				}


				return target[name];

			}

		});


		proxy.toJSON = function() {

			let data = {};

			Object.keys(clone).forEach(function(key) {

				if (/toJSON/g.test(key) === false) {

					let type = typeof clone[key];
					if (/boolean|number|string|function/g.test(type)) {
						data[key] = type;
					} else if (/object/g.test(type)) {
						data[key] = clone[key];
					}

				}

			});

			return data;

		};


		return proxy;

	};

	const _inject_features = function(source, features) {

		let target = this;

		Object.keys(features).forEach(function(key) {

			let type = features[key];
			if (/boolean|number|string|function/g.test(type)) {

				target[key] = source[key];

			} else if (typeof type === 'object') {

				if (typeof source[key] === 'object') {

					target[key] = source[key];
					_inject_features.call(target[key], source[key], type);

				}

			}

		});

	};

	const _validate_definition = function(definition) {

		if (!(definition instanceof lychee.Definition)) {
			return false;
		}


		let features  = null;
		let sandbox   = this.sandbox;
		let supported = false;


		if (definition._supports !== null) {

			let detector = _detect_features(Composite.__FEATURES || global);
			if (detector !== null) {

				supported = definition._supports.call(detector, lychee, detector);
				features  = JSON.parse(JSON.stringify(detector));
				detector  = null;

			} else {

				supported = definition._supports.call(global, lychee, global);

			}

		} else {

			supported = true;

		}


		let tagged = true;

		if (Object.keys(definition._tags).length > 0) {

			for (let tag in definition._tags) {

				let value = definition._tags[tag];
				let tags  = this.tags[tag] || null;
				if (tags instanceof Array) {

					if (tags.indexOf(value) === -1) {

						tagged = false;
						break;

					}

				}

			}

		}


		let type = this.type;
		if (type === 'build') {

			if (features !== null && sandbox === true) {
				_inject_features.call(this.global, global, features);
			}

			return tagged;

		} else if (type === 'export') {

			if (features !== null) {

				this.__features = lychee.assignunlink(this.__features, features);

				if (sandbox === true) {
					_inject_features.call(this.global, global, features);
				}

			}

			return tagged;

		} else if (type === 'source') {

			if (features !== null) {

				this.__features = lychee.assignunlink(this.__features, features);

				if (sandbox === true) {
					_inject_features.call(this.global, global, features);
				}

			}

			return supported && tagged;

		}


		return false;

	};

	const _resolve_definition = function(definition) {

		let dependencies = [];

		if (definition instanceof lychee.Definition) {

			for (let i = 0, il = definition._includes.length; i < il; i++) {

				let inc   = definition._includes[i];
				let check = _get_composite.call(this.global, inc);
				if (check === null) {
					dependencies.push(inc);
				}

			}

			for (let r = 0, rl = definition._requires.length; r < rl; r++) {

				let req   = definition._requires[r];
				let check = _get_composite.call(this.global, req);
				if (check === null) {
					dependencies.push(req);
				}

			}

		}

		return dependencies;

	};

	const _export_definition = function(definition) {

		if (_get_composite.call(this.global, definition.id) !== null) {
			return false;
		}


		let namespace  = _get_namespace.call(this.global, definition.id);
		let identifier = definition.id.split('.').pop();


		if (this.debug === true) {
			let info = Object.keys(definition._attaches).length > 0 ? ('(' + Object.keys(definition._attaches).length + ' Attachment(s))') : '';
			this.global.console.log('lychee-Environment (' + this.id + '): Exporting "' + definition.id + '" ' + info);
		}



		/*
		 * 1. Export Composite, Module or Callback
		 */

		let template = null;
		if (definition._exports !== null) {

			try {

				template = definition._exports.call(
					definition._exports,
					this.global.lychee,
					this.global,
					definition._attaches
				) || null;

			} catch (err) {
				lychee.Debugger.report(this, err, definition);
			}

		}



		/*
		 * 2. Assign Composite, Module or Callback
		 */

		if (template !== null) {

			/*
			 * 2.1 Assign and export Composite or Module
			 */

			let includes = definition._includes;
			if (includes.length > 0) {

				let ownenums   = null;
				let ownmethods = null;
				let ownkeys    = Object.keys(template);
				let ownproto   = template.prototype;


				if (ownkeys.length > 0) {

					ownenums = {};

					for (let ok = 0, okl = ownkeys.length; ok < okl; ok++) {

						let ownkey = ownkeys[ok];
						if (ownkey === ownkey.toUpperCase()) {
							ownenums[ownkey] = template[ownkey];
						}

					}

					if (Object.keys(ownenums).length === 0) {
						ownenums = null;
					}

				}

				if (ownproto instanceof Object) {

					ownmethods = {};

					for (let ownmethod in ownproto) {
						ownmethods[ownmethod] = ownproto[ownmethod];
					}

					if (Object.keys(ownmethods).length === 0) {
						ownmethods = null;
					}

				}


				Object.defineProperty(namespace, identifier, {
					value:        template,
					writable:     false,
					enumerable:   true,
					configurable: false
				});


				namespace[identifier].displayName = definition.id;
				namespace[identifier].prototype = {};


				let tplenums   = {};
				let tplmethods = [ namespace[identifier].prototype ];


				for (let i = 0, il = includes.length; i < il; i++) {

					let include = _get_template.call(this.global, includes[i]);
					if (include !== null) {

						let inckeys = Object.keys(include);
						if (inckeys.length > 0) {

							for (let ik = 0, ikl = inckeys.length; ik < ikl; ik++) {

								let inckey = inckeys[ik];
								if (inckey === inckey.toUpperCase()) {
									tplenums[inckey] = include[inckey];
								}

							}

						}

						tplmethods.push(include.prototype);

					} else {

						if (this.debug === true) {
							console.error('lychee-Environment (' + this.id + '): Invalid Inclusion of "' + includes[i] + '"');
						}

					}

				}


				if (ownenums !== null) {

					for (let e in ownenums) {
						tplenums[e] = ownenums[e];
					}

				}

				if (ownmethods !== null) {
					tplmethods.push(ownmethods);
				}


				for (let e in tplenums) {
					namespace[identifier][e] = tplenums[e];
				}

				Object.assign.apply(lychee, tplmethods);
				namespace[identifier].prototype.displayName = definition.id;

				Object.freeze(namespace[identifier].prototype);


			/*
			 * 2.2 Nothing to include, plain Definition
			 */

			} else {

				namespace[identifier] = template;
				namespace[identifier].displayName = definition.id;


				if (template instanceof Object) {
					Object.freeze(namespace[identifier]);
				}

				if (namespace[identifier].prototype instanceof Object) {
					namespace[identifier].prototype.displayName = definition.id;
					Object.freeze(namespace[identifier].prototype);
				}

			}

		} else {

			namespace[identifier] = function() {};
			namespace[identifier].displayName = definition.id;
			namespace[identifier].prototype = {};
			namespace[identifier].prototype.displayName = definition.id;

			Object.freeze(namespace[identifier].prototype);


			this.global.console.error('lychee-Environment (' + this.id + '): Invalid Definition "' + definition.id + '", it is replaced with a Dummy Composite');

		}


		return true;

	};

	const _get_composite = function(identifier) {

		let id = identifier.split('.').pop();

		let pointer = _get_namespace.call(this, identifier);
		if (pointer[id] !== undefined) {
			return pointer;
		}


		return null;

	};

	const _get_namespace = function(identifier) {

		let pointer = this;

		let ns = identifier.split('.'); ns.pop();
		for (let n = 0, l = ns.length; n < l; n++) {

			let name = ns[n];

			if (pointer[name] === undefined) {
				pointer[name] = {};
			}

			pointer = pointer[name];

		}


		return pointer;

	};

	const _get_template = function(identifier) {

		let pointer = this;

		let ns = identifier.split('.');
		for (let n = 0, l = ns.length; n < l; n++) {

			let name = ns[n];

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

	const _Sandbox = function(settings) {

		let that     = this;
		let _std_err = '';
		let _std_out = '';


		this.console = {};
		this.console.log = function() {

			let str = '\n';

			for (let a = 0, al = arguments.length; a < al; a++) {

				let arg = arguments[a];
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

			let args = [ '(I)\t' ];

			for (let a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.warn = function() {

			let args = [ '(W)\t' ];

			for (let a = 0, al = arguments.length; a < al; a++) {
				args.push(arguments[a]);
			}

			this.log.apply(this, args);

		};

		this.console.error = function() {

			let args = [ '(E)\t' ];

			for (let a = 0, al = arguments.length; a < al; a++) {
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

			let blob = {};


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
			'assignsafe',
			'assignunlink',
			'debug',
			'diff',
			'enumof',
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

				let instance = lychee.deserialize(settings[key]);
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

			let settings = {};
			let blob     = {};


			Object.keys(this).filter(function(key) {
				return key.charAt(0) !== '_' && key === key.toUpperCase();
			}).forEach(function(key) {
				settings[key] = lychee.serialize(this[key]);
			}.bind(this));


			blob.lychee         = {};
			blob.lychee.debug   = this.lychee.debug;
			blob.lychee.VERSION = this.lychee.VERSION;
			blob.lychee.ROOT    = this.lychee.ROOT;


			let data = this.console.serialize();
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

	let Composite = function(data) {

		let settings = Object.assign({}, data);


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


		this.__cache    = {
			active:        false,
			assimilations: [],
			start:         0,
			end:           0,
			retries:       0,
			timeout:       0,
			load:          [],
			ready:         [],
			track:         []
		};
		this.__features = {};


		// Alternative API for lychee.pkg

		if (settings.packages instanceof Array) {

			for (let p = 0, pl = settings.packages.length; p < pl; p++) {

				let pkg = settings.packages[p];
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


	Composite.__FEATURES  = null;
	Composite.__FILENAME  = null;


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		deserialize: function(blob) {

			if (blob.definitions instanceof Object) {

				for (let id in blob.definitions) {
					this.definitions[id] = lychee.deserialize(blob.definitions[id]);
				}

			}

			let features = lychee.deserialize(blob.features);
			if (features !== null) {
				this.__features = features;
			}

			if (blob.packages instanceof Array) {

				let packages = [];

				for (let p = 0, pl = blob.packages.length; p < pl; p++) {
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

			let settings = {};
			let blob     = {};


			if (this.id !== '0')           settings.id      = this.id;
			if (this.build !== 'app.Main') settings.build   = this.build;
			if (this.debug !== true)       settings.debug   = this.debug;
			if (this.sandbox !== true)     settings.sandbox = this.sandbox;
			if (this.timeout !== 10000)    settings.timeout = this.timeout;
			if (this.type !== 'source')    settings.type    = this.type;


			if (Object.keys(this.tags).length > 0) {

				settings.tags = {};

				for (let tagid in this.tags) {
					settings.tags[tagid] = this.tags[tagid];
				}

			}

			if (Object.keys(this.definitions).length > 0) {

				blob.definitions = {};

				for (let defid in this.definitions) {
					blob.definitions[defid] = lychee.serialize(this.definitions[defid]);
				}

			}


			if (Object.keys(this.__features).length > 0) blob.features = lychee.serialize(this.__features);

			if (this.packages.length > 0) {

				blob.packages = [];

				for (let p = 0, pl = this.packages.length; p < pl; p++) {
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

				let tmp    = identifier.split('.');
				let pkg_id = tmp[0];
				let def_id = tmp.slice(1).join('.');


				let definition = this.definitions[identifier] || null;
				if (definition !== null) {

					return true;

				} else {

					let pkg = this.packages.find(function(pkg) {
						return pkg.id === pkg_id;
					}) || null;

					if (pkg !== null && pkg.isReady() === true) {

						let result = pkg.load(def_id, this.tags);
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

		define: function(definition, inject) {

			definition = definition instanceof lychee.Definition ? definition : null;
			inject     = inject === true;


			if (definition !== null) {

				let filename = Composite.__FILENAME || null;
				if (inject === false && filename !== null) {

					let old_pkg_id = definition.id.split('.')[0];
					let new_pkg_id = null;

					for (let p = 0, pl = this.packages.length; p < pl; p++) {

						let root = this.packages[p].root;
						if (filename.substr(0, root.length) === root) {
							new_pkg_id = this.packages[p].id;
							break;
						}

					}


					let assimilation = true;

					for (let p = 0, pl = this.packages.length; p < pl; p++) {

						let id = this.packages[p].id;
						if (id === old_pkg_id || id === new_pkg_id) {
							assimilation = false;
							break;
						}

					}


					if (assimilation === true) {

						if (this.debug === true) {
							this.global.console.log('lychee-Environment (' + this.id + '): Assimilating Definition "' + definition.id + '"');
						}


						this.__cache.assimilations.push(definition.id);

					} else if (new_pkg_id !== null && new_pkg_id !== old_pkg_id) {

						if (this.debug === true) {
							this.global.console.log('lychee-Environment (' + this.id + '): Injecting Definition "' + definition.id + '" into package "' + new_pkg_id + '"');
						}


						definition.id = new_pkg_id + '.' + definition.id.split('.').slice(1).join('.');

						for (let i = 0, il = definition._includes.length; i < il; i++) {

							let inc = definition._includes[i];
							if (inc.substr(0, old_pkg_id.length) === old_pkg_id) {
								definition._includes[i] = new_pkg_id + inc.substr(old_pkg_id.length);
							}

						}

						for (let r = 0, rl = definition._requires.length; r < rl; r++) {

							let req = definition._requires[r];
							if (req.substr(0, old_pkg_id.length) === old_pkg_id) {
								definition._requires[r] = new_pkg_id + req.substr(old_pkg_id.length);
							}

						}

					}

				} else {

					// XXX: Direct injection has no auto-mapping

				}


				if (_validate_definition.call(this, definition) === true) {

					if (this.debug === true) {
						let info = Object.keys(definition._tags).length > 0 ? ('(' + JSON.stringify(definition._tags) + ')') : '';
						this.global.console.log('lychee-Environment (' + this.id + '): Mapping "' + definition.id + '" ' + info);
					}

					this.definitions[definition.id] = definition;


					return true;

				}

			}


			let info = Object.keys(definition._tags).length > 0 ? ('(' + JSON.stringify(definition._tags) + ')') : '';
			this.global.console.error('lychee-Environment (' + this.id + '): Invalid Definition "' + definition.id + '" ' + info);


			return false;

		},

		init: function(callback) {

			callback = callback instanceof Function ? callback : function() {};


			if (this.debug === true) {
				this.global.lychee.ENVIRONMENTS[this.id] = this;
			}


			let build = this.build;
			let cache = this.__cache;
			let type  = this.type;
			let that  = this;


			if (type === 'source' || type === 'export') {

				let lypkg = this.packages.find(function(pkg) {
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

				let result = this.load(build);
				if (result === true) {

					if (this.debug === true) {
						this.global.console.log('lychee-Environment (' + this.id + '): BUILD START ("' + this.build + '")');
					}


					cache.start   = Date.now();
					cache.timeout = Date.now() + this.timeout;
					cache.load    = [ build ];
					cache.ready   = [];
					cache.active  = true;


					let onbuildtimeout = function() {

						if (this.debug === true) {
							this.global.console.log('lychee-Environment (' + this.id + '): BUILD TIMEOUT (' + (cache.end - cache.start) + 'ms)');
						}


						// XXX: Always show Dependency Errors
						if (cache.load.length > 0) {

							this.global.console.error('lychee-Environment (' + this.id + '): Invalid Dependencies\n' + cache.load.map(function(value, index) {
								return '\t - ' + value + ' (required by ' + cache.track[index] + ')';
							}).join('\n'));

						}


						try {
							callback.call(this.global, null);
						} catch (err) {
							lychee.Debugger.report(this, err, null);
						}

					};

					let onbuildsuccess = function() {

						if (this.debug === true) {
							this.global.console.log('lychee-Environment (' + this.id + '): BUILD END (' + (cache.end - cache.start) + 'ms)');
						}


						try {
							callback.call(this.global, this.global);
						} catch (err) {
							lychee.Debugger.report(this, err, null);
						}

					};


					let intervalId = setInterval(function() {

						let cache = that.__cache;
						if (cache.active === true) {

							_export_loop.call(that, cache);

						} else if (cache.active === false) {

							if (intervalId !== null) {
								clearInterval(intervalId);
								intervalId = null;
							}


							let assimilations = cache.assimilations;
							if (assimilations.length > 0) {

								for (let a = 0, al = assimilations.length; a < al; a++) {

									let identifier = assimilations[a];
									let definition = that.definitions[identifier] || null;
									if (definition !== null) {
										_export_definition.call(that, definition);
									}

								}

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

					cache.retries++;


					if (cache.retries < 3) {

						if (this.debug === true) {
							this.global.console.warn('lychee-Environment (' + this.id + '): Package not ready, retrying in 100ms ...');
						}

						setTimeout(function() {
							that.init(callback);
						}, 100);

					} else {

						this.global.console.error('lychee-Environment (' + this.id + '): Invalid Dependencies\n\t - ' + build + ' (build target)');

					}

				}


				return true;

			}


			return false;

		},

		resolve: function(path) {

			path = typeof path === 'string' ? path : '';


			let proto = path.split(':')[0] || '';
			if (/^http|https/g.test(proto) === false) {
				path = (path.charAt(0) === '/' ? (lychee.ROOT.lychee + path) : (lychee.ROOT.project + '/' + path));
			}


			let tmp = path.split('/');

			for (let t = 0, tl = tmp.length; t < tl; t++) {

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

				let type = this.type;
				if (type === 'build') {

					this.build = identifier;

					return true;

				} else {

					let pkg = this.packages.find(function(pkg) {
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

			debug = typeof debug === 'boolean' ? debug : null;


			if (debug !== null) {

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

				for (let identifier in definitions) {

					let definition = definitions[identifier];
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

			sandbox = typeof sandbox === 'boolean' ? sandbox : null;


			if (sandbox !== null) {

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

				for (let type in tags) {

					let values = tags[type];
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

			type = typeof type === 'string' ? type : null;


			if (type !== null) {

				if (type === 'source' || type === 'export' || type === 'build') {

					this.type = type;

					for (let p = 0, pl = this.packages.length; p < pl; p++) {
						this.packages[p].setType(this.type);
					}

					return true;

				}

			}


			return false;

		}

	};


	Composite.displayName           = 'lychee.Environment';
	Composite.prototype.displayName = 'lychee.Environment';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


lychee.Package = typeof lychee.Package !== 'undefined' ? lychee.Package : (function(global) {

	const lychee = global.lychee;


	/*
	 * HELPERS
	 */

	const _resolve_root = function() {

		let root = this.root;
		let type = this.type;
		if (type === 'source') {
			root += '/source';
		} else if (type === 'export') {
			root += '/source';
		} else if (type === 'build') {
			root += '/build';
		}


		return root;

	};

	const _resolve_path = function(candidate) {

		let path = typeof candidate === 'string' ? candidate.split('/') : null;


		if (path !== null) {

			let type = this.type;
			if (type === 'export') {
				type = 'source';
			}


			let pointer = this.__config.buffer[type].files || null;
			if (pointer !== null) {

				for (let p = 0, pl = path.length; p < pl; p++) {

					let name = path[p];
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

	const _resolve_attachments = function(candidate) {

		let attachments = {};
		let path        = candidate.split('/');
		if (path.length > 0) {

			let pointer = this.__config.buffer.source.files || null;
			if (pointer !== null) {

				for (let pa = 0, pal = path.length; pa < pal; pa++) {

					let name = path[pa];
					if (pointer[name] !== undefined) {
						pointer = pointer[name];
					} else {
						pointer = null;
						break;
					}

				}


				if (pointer !== null && pointer instanceof Array) {

					let classpath = _resolve_root.call(this) + '/' + path.join('/');

					for (let po = 0, pol = pointer.length; po < pol; po++) {

						let type = pointer[po];
						if (type !== 'js') {
							attachments[type] = classpath + '.' + type;
						}

					}

				}

			}

		}


		return attachments;

	};

	const _resolve_candidates = function(id, tags) {

		tags = tags instanceof Object ? tags : null;


		let that          = this;
		let candidatepath = id.split('.').join('/');
		let candidates    = [];
		let filter_values = function(tags, tag) {

			return tags[tag].map(function(value) {
				return _resolve_tag.call(that, tag, value) + '/' + candidatepath;
			}).filter(function(path) {
				return _resolve_path.call(that, path);
			});

		};


		if (tags !== null) {

			for (let tag in tags) {

				let values = filter_values(tags, tag);
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

	const _resolve_tag = function(tag, value) {

		tag   = typeof tag === 'string'   ? tag   : null;
		value = typeof value === 'string' ? value : null;


		if (tag !== null && value !== null) {

			let type = this.type;
			if (type === 'export') {
				type = 'source';
			}


			let pointer = this.__config.buffer[type].tags || null;
			if (pointer !== null) {

				if (pointer[tag] instanceof Object) {

					let path = pointer[tag][value] || null;
					if (path !== null) {
						return path;
					}

				}

			}

		}


		return '';

	};

	const _load_candidate = function(id, candidates) {

		if (candidates.length > 0) {

			let map = {
				id:           id,
				candidate:    null,
				candidates:   [].concat(candidates),
				attachments:  [],
				dependencies: [],
				loading:      1
			};


			this.__requests[id] = map;


			let candidate = map.candidates.shift();

			while (candidate !== undefined) {

				if (this.__blacklist[candidate] === 1) {
					candidate = map.candidates.shift();
				} else {
					break;
				}

			}


			// Try to load the first suggested Candidate Implementation
			if (candidate !== undefined) {

				let url            = _resolve_root.call(this) + '/' + candidate + '.js';
				let implementation = new lychee.Asset(url, null, false);
				let attachments    = _resolve_attachments.call(this, candidate);

				if (implementation !== null) {
					_load_candidate_implementation.call(this, candidate, implementation, attachments, map);
				}

			}

		}

	};

	const _load_candidate_implementation = function(candidate, implementation, attachments, map) {

		let that       = this;
		let identifier = this.id + '.' + map.id;


		implementation.onload = function(result) {

			map.loading--;


			if (result === true) {

				let environment = that.environment;
				let definition  = environment.definitions[identifier] || null;
				if (definition !== null) {

					map.candidate = this;


					let attachmentIds = Object.keys(attachments);


					// Temporary delete definition from environment and re-define it after attachments are all loaded
					if (attachmentIds.length > 0) {

						delete environment.definitions[identifier];

						map.loading += attachmentIds.length;


						attachmentIds.forEach(function(assetId) {

							let url   = attachments[assetId];
							let asset = new lychee.Asset(url);
							if (asset !== null) {

								asset.onload = function(result) {

									map.loading--;

									let tmp = {};
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


					for (let i = 0, il = definition._includes.length; i < il; i++) {
						environment.load(definition._includes[i]);
					}

					for (let r = 0, rl = definition._requires.length; r < rl; r++) {
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

	let Composite = function(id, url) {

		id  = typeof id === 'string'  ? id  : 'app';
		url = typeof url === 'string' ? url : null;


		this.id   = id;
		this.url  = null;
		this.root = null;

		this.environment = null;
		this.type        = 'source';

		this.__blacklist = {};
		this.__config    = null;
		this.__requests  = {};


		if (url !== null) {

			let that = this;
			let tmp  = url.split('/');

			let file = tmp.pop();
			if (file === 'lychee.pkg') {

				this.root = tmp.join('/');
				this.url  = url;

				this.__config = new Config(this.url);
				this.__config.onload = function(result) {

					if (that.isReady() === false) {
						result = false;
					}


					if (result === true) {
						console.info('lychee.Package-' + that.id + ': Package at "' + this.url + '" ready.');
					} else {
						console.error('lychee.Package-' + that.id + ': Package at "' + this.url + '" corrupt.');
					}

				};
				this.__config.load();

			}

		}

	};


	Composite.prototype = {

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

			let ready  = false;
			let config = this.__config;

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

				let request = this.__requests[id] || null;
				if (request === null) {

					let candidates = _resolve_candidates.call(this, id, tags);
					if (candidates.length > 0) {

						_load_candidate.call(this, id, candidates);

						return true;

					} else {

						let info = Object.keys(tags).length > 0 ? ('(' + JSON.stringify(tags) + ')') : '';
						console.error('lychee.Package-' + this.id + ': Invalid Definition "' + id + '" ' + info);

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


	Composite.displayName           = 'lychee.Package';
	Composite.prototype.displayName = 'lychee.Package';


	return Composite;

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));


(function(lychee, global) {

	let _filename = null;



	/*
	 * FEATURE DETECTION
	 */

	(function(process, selfpath) {

		let cwd  = typeof process.cwd === 'function' ? process.cwd() : '';
		let tmp1 = selfpath.indexOf('/libraries/lychee');

		if (tmp1 !== -1) {
			lychee.ROOT.lychee = selfpath.substr(0, tmp1);
		}


		let tmp2 = selfpath.split('/').slice(0, 3).join('/');
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

	const _fs = require('fs');

	const _load_asset = function(settings, callback, scope) {

		settings = settings instanceof Object   ? settings : null;
		callback = callback instanceof Function ? callback : null;
		scope    = scope !== undefined          ? scope    : null;


		if (settings !== null && callback !== null && scope !== null) {

			let path     = lychee.environment.resolve(settings.url);
			let encoding = settings.encoding === 'binary' ? 'binary' : 'utf8';


			_fs.readFile(path, encoding, function(error, buffer) {

				let raw = null;
				if (!error) {
					raw = buffer;
				}

				try {
					callback.call(scope, raw);
				} catch (err) {
					lychee.Debugger.report(lychee.environment, err, null);
				}

			});

		}

	};



	/*
	 * POLYFILLS
	 */

	let _std_out = '';
	let _std_err = '';

	const _INDENT         = '    ';
	const _WHITESPACE     = new Array(512).fill(' ').join('');
	const _args_to_string = function(args, offset) {

		offset = typeof offset === 'number' ? offset : null;


		let output  = [];
		let columns = process.stdout.columns;

		for (let a = 0, al = args.length; a < al; a++) {

			let value = args[a];
			let o     = 0;

			if (value instanceof Object) {

				let tmp = [];

				try {

					let cache = [];

					tmp = JSON.stringify(value, function(key, value) {

						if (value instanceof Object) {

							if (cache.indexOf(value) === -1) {
								cache.push(value);
								return value;
							} else {
								return undefined;
							}

						} else {
							return value;
						}

					}, _INDENT).split('\n');

				} catch (err) {
				}

				if (tmp.length > 1) {

					for (let t = 0, tl = tmp.length; t < tl; t++) {
						output.push(tmp[t]);
					}

					o = output.length - 1;

				} else {

					let chunk = output[o];
					if (chunk === undefined) {
						output[o] = tmp[0].trim();
					} else {
						output[o] = (chunk + ' ' + tmp[0]).trim();
					}

				}

			} else if (typeof value === 'string' && value.includes('\n')) {

				let tmp = value.split('\n');

				for (let t = 0, tl = tmp.length; t < tl; t++) {
					output.push(tmp[t]);
				}

				o = output.length - 1;

			} else {

				let chunk = output[o];
				if (chunk === undefined) {
					output[o] = ('' + value).replace(/\t/g, _INDENT).trim();
				} else {
					output[o] = (chunk + (' ' + value).replace(/\t/g, _INDENT)).trim();
				}

			}

		}


		let ol = output.length;
		if (ol > 1) {

			if (offset !== null) {

				for (let o = 0; o < ol; o++) {

					let line = output[o];
					let maxl = (o === 0 || o === ol - 1) ? (columns - offset) : columns;
					if (line.length > maxl) {
						output[o] = line.substr(0, maxl);
					} else {
						output[o] = line + _WHITESPACE.substr(0, maxl - line.length);
					}

				}

			}


			return output.join('\n');

		} else {

			if (offset !== null) {

				let line = output[0];
				let maxl = columns - offset * 2;
				if (line.length > maxl) {
					line = line.substr(0, maxl);
				} else {
					line = line + _WHITESPACE.substr(0, maxl - line.length);
				}

				return line;

			}


			return output[0];

		}

	};

	console.clear = function() {

		// clear screen
		// process.stdout.write('\x1B[2J');

		// clear screen and reset cursor
		process.stdout.write('\x1B[2J\x1B[0f');

		// clear scroll buffer
		process.stdout.write('\u001b[3J');

	};

	console.log = function() {

		let al   = arguments.length;
		let args = [ '(L)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_out += _args_to_string(args) + '\n';

		process.stdout.write('\u001b[49m\u001b[97m ' + _args_to_string(args, 1) + ' \u001b[39m\u001b[49m\u001b[0m\n');

	};

	console.info = function() {

		let al   = arguments.length;
		let args = [ '(I)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_out += _args_to_string(args) + '\n';

		process.stdout.write('\u001b[42m\u001b[97m ' + _args_to_string(args, 1) + ' \u001b[39m\u001b[49m\u001b[0m\n');

	};

	console.warn = function() {

		let al   = arguments.length;
		let args = [ '(W)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_out += _args_to_string(args) + '\n';

		process.stdout.write('\u001b[43m\u001b[97m ' + _args_to_string(args, 1) + ' \u001b[39m\u001b[49m\u001b[0m\n');

	};

	console.error = function() {

		let al   = arguments.length;
		let args = [ '(E)' ];
		for (let a = 0; a < al; a++) {
			args.push(arguments[a]);
		}

		_std_err += _args_to_string(args) + '\n';

		process.stderr.write('\u001b[41m\u001b[97m ' + _args_to_string(args, 1) + ' \u001b[39m\u001b[49m\u001b[0m\n');

	};

	console.deserialize = function(blob) {

		if (typeof blob.stdout === 'string') {
			_std_out = blob.stdout;
		}

		if (typeof blob.stderr === 'string') {
			_std_err = blob.stderr;
		}

	};

	console.serialize = function() {

		let blob = {};


		if (_std_out.length > 0) blob.stdout = _std_out;
		if (_std_err.length > 0) blob.stderr = _std_err;


		return {
			'reference': 'console',
			'blob':      Object.keys(blob).length > 0 ? blob : null
		};

	};



	const _META_KEYCODE     = /^(?:\x1b)([a-zA-Z0-9])$/;
	const _FUNCTION_KEYCODE = /^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/;

	const _parse_keypress   = function(str) {

		let parts;


		if (Buffer.isBuffer(str)) {

			if (str[0] > 127 && str[1] === undefined) {
				str[0] -= 128;
				str = '\x1b' + str.toString('utf8');
			} else {
				str = str.toString('utf8');
			}

		}


		let key = {
			name:  null,
			ctrl:  false,
			meta:  false,
			shift: false
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

			let code = (parts[1] || '') + (parts[2] || '') + (parts[4] || '') + (parts[6] || '');
			let mod  = (parts[3] || parts[5] || 1) - 1;

			key.ctrl = !!(mod & 4);
			key.meta = !!(mod & 10);
			key.shift = !!(mod & 1);


			// Parse the key itself
			switch (code) {

				// xterm ESC O letter
				case 'OP':   key.name = 'f1'; break;
				case 'OQ':   key.name = 'f2'; break;
				case 'OR':   key.name = 'f3'; break;
				case 'OS':   key.name = 'f4'; break;

				// xterm ESC [ number ~
				case '[11~': key.name = 'f1'; break;
				case '[12~': key.name = 'f2'; break;
				case '[13~': key.name = 'f3'; break;
				case '[14~': key.name = 'f4'; break;

				// Cygwin/libuv
				case '[[A':  key.name = 'f1'; break;
				case '[[B':  key.name = 'f2'; break;
				case '[[C':  key.name = 'f3'; break;
				case '[[D':  key.name = 'f4'; break;
				case '[[E':  key.name = 'f5'; break;

				// common
				case '[15~': key.name = 'f5';  break;
				case '[17~': key.name = 'f6';  break;
				case '[18~': key.name = 'f7';  break;
				case '[19~': key.name = 'f8';  break;
				case '[20~': key.name = 'f9';  break;
				case '[21~': key.name = 'f10'; break;
				case '[23~': key.name = 'f11'; break;
				case '[24~': key.name = 'f12'; break;

				// xterm ESC [ letter
				case '[A':   key.name = 'up';    break;
				case '[B':   key.name = 'down';  break;
				case '[C':   key.name = 'right'; break;
				case '[D':   key.name = 'left';  break;
				case '[E':   key.name = 'clear'; break;
				case '[F':   key.name = 'end';   break;
				case '[H':   key.name = 'home';  break;

				// xterm ESC O letter
				case 'OA':   key.name = 'up';    break;
				case 'OB':   key.name = 'down';  break;
				case 'OC':   key.name = 'right'; break;
				case 'OD':   key.name = 'left';  break;
				case 'OE':   key.name = 'clear'; break;
				case 'OF':   key.name = 'end';   break;
				case 'OH':   key.name = 'home';  break;

				// xterm ESC [ number ~
				case '[1~':  key.name = 'home';     break;
				case '[2~':  key.name = 'insert';   break;
				case '[3~':  key.name = 'delete';   break;
				case '[4~':  key.name = 'end';      break;
				case '[5~':  key.name = 'pageup';   break;
				case '[6~':  key.name = 'pagedown'; break;

				// Putty
				case '[[5~': key.name = 'pageup';   break;
				case '[[6~': key.name = 'pagedown'; break;

				// misc.
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

	let _audio_supports_ogg = false;
	let _audio_supports_mp3 = false;

	(function() {

		let consol  = 'console' in global;
		let audio   = false;
		let buffer  = true;
		let image   = false;


		if (lychee.debug === true) {

			let methods = [];

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

		callback = callback instanceof Function ? callback : null;


		let clone = new Buffer(this.length);

		if (callback !== null) {

			for (let b = 0; b < this.length; b++) {
				clone[b] = callback(this[b], b);
			}

		} else {

			for (let b = 0; b < this.length; b++) {
				clone[b] = this[b];
			}

		}

		return clone;

	};




	/*
	 * CONFIG IMPLEMENTATION
	 */

	const _CONFIG_CACHE = {};

	const _clone_config = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer = JSON.parse(JSON.stringify(origin.buffer));

			clone.__load = false;

		}

	};


	const Config = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url    = url;
		this.onload = null;
		this.buffer = null;

		this.__load = true;


		if (url !== null) {

			if (_CONFIG_CACHE[url] !== undefined) {
				_clone_config(_CONFIG_CACHE[url], this);
			} else {
				_CONFIG_CACHE[url] = this;
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

			let blob = {};


			if (this.buffer !== null) {
				blob.buffer = 'data:application/json;base64,' + new Buffer(JSON.stringify(this.buffer, null, '\t'), 'utf8').toString('base64');
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

				let data = null;
				try {
					data = JSON.parse(raw);
				} catch (err) {
				}


				this.buffer = data;


				if (data === null) {
					console.warn('bootstrap.js: Invalid Config at "' + this.url + '" (No JSON file).');
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

	const _parse_font = function() {

		let data = this.__buffer;

		if (typeof data.kerning === 'number' && typeof data.spacing === 'number') {

			if (data.kerning > data.spacing) {
				data.kerning = data.spacing;
			}

		}


		if (data.texture !== undefined) {

			let texture = new Texture(data.texture);
			let that    = this;

			texture.onload = function() {
				that.texture = this;
			};

			texture.load();

		} else {

			console.warn('bootstrap.js: Invalid Font at "' + this.url + '" (No FNT file).');

		}


		this.baseline   = typeof data.baseline === 'number'   ? data.baseline   : this.baseline;
		this.charset    = typeof data.charset === 'string'    ? data.charset    : this.charset;
		this.lineheight = typeof data.lineheight === 'number' ? data.lineheight : this.lineheight;
		this.kerning    = typeof data.kerning === 'number'    ? data.kerning    : this.kerning;
		this.spacing    = typeof data.spacing === 'number'    ? data.spacing    : this.spacing;


		if (data.font instanceof Object) {

			this.__font.color   = data.font.color   || '#ffffff';
			this.__font.family  = data.font.family  || 'Ubuntu Mono';
			this.__font.outline = data.font.outline || 0;
			this.__font.size    = data.font.size    || 16;
			this.__font.style   = data.font.style   || 'normal';

		}


		_parse_font_characters.call(this);

	};

	const _parse_font_characters = function() {

		let data = this.__buffer;
		let url  = this.url;

		if (_CHAR_CACHE[url] === undefined) {
			_CHAR_CACHE[url] = {};
		}

		if (data.map instanceof Array) {

			let offset = this.spacing;

			for (let c = 0, cl = this.charset.length; c < cl; c++) {

				let id  = this.charset[c];
				let chr = {
					width:      data.map[c] + this.spacing * 2,
					height:     this.lineheight,
					realwidth:  data.map[c],
					realheight: this.lineheight,
					x:          offset - this.spacing,
					y:          0
				};

				offset += chr.width;

				_CHAR_CACHE[url][id] = chr;

			}

		}

	};


	const _CHAR_CACHE = {};
	const _FONT_CACHE = {};

	const _clone_font = function(origin, clone) {

		if (origin.__buffer !== null) {

			clone.__buffer = origin.__buffer;
			clone.__load   = false;

			_parse_font.call(clone);

		}

	};


	const Font = function(url) {

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
		this.__font     = {
			color:   '#ffffff',
			family:  'Ubuntu Mono',
			outline: 0,
			size:    16,
			style:   'normal'
		};
		this.__load     = true;


		if (url !== null) {

			if (_CHAR_CACHE[url] === undefined) {

				_CHAR_CACHE[url]     = {};
				_CHAR_CACHE[url][''] = {
					width:      0,
					height:     this.lineheight,
					realwidth:  0,
					realheight: this.lineheight,
					x:          0,
					y:          0
				};

			}


			if (_FONT_CACHE[url] !== undefined) {
				_clone_font(_FONT_CACHE[url], this);
			} else {
				_FONT_CACHE[url] = this;
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

			let blob = {};


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


			let buffer = this.__buffer;
			if (buffer !== null) {

				// Cache Usage
				if (this.__load === false) {

					let cache = _CHAR_CACHE[this.url] || null;
					if (cache !== null) {

						let tl = text.length;
						if (tl === 1) {

							if (cache[text] !== undefined) {
								return cache[text];
							}

						} else if (tl > 1) {

							let data = cache[text] || null;
							if (data === null) {

								let width = 0;
								let map   = buffer.map;

								for (let t = 0; t < tl; t++) {

									let m = this.charset.indexOf(text[t]);
									if (m !== -1) {
										width += map[m] + this.kerning;
									}

								}

								if (width > 0) {

									// TODO: Embedded Font ligatures will set x and y values based on settings.map
									data = cache[text] = {
										width:      width,
										height:     this.lineheight,
										realwidth:  width,
										realheight: this.lineheight,
										x:          0,
										y:          0
									};

								}

							}


							return data;

						}


						return cache[''];

					}

				// Temporary Usage
				} else {

					let tl = text.length;
					if (tl === 1) {

						let m = this.charset.indexOf(text);
						if (m !== -1) {

							let offset  = this.spacing;
							let spacing = this.spacing;
							let map     = buffer.map;

							for (let c = 0; c < m; c++) {
								offset += map[c] + spacing * 2;
							}

							return {
								width:      map[m] + spacing * 2,
								height:     this.lineheight,
								realwidth:  map[m],
								realheight: this.lineheight,
								x:          offset - spacing,
								y:          0
							};

						}

					} else if (tl > 1) {

						let width = 0;
						let map   = buffer.map;

						for (let t = 0; t < tl; t++) {

							let m = this.charset.indexOf(text[t]);
							if (m !== -1) {
								width += map[m] + this.kerning;
							}

						}

						if (width > 0) {

							return {
								width:      width,
								height:     this.lineheight,
								realwidth:  width,
								realheight: this.lineheight,
								x:          0,
								y:          0
							};

						}

					}


					return {
						width:      0,
						height:     this.lineheight,
						realwidth:  0,
						realheight: this.lineheight,
						x:          0,
						y:          0
					};

				}

			}


			return null;

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

				let data = null;
				try {
					data = JSON.parse(raw);
				} catch (err) {
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

	const _MUSIC_CACHE = {};

	const _clone_music = function(origin, clone) {

		if (origin.__buffer.ogg !== null || origin.__buffer.mp3 !== null) {

			clone.__buffer.ogg = origin.__buffer.ogg;
			clone.__buffer.mp3 = origin.__buffer.mp3;
			clone.__load       = false;

		}

	};


	const Music = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;
		this.volume   = 0.0;
		this.isIdle   = true;

		this.__buffer = { ogg: null, mp3: null };
		this.__load   = true;


		if (url !== null) {

			if (_MUSIC_CACHE[url] !== undefined) {
				_clone_music(_MUSIC_CACHE[url], this);
			} else {
				_MUSIC_CACHE[url] = this;
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

			let blob = {};


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

	const _SOUND_CACHE = {};

	const _clone_sound = function(origin, clone) {

		if (origin.__buffer.ogg !== null || origin.__buffer.mp3 !== null) {

			clone.__buffer.ogg = origin.__buffer.ogg;
			clone.__buffer.mp3 = origin.__buffer.mp3;
			clone.__load       = false;

		}

	};


	const Sound = function(url) {

		url = typeof url === 'string' ? url : null;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;
		this.volume   = 0.0;
		this.isIdle   = true;

		this.__buffer = { ogg: null, mp3: null };
		this.__load   = true;


		if (url !== null) {

			if (_SOUND_CACHE[url] !== undefined) {
				_clone_sound(_SOUND_CACHE[url], this);
			} else {
				_SOUND_CACHE[url] = this;
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

			let blob = {};


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

	let   _TEXTURE_ID    = 0;
	const _TEXTURE_CACHE = {};

	const _parse_texture = function(data) {

		this.width  = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3];
		this.height = (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7];

	};

	const _clone_texture = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.id     = origin.id;

			clone.buffer = origin.buffer;
			clone.width  = origin.width;
			clone.height = origin.height;

			clone.__load = false;

		}

	};


	const Texture = function(url) {

		url = typeof url === 'string' ? url : null;


		this.id     = _TEXTURE_ID++;
		this.url    = url;
		this.onload = null;
		this.buffer = null;
		this.width  = 0;
		this.height = 0;

		this.__load = true;


		if (url !== null && url.substr(0, 10) !== 'data:image') {

			if (_TEXTURE_CACHE[url] !== undefined) {
				_clone_texture(_TEXTURE_CACHE[url], this);
			} else {
				_TEXTURE_CACHE[url] = this;
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

			let blob = {};


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


			let url = this.url;
			if (url.substr(0, 5) === 'data:') {

				if (url.substr(0, 15) === 'data:image/png;') {

					let b64data = url.substr(15, url.length - 15);
					this.buffer = new Buffer(b64data, 'base64');
					this.__load = false;

					_parse_texture.call(this, this.buffer.slice(16, 24));


					let is_power_of_two = (this.width & (this.width - 1)) === 0 && (this.height & (this.height - 1)) === 0;
					if (lychee.debug === true && is_power_of_two === false) {
						console.warn('bootstrap.js: Texture at data:image/png; is NOT power-of-two');
					}

				} else {

					console.warn('bootstrap.js: Invalid Texture at "' + url.substr(0, 15) + '" (No PNG file).');

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


						let is_power_of_two = (this.width & (this.width - 1)) === 0 && (this.height & (this.height - 1)) === 0;
						if (lychee.debug === true && is_power_of_two === false) {
							console.warn('bootstrap.js: Texture at "' + this.url + '" is NOT power-of-two');
						}


						if (this.onload instanceof Function) {
							this.onload(raw !== null);
							this.onload = null;
						}

					}, this);

				} else {

					console.warn('bootstrap.js: Invalid Texture at "' + this.url + '" (No PNG file).');


					if (this.onload instanceof Function) {
						this.onload(false);
						this.onload = null;
					}

				}

			}

		}

	};



	/*
	 * STUFF IMPLEMENTATION
	 */

	const _STUFF_CACHE = {};

	const _clone_stuff = function(origin, clone) {

		if (origin.buffer !== null) {

			clone.buffer = origin.buffer;

			clone.__load = false;

		}

	};

	const _execute_stuff = function(callback, stuff) {

		let type = stuff.url.split('/').pop().split('.').pop();
		if (type === 'js' && stuff.__ignore === false) {

			_filename = stuff.url;


			let cid = lychee.environment.resolve(stuff.url);
			if (require.cache[cid] !== undefined) {
				delete require.cache[cid];
			}

			try {
				require(cid);
			} catch (err) {
				lychee.Debugger.report(lychee.environment, err, stuff);
			}


			_filename = null;


			callback.call(stuff, true);

		} else {

			callback.call(stuff, true);

		}

	};


	const Stuff = function(url, ignore) {

		url    = typeof url === 'string' ? url : null;
		ignore = ignore === true;


		this.url      = url;
		this.onload   = null;
		this.buffer   = null;

		this.__ignore = ignore;
		this.__load   = true;


		if (url !== null) {

			if (_STUFF_CACHE[url] !== undefined) {
				_clone_stuff(_STUFF_CACHE[url], this);
			} else {
				_STUFF_CACHE[url] = this;
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

			let blob = {};
			let type = this.url.split('/').pop().split('.').pop();
			let mime = 'application/octet-stream';


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
	 * FEATURES
	 */

	const _FEATURES = {

		require: function(id) {

			if (id === 'child_process') return {};
			if (id === 'fs')            return {};
			if (id === 'http')          return {};
			if (id === 'https')         return {};
			if (id === 'net')           return {};
			if (id === 'path')          return {};


			throw new Error('Cannot find module \'' + id + '\'');

		},

		process: {
			env: {
				APPDATA: null,
				HOME:    '/home/dev'
			},
			stdin: {
				on: function() {}
			},
			stdout: {
				on:    function() {},
				write: function() {}
			}
		},

		clearInterval: function() {},
		clearTimeout:  function() {},
		setInterval:   function() {},
		setTimeout:    function() {}

	};


	Object.defineProperty(lychee.Environment, '__FEATURES', {

		get: function() {
			return _FEATURES;
		},

		set: function(value) {
			return false;
		}

	});



	/*
	 * EXPORTS
	 */

	// global.Buffer  = Buffer; // Not necessary, node.js data type
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

		let stream      = process.stdin;
		let is_emitting = stream._emitsKeypress === true;
		if (is_emitting === false) {

			// Note: This fixes issues with running IOJS with nohup
			if (stream.isTTY === true) {

				stream._emitsKeypress = true;

				stream.setEncoding('utf8');
				stream.setRawMode(true);
				stream.resume();

				stream.on('data', function(data) {

					if (this.listeners('keypress').length > 0) {

						let key = _parse_keypress(data);
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

	if (
		typeof global.process !== 'undefined'
		&& typeof global.process.stdin === 'object'
		&& typeof global.process.stdin.on === 'function'
	) {
		return true;
	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _process   = global.process;
	const _Emitter   = lychee.import('lychee.event.Emitter');
	const _INSTANCES = [];



	/*
	 * EVENTS
	 */

	const _listeners = {

		keypress: function(key) {

			// TTY conform behaviour
			if (key.ctrl === true && key.name === 'c') {

				key.name  = 'escape';
				key.ctrl  = false;
				key.alt   = false;
				key.shift = false;

			}


			for (let i = 0, l = _INSTANCES.length; i < l; i++) {
				_process_key.call(_INSTANCES[i], key.name, key.ctrl, key.meta, key.shift);
			}

		}

	};



	/*
	 * FEATURE DETECTION
	 */

	(function() {

		let keypress = true;
		if (keypress === true) {
			_process.stdin.on('keypress', _listeners.keypress);
		}


		if (lychee.debug === true) {

			let methods = [];

			if (keypress) methods.push('Keyboard');

			if (methods.length === 0) {
				console.error('lychee.Input: Supported methods are NONE');
			} else {
				console.info('lychee.Input: Supported methods are ' + methods.join(', '));
			}

		}

	})();



	/*
	 * HELPERS
	 */

	const _process_key = function(key, ctrl, alt, shift) {

		if (this.key === false) {

			return false;

		} else if (this.keymodifier === false) {

			if (key === 'ctrl' || key === 'meta' || key === 'shift') {
				return true;
			}

		}


		let name    = '';
		let handled = false;
		let delta   = Date.now() - this.__clock.key;

		if (delta < this.delay) {
			return true;
		} else {
			this.__clock.key = Date.now();
		}


		// 0. Computation: Normal Characters
		if (ctrl  === true) name += 'ctrl-';
		if (alt   === true) name += 'alt-';
		if (shift === true) name += 'shift-';

		name += key.toLowerCase();


		// 1. Event API
		if (key !== null) {

			// allow bind('key') and bind('ctrl-a');

			handled = this.trigger('key', [ key, name, delta ]) || handled;
			handled = this.trigger(name,  [ delta ])            || handled;

		}


		return handled;

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({}, data);


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


		_Emitter.call(this);

		_INSTANCES.push(this);

		settings = null;

	};


	Composite.prototype = {

		destroy: function() {

			let found = false;

			for (let i = 0, il = _INSTANCES.length; i < il; i++) {

				if (_INSTANCES[i] === this) {
					_INSTANCES.splice(i, 1);
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

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.Input';

			let settings = {};


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

			key = typeof key === 'boolean' ? key : null;


			if (key !== null) {

				this.key = key;

				return true;

			}


			return false;

		},

		setKeyModifier: function(keymodifier) {

			keymodifier = typeof keymodifier === 'boolean' ? keymodifier : null;


			if (keymodifier !== null) {

				this.keymodifier = keymodifier;

				return true;

			}


			return false;

		},

		setTouch: function(touch) {

			touch = typeof touch === 'boolean' ? touch : null;


			if (touch !== null) {

				// XXX: No touch support

			}


			return false;

		},

		setScroll: function(scroll) {

			scroll = typeof scroll === 'boolean' ? scroll : null;


			if (scroll !== null) {

				// XXX: No scroll support

			}


			return false;

		},

		setSwipe: function(swipe) {

			swipe = typeof swipe === 'boolean' ? swipe : null;


			if (swipe !== null) {

				// XXX: No swipe support

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('Renderer').tags({
	platform: 'node'
}).supports(function(lychee, global) {

	if (
		typeof global.process !== 'undefined'
		&& typeof global.process.stdout === 'object'
		&& typeof global.process.stdout.write === 'function'
	) {
		return true;
	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _process = global.process;
	let   _id      = 0;



	/*
	 * HELPERS
	 */

	const _draw_ctx = function(x, y, value) {

		let max_x = (this[0] || '').length;
		let max_y = (this    || '').length;

		if (x >= 0 && x < max_x && y >= 0 && y < max_y) {
			this[y][x] = value;
		}

	};

	const _Buffer = function(width, height) {

		this.width  = typeof width === 'number'  ? width  : 1;
		this.height = typeof height === 'number' ? height : 1;


		this.__ctx = [];


		this.resize(this.width, this.height);

	};

	_Buffer.prototype = {

		clear: function() {

			let ctx    = this.__ctx;
			let width  = this.width;
			let height = this.height;

			for (let y = 0; y < height; y++) {

				for (let x = 0; x < width; x++) {
					ctx[y][x] = ' ';
				}

			}

		},

		resize: function(width, height) {

			this.width  = width;
			this.height = height;


			this.__ctx = [];


			for (let y = 0; y < this.height; y++) {

				let line = new Array(this.width);
				for (let x = 0; x < this.width; x++) {
					line[x] = ' ';
				}

				this.__ctx.push(line);

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({}, data);


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


	Composite.prototype = {

		destroy: function() {

			return true;

		},



		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let settings = {};


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

					return true;

				}

			}


			return false;

		},

		setBackground: function(color) {

			color = /(#[AaBbCcDdEeFf0-9]{6})/g.test(color) ? color : null;


			if (color !== null) {

				this.background = color;

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

		setWidth: function(width) {

			width = typeof width === 'number' ? width : null;


			if (width !== null) {
				this.width = width;
			} else {
				this.width = _process.stdout.columns - 1;
			}


			this.__buffer.resize(this.width, this.height);
			this.__ctx = this.__buffer.__ctx;
			this.offset.x = 0;


			return true;

		},

		setHeight: function(height) {

			height = typeof height === 'number' ? height : null;


			if (height !== null) {
				this.height = height;
			} else {
				this.height = _process.stdout.rows - 1;
			}


			this.__buffer.resize(this.width, this.height);
			this.__ctx = this.__buffer.__ctx;
			this.offset.y = 0;


			return true;

		},



		/*
		 * BUFFER INTEGRATION
		 */

		clear: function(buffer) {

			buffer = buffer instanceof _Buffer ? buffer : null;


			if (buffer !== null) {

				buffer.clear();

			} else {

				_process.stdout.write('\u001B[2J\u001B[0;0f');

				this.__buffer.clear();

			}


			return true;

		},

		flush: function() {

			let ctx = this.__ctx;

			let line = ctx[0] || '';
			let info = this.width + 'x' + this.height;

			for (let i = 0; i < info.length; i++) {
				line[i] = info[i];
			}

			for (let y = 0; y < this.height; y++) {
				_process.stdout.write(ctx[y].join('') + '\n');
			}

			return true;

		},

		createBuffer: function(width, height) {

			width  = typeof width === 'number'  ? width  : 1;
			height = typeof height === 'number' ? height : 1;


			return new _Buffer(width, height);

		},

		setBuffer: function(buffer) {

			buffer = buffer instanceof _Buffer ? buffer : null;


			if (buffer !== null) {
				this.__ctx = buffer.__ctx;
			} else {
				this.__ctx = this.__buffer.__ctx;
			}


			return true;

		},



		/*
		 * DRAWING API
		 */

		drawArc: function(x, y, start, end, radius, color, background, lineWidth) {

			x          = x | 0;
			y          = y | 0;
			radius     = radius | 0;
			start      = typeof start === 'number'              ? start     : 0;
			end        = typeof end === 'number'                ? end       : 2;
			color      = /(#[AaBbCcDdEeFf0-9]{6})/g.test(color) ? color     : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number'          ? lineWidth : 1;


			// TODO: Implement arc-drawing ASCII art algorithm
			// let ctx = this.__ctx;
			// let pi2 = Math.PI * 2;


			return false;

		},

		drawBox: function(x1, y1, x2, y2, color, background, lineWidth) {

			if (this.alpha < 0.5) return;

			x1         = x1 | 0;
			y1         = y1 | 0;
			x2         = x2 | 0;
			y2         = y2 | 0;
			color      = /(#[AaBbCcDdEeFf0-9]{6})/g.test(color) ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			let ctx = this.__ctx;
			let x = 0;
			let y = 0;


			if (background === true) {

				for (x = x1 + 1; x < x2; x++) {

					for (y = y1 + 1; y < y2; y++) {
						_draw_ctx.call(ctx, x, y, '+');
					}

				}

			}


			// top - right - bottom - left

			y = y1;
			for (x = x1 + 1; x < x2; x++) {
				_draw_ctx.call(ctx, x, y, '-');
			}

			x = x2;
			for (y = y1 + 1; y < y2; y++) {
				_draw_ctx.call(ctx, x, y, '|');
			}

			y = y2;
			for (x = x1 + 1; x < x2; x++) {
				_draw_ctx.call(ctx, x, y, '-');
			}

			x = x1;
			for (y = y1 + 1; y < y2; y++) {
				_draw_ctx.call(ctx, x, y, '|');
			}


			return true;

		},

		drawBuffer: function(x1, y1, buffer, map) {

			x1     = x1 | 0;
			y1     = y1 | 0;
			buffer = buffer instanceof _Buffer ? buffer : null;
			map    = map instanceof Object     ? map    : null;


			if (buffer !== null) {

				let ctx    = this.__ctx;
				let width  = 0;
				let height = 0;
				let x      = 0;
				let y      = 0;
				let r      = 0;


				// XXX: No support for alpha :(

				if (map === null) {

					width  = buffer.width;
					height = buffer.height;

					let x2 = Math.min(x1 + width,  this.__buffer.width);
					let y2 = Math.min(y1 + height, this.__buffer.height);

					for (let cy = y1; cy < y2; cy++) {

						for (let cx = x1; cx < x2; cx++) {
							ctx[cy][cx] = buffer.__ctx[cy - y1][cx - x1];
						}

					}

				} else {

					width  = map.w;
					height = map.h;
					x      = map.x;
					y      = map.y;
					r      = map.r || 0;

					if (r === 0) {

						let x2 = Math.min(x1 + width,  this.__buffer.width);
						let y2 = Math.min(y1 + height, this.__buffer.height);

						for (let cy = y1; cy < y2; cy++) {

							for (let cx = x1; cx < x2; cx++) {
								ctx[cy][cx] = buffer.__ctx[cy - y1 + y][cx - x1 + x];
							}

						}

					} else {

						// XXX: No support for rotation

					}

				}

			}


			return true;

		},

		drawCircle: function(x, y, radius, color, background, lineWidth) {

			x          = x | 0;
			y          = y | 0;
			radius     = radius | 0;
			color      = /(#[AaBbCcDdEeFf0-9]{6})/g.test(color) ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			// TODO: Implement circle-drawing ASCII art algorithm
			// let ctx = this.__ctx;


			return true;

		},

		drawLine: function(x1, y1, x2, y2, color, lineWidth) {

			x1        = x1 | 0;
			y1        = y1 | 0;
			x2        = x2 | 0;
			y2        = y2 | 0;
			color     = /(#[AaBbCcDdEeFf0-9]{6})/g.test(color) ? color : '#000000';
			lineWidth = typeof lineWidth === 'number' ? lineWidth : 1;


			// TODO: Implement line-drawing ASCII art algorithm
			// let ctx = this.__ctx;


			return false;

		},

		drawTriangle: function(x1, y1, x2, y2, x3, y3, color, background, lineWidth) {

			x1         = x1 | 0;
			y1         = y1 | 0;
			x2         = x2 | 0;
			y2         = y2 | 0;
			x3         = x3 | 0;
			y3         = y3 | 0;
			color      = /(#[AaBbCcDdEeFf0-9]{6})/g.test(color) ? color : '#000000';
			background = background === true;
			lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


			// TODO: Implement triangle-drawing ASCII art algorithm
			// let ctx = this.__ctx;


			return false;

		},

		// points, x1, y1, [ ... x(a), y(a) ... ], [ color, background, lineWidth ]
		drawPolygon: function(points, x1, y1) {

			points = typeof points === 'number' ? points : 0;
			x1     = x1 | 0;
			y1     = y1 | 0;


			// TODO: Implement polygon-drawing ASCII art algorithm
			// let l = arguments.length;

			// if (points > 3) {

				// let optargs = l - (points * 2) - 1;


				// let color, background, lineWidth;

				// if (optargs === 3) {

				// 	color      = arguments[l - 3];
				// 	background = arguments[l - 2];
				// 	lineWidth  = arguments[l - 1];

				// } else if (optargs === 2) {

				// 	color      = arguments[l - 2];
				// 	background = arguments[l - 1];

				// } else if (optargs === 1) {

				// 	color      = arguments[l - 1];

				// }


				// x1         = x1 | 0;
				// y1         = y1 | 0;
				// color      = /(#[AaBbCcDdEeFf0-9]{6})/g.test(color) ? color : '#000000';
				// background = background === true;
				// lineWidth  = typeof lineWidth === 'number' ? lineWidth : 1;


				// let ctx = this.__ctx;

			// }


			return false;

		},

		drawSprite: function(x1, y1, texture, map) {

			x1      = x1 | 0;
			y1      = y1 | 0;
			texture = texture instanceof Texture ? texture : null;
			map     = map instanceof Object      ? map     : null;


			if (texture !== null && texture.buffer !== null) {

				// TODO: Implement sprite-drawing ASCII art algorithm
				// if (map === null) {

				// } else {

				// }

			}


			return false;

		},

		drawText: function(x1, y1, text, font, center) {

			x1     = x1 | 0;
			y1     = y1 | 0;
			text   = typeof text === 'string' ? text : null;
			font   = font instanceof Font     ? font : null;
			center = center === true;


			if (font !== null) {

				if (center === true) {

					let dim = font.measure(text);

					x1 = (x1 - dim.realwidth / 2) | 0;
					y1 = (y1 - (dim.realheight - font.baseline) / 2) | 0;

				}


				y1 = (y1 - font.baseline / 2) | 0;


				let ctx = this.__ctx;

				let margin  = 0;
				let texture = font.texture;
				if (texture !== null && texture.buffer !== null) {

					for (let t = 0, l = text.length; t < l; t++) {

						let chr = font.measure(text[t]);

						let x = x1 + margin - font.spacing;
						let y = y1;


						_draw_ctx.call(ctx, x, y, text[t]);


						margin += chr.realwidth + font.kerning;

					}


					return true;

				}

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('Stash').tags({
	platform: 'node'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof global.require === 'function') {

		try {

			global.require('fs');

			return true;

		} catch (err) {

		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	let   _id         = 0;
	const _Emitter    = lychee.import('lychee.event.Emitter');
	const _PERSISTENT = {
		data: {},
		read: function() {
			return null;
		},
		write: function(id, asset) {
			return false;
		}
	};
	const _TEMPORARY  = {
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

		const _ENCODING = {
			'Config':  'utf8',
			'Font':    'utf8',
			'Music':   'binary',
			'Sound':   'binary',
			'Texture': 'binary',
			'Stuff':   'utf8'
		};


		const _fs      = global.require('fs');
		const _path    = global.require('path');
		const _mkdir_p = function(path, mode) {

			if (mode === undefined) {
				mode = 0o777 & (~process.umask());
			}


			let is_directory = false;

			try {

				is_directory = _fs.lstatSync(path).isDirectory();

			} catch (err) {

				if (err.code === 'ENOENT') {

					if (_mkdir_p(_path.dirname(path), mode) === true) {

						try {
							_fs.mkdirSync(path, mode);
						} catch (err) {
						}

					}

					try {
						is_directory = _fs.lstatSync(path).isDirectory();
					} catch (err) {
					}

				}

			}


			return is_directory;

		};


		let unlink = 'unlinkSync' in _fs;
		let write  = 'writeFileSync' in _fs;
		if (unlink === true && write === true) {

			_PERSISTENT.write = function(id, asset) {

				let result = false;


				let path = lychee.environment.resolve(id);
				if (path.substr(0, lychee.ROOT.project.length) === lychee.ROOT.project) {

					if (asset !== null) {

						let dir = path.split('/').slice(0, -1).join('/');
						if (dir.substr(0, lychee.ROOT.project.length) === lychee.ROOT.project) {
							_mkdir_p(dir);
						}


						let data = lychee.serialize(asset);
						if (data !== null && data.blob !== null && typeof data.blob.buffer === 'string') {

							let encoding = _ENCODING[data.constructor] || _ENCODING['Stuff'];
							let index    = data.blob.buffer.indexOf('base64,') + 7;
							if (index > 7) {

								let buffer = new Buffer(data.blob.buffer.substr(index, data.blob.buffer.length - index), 'base64');

								try {
									_fs.writeFileSync(path, buffer, encoding);
									result = true;
								} catch (err) {
									result = false;
								}

							}

						}

					} else {

						try {
							_fs.unlinkSync(path);
							result = true;
						} catch (err) {
							result = false;
						}

					}

				}


				return result;

			};

		}


		if (lychee.debug === true) {

			let methods = [];

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

	const _validate_asset = function(asset) {

		if (asset instanceof Object && typeof asset.serialize === 'function') {
			return true;
		}

		return false;

	};

	const _on_batch_remove = function(stash, others) {

		let keys = Object.keys(others);

		for (let k = 0, kl = keys.length; k < kl; k++) {

			let key   = keys[k];
			let index = this.load.indexOf(key);
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

	const _on_batch_write = function(stash, others) {

		let keys = Object.keys(others);

		for (let k = 0, kl = keys.length; k < kl; k++) {

			let key   = keys[k];
			let index = this.load.indexOf(key);
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

	const _read_stash = function(silent) {

		silent = silent === true;


		let blob = null;


		let type = this.type;
		if (type === Composite.TYPE.persistent) {

			blob = _PERSISTENT.read();

		} else if (type === Composite.TYPE.temporary) {

			blob = _TEMPORARY.read();

		}


		if (blob !== null) {

			if (Object.keys(this.__assets).length !== Object.keys(blob).length) {

				this.__assets = {};

				for (let id in blob) {
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

	const _write_stash = function(silent) {

		silent = silent === true;


		let operations = this.__operations;
		let filtered   = {};

		if (operations.length !== 0) {

			while (operations.length > 0) {

				let operation = operations.shift();
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


			let type = this.type;
			if (type === Composite.TYPE.persistent) {

				for (let id in filtered) {
					_PERSISTENT.write(id, filtered[id]);
				}

			} else if (type === Composite.TYPE.temporary) {

				for (let id in filtered) {
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

	let Composite = function(data) {

		let settings = Object.assign({}, data);


		this.id   = 'lychee-Stash-' + _id++;
		this.type = Composite.TYPE.persistent;


		this.__assets     = {};
		this.__operations = [];


		this.setId(settings.id);
		this.setType(settings.type);


		_Emitter.call(this);



		/*
		 * INITIALIZATION
		 */

		_read_stash.call(this);


		settings = null;

	};


	Composite.TYPE = {
		persistent: 0,
		temporary:  1
	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		sync: function(silent) {

			silent = silent === true;


			let result = false;


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

				for (let id in blob.assets) {
					this.__assets[id] = lychee.deserialize(blob.assets[id]);
				}

			}

		},

		serialize: function() {

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.Stash';

			let settings = {};
			let blob     = (data['blob'] || {});


			if (this.id.substr(0, 13) !== 'lychee-Stash-') settings.id   = this.id;
			if (this.type !== Composite.TYPE.persistent)   settings.type = this.type;


			if (Object.keys(this.__assets).length > 0) {

				blob.assets = {};

				for (let id in this.__assets) {
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

				let cache  = {
					load:  [].slice.call(ids),
					ready: []
				};


				let result = true;
				let that   = this;

				if (action === 'read') {

					for (let i = 0, il = ids.length; i < il; i++) {

						let asset = this.read(ids[i]);
						if (asset !== null) {

							asset.onload = function(result) {

								let index = cache.load.indexOf(this.url);
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

					for (let i = 0, il = ids.length; i < il; i++) {

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

					for (let i = 0, il = ids.length; i < il; i++) {

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

				let asset = new lychee.Asset(id, null, true);
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

			id    = typeof id === 'string'          ? id    : null;
			asset = _validate_asset(asset) === true ? asset : null;


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

			type = lychee.enumof(Composite.TYPE, type) ? type : null;


			if (type !== null) {

				this.type = type;

				return true;

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('Storage').tags({
	platform: 'node'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof global.require === 'function') {

		try {

			global.require('fs');

			return true;

		} catch (err) {

		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	let   _id         = 0;
	const _Emitter    = lychee.import('lychee.event.Emitter');
	const _JSON       = {
		encode: JSON.stringify,
		decode: JSON.parse
	};
	const _PERSISTENT = {
		data: {},
		read: function() {
			return false;
		},
		write: function() {
			return false;
		}
	};
	const _TEMPORARY  = {
		data: {},
		read: function() {
			return true;
		},
		write: function() {
			return true;
		}
	};



	/*
	 * FEATURE DETECTION
	 */

	(function() {

		const _fs = global.require('fs');


		let read = 'readFileSync' in _fs;
		if (read === true) {

			_PERSISTENT.read = function() {

				let url = lychee.environment.resolve('./lychee.store');


				let raw = null;
				try {
					raw = _fs.readFileSync(url, 'utf8');
				} catch (err) {
					raw = null;
				}


				let buffer = null;
				try {
					buffer = JSON.parse(raw);
				} catch (err) {
					buffer = null;
				}


				if (buffer !== null) {

					for (let id in buffer) {
						_PERSISTENT.data[id] = buffer[id];
					}


					return true;

				}


				return false;

			};

		}


		let write = 'writeFileSync' in _fs;
		if (write === true) {

			_PERSISTENT.write = function() {

				let buffer = _JSON.encode(_PERSISTENT.data);
				let url    = lychee.environment.resolve('./lychee.store');


				let result = false;
				try {
					result = _fs.writeFileSync(url, buffer, 'utf8');
				} catch (err) {
					result = false;
				}


				return result;

			};

		}


		if (lychee.debug === true) {

			let methods = [];

			if (read && write) methods.push('Persistent');
			if (_TEMPORARY)    methods.push('Temporary');

			if (methods.length === 0) {
				console.error('lychee.Storage: Supported methods are NONE');
			} else {
				console.info('lychee.Storage: Supported methods are ' + methods.join(', '));
			}

		}


		_PERSISTENT.read();

	})();



	/*
	 * HELPERS
	 */

	const _read_storage = function(silent) {

		silent = silent === true;


		let id   = this.id;
		let blob = null;


		let type = this.type;
		if (type === Composite.TYPE.persistent) {
			blob = _PERSISTENT.data[id] || null;
		} else if (type === Composite.TYPE.temporary) {
			blob = _TEMPORARY.data[id]  || null;
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

					for (let o in blob['@objects']) {
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

	const _write_storage = function(silent) {

		silent = silent === true;


		let operations = this.__operations;
		if (operations.length > 0) {

			while (operations.length > 0) {

				let operation = operations.shift();
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


			let id   = this.id;
			let blob = {
				'@model':   this.model,
				'@objects': this.__objects
			};


			let type = this.type;
			if (type === Composite.TYPE.persistent) {

				_PERSISTENT.data[id] = blob;
				_PERSISTENT.write();

			} else if (type === Composite.TYPE.temporary) {

				_TEMPORARY.data[id] = blob;

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

	let Composite = function(data) {

		let settings = Object.assign({}, data);


		this.id    = 'lychee-Storage-' + _id++;
		this.model = {};
		this.type  = Composite.TYPE.persistent;


		this.__objects    = {};
		this.__operations = [];


		this.setId(settings.id);
		this.setModel(settings.model);
		this.setType(settings.type);


		_Emitter.call(this);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		_read_storage.call(this);

	};


	Composite.TYPE = {
		persistent: 0,
		temporary:  1
	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		sync: function(silent) {

			silent = silent === true;


			let result = false;


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

				for (let o in blob.objects) {

					let object = blob.objects[o];

					if (lychee.interfaceof(this.model, object)) {
						this.__objects[o] = object;
					}

				}

			}

		},

		serialize: function() {

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.Storage';

			let settings = {};
			let blob     = (data['blob'] || {});


			if (this.id.substr(0, 15) !== 'lychee-Storage-') settings.id    = this.id;
			if (Object.keys(this.model).length !== 0)        settings.model = this.model;
			if (this.type !== Composite.TYPE.persistent)     settings.type  = this.type;


			if (Object.keys(this.__objects).length > 0) {

				blob.objects = {};

				for (let o in this.__objects) {

					let object = this.__objects[o];
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
			return lychee.assignunlink({}, this.model);
		},

		filter: function(callback, scope) {

			callback = callback instanceof Function ? callback : null;
			scope    = scope !== undefined          ? scope    : this;


			let filtered = [];


			if (callback !== null) {

				for (let o in this.__objects) {

					let object = this.__objects[o];

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

				let object = this.__objects[id] || null;
				if (object !== null) {
					return object;
				}

			}


			return null;

		},

		remove: function(id) {

			id = typeof id === 'string' ? id : null;


			if (id !== null) {

				let object = this.__objects[id] || null;
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

			type = lychee.enumof(Composite.TYPE, type) ? type : null;


			if (type !== null) {

				this.type = type;

				return true;

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('Viewport').tags({
	platform: 'node'
}).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (
		typeof global.process !== 'undefined'
		&& typeof global.process.stdout === 'object'
		&& typeof global.process.stdout.on === 'function'
	) {
		return true;
	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _process   = global.process;
	const _Emitter   = lychee.import('lychee.event.Emitter');
	const _INSTANCES = [];



	/*
	 * EVENTS
	 */

	const _listeners = {

		resize: function() {

			for (let i = 0, l = _INSTANCES.length; i < l; i++) {
				_process_reshape.call(_INSTANCES[i], _process.stdout.columns, _process.stdout.rows);
			}

		}

	};



	/*
	 * FEATURE DETECTION
	 */

	(function() {

		let resize = true;
		if (resize === true) {
			_process.stdout.on('resize', _listeners.resize);
		}


		if (lychee.debug === true) {

			let methods = [];

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

	const _process_reshape = function(width, height) {

		if (width === this.width && height === this.height) {
			return false;
		}


		this.width  = width;
		this.height = height;


		let orientation = null;
		let rotation    = null;

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

	let Composite = function(data) {

		let settings = Object.assign({}, data);


		this.fullscreen = false;
		this.width      = _process.stdout.columns;
		this.height     = _process.stdout.rows;

		this.__orientation = 0; // Unsupported


		_Emitter.call(this);

		_INSTANCES.push(this);


		this.setFullscreen(settings.fullscreen);



		/*
		 * INITIALIZATION
		 */

		setTimeout(function() {

			this.width  = 0;
			this.height = 0;

			_process_reshape.call(this, _process.stdout.columns, _process.stdout.rows);

		}.bind(this), 100);


		settings = null;

	};


	Composite.prototype = {

		destroy: function() {

			let found = false;

			for (let i = 0, il = _INSTANCES.length; i < il; i++) {

				if (_INSTANCES[i] === this) {
					_INSTANCES.splice(i, 1);
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

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.Viewport';

			let settings = {};


			if (this.fullscreen !== false) settings.fullscreen = this.fullscreen;


			data['arguments'][0] = settings;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setFullscreen: function(fullscreen) {

			fullscreen = typeof fullscreen === 'boolean' ? fullscreen : null;


			if (fullscreen !== null) {

				// XXX: No fullscreen support

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('lychee.net.Server').tags({
	platform: 'node'
}).requires([
	'lychee.Storage',
	'lychee.codec.JSON',
	'lychee.net.Remote'
]).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof global.require === 'function') {

		try {

			global.require('net');
			return true;

		} catch (err) {
		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _net     = global.require('net');
	const _Emitter = lychee.import('lychee.event.Emitter');
	const _JSON    = lychee.import('lychee.codec.JSON');
	const _Remote  = lychee.import('lychee.net.Remote');
	const _Storage = lychee.import('lychee.Storage');
	const _storage = new _Storage({
		id:    'server',
		type:  _Storage.TYPE.persistent,
		model: {
			id:   '[::ffff]:1337',
			type: 'client',
			host: '::ffff',
			port: 1337
		}
	});



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({}, data);


		this.codec  = _JSON;
		this.host   = null;
		this.port   = 1337;
		this.remote = _Remote;
		this.type   = Composite.TYPE.WS;


		this.__isConnected = false;
		this.__server      = null;


		this.setCodec(settings.codec);
		this.setHost(settings.host);
		this.setPort(settings.port);
		this.setRemote(settings.remote);
		this.setType(settings.type);


		_Emitter.call(this);

		settings = null;


		/*
		 * INITIALIZATION
		 */

		this.bind('connect', function(remote) {

			let id  = (/:/g.test(remote.host) ? '[' + remote.host + ']' : remote.host) + ':' + remote.port;
			let obj = _storage.create();
			if (obj !== null) {

				obj.id   = id;
				obj.type = 'client';
				obj.host = remote.host;
				obj.port = remote.port;

				_storage.write(id, obj);

			}

		}, this);

		this.bind('disconnect', function(remote) {

			let id  = (/:/g.test(remote.host) ? '[' + remote.host + ']' : remote.host) + ':' + remote.port;
			let obj = _storage.read(id);
			if (obj !== null) {
				_storage.remove(id);
			}

		}, this);

	};


	Composite.TYPE = {
		WS:   0,
		HTTP: 1,
		TCP:  2
	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.Server';

			let settings = {};


			if (this.codec !== _JSON)            settings.codec  = lychee.serialize(this.codec);
			if (this.host !== 'localhost')       settings.host   = this.host;
			if (this.port !== 1337)              settings.port   = this.port;
			if (this.remote !== _Remote)         settings.remote = lychee.serialize(this.remote);
			if (this.type !== Composite.TYPE.WS) settings.type   = this.type;


			data['arguments'][0] = settings;


			return data;

		},



		/*
		 * CUSTOM API
		 */

		connect: function() {

			if (this.__isConnected === false) {

				if (lychee.debug === true) {
					console.log('lychee.net.Server: Connected to ' + this.host + ':' + this.port);
				}


				let that   = this;
				let server = new _net.Server({
					allowHalfOpen:  true,
					pauseOnConnect: true
				});


				server.on('connection', function(socket) {

					let host   = socket.remoteAddress || socket.server._connectionKey.split(':')[1];
					let port   = socket.remotePort    || socket.server._connectionKey.split(':')[2];
					let remote = new that.remote({
						codec: that.codec,
						host:  host,
						port:  port,
						type:  that.type
					});

					that.trigger('preconnect', [ remote ]);

					remote.bind('connect', function() {
						that.trigger('connect', [ this ]);
					});

					remote.bind('disconnect', function() {
						that.trigger('disconnect', [ this ]);
					});


					remote.connect(socket);

				});

				server.on('error', function() {
					this.close();
				});

				server.on('close', function() {
					that.__isConnected = false;
					that.__server      = null;
				});

				server.listen(this.port, this.host);


				this.__server      = server;
				this.__isConnected = true;


				return true;

			}


			return false;

		},

		disconnect: function() {

			let server = this.__server;
			if (server !== null) {
				server.close();
			}


			return true;

		},



		/*
		 * TUNNEL API
		 */

		setCodec: function(codec) {

			codec = lychee.interfaceof(_JSON, codec) ? codec : null;


			if (codec !== null) {

				let oldcodec = this.codec;
				if (oldcodec !== codec) {

					this.codec = codec;


					if (this.__isConnected === true) {
						this.disconnect();
						this.connect();
					}

				}


				return true;

			}


			return false;

		},

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

		},

		setRemote: function(remote) {

			remote = lychee.interfaceof(_Remote, remote) ? remote : null;


			if (remote !== null) {

				let oldremote = this.remote;
				if (oldremote !== remote) {

					this.remote = remote;


					if (this.__isConnected === true) {
						this.disconnect();
						this.connect();
					}

				}


				return true;

			}


			return false;

		},

		setType: function(type) {

			type = lychee.enumof(Composite.TYPE, type) ? type : null;


			if (type !== null) {

				let oldtype = this.type;
				if (oldtype !== type) {

					this.type = type;


					if (this.__isConnected === true) {
						this.disconnect();
						this.connect();
					}

				}


				return true;

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('lychee.net.socket.HTTP').tags({
	platform: 'node'
}).requires([
	'lychee.net.protocol.HTTP'
]).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (typeof global.require === 'function') {

		try {

			global.require('net');

			return true;

		} catch (err) {
		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _net      = global.require('net');
	const _Emitter  = lychee.import('lychee.event.Emitter');
	const _Protocol = lychee.import('lychee.net.protocol.HTTP');



	/*
	 * HELPERS
	 */

	const _connect_socket = function(socket, protocol) {

		let that = this;
		if (that.__connection !== socket) {

			socket.on('data', function(blob) {

				let chunks = protocol.receive(blob);
				if (chunks.length > 0) {

					for (let c = 0, cl = chunks.length; c < cl; c++) {
						that.trigger('receive', [ chunks[c].payload, chunks[c].headers ]);
					}

				}

			});

			socket.on('error', function(err) {
				that.trigger('error');
				that.disconnect();
			});

			socket.on('timeout', function() {
				that.trigger('error');
				that.disconnect();
			});

			socket.on('close', function() {
				that.disconnect();
			});

			socket.on('end', function() {
				that.disconnect();
			});


			that.__connection = socket;
			that.__protocol   = protocol;

			that.trigger('connect');

		}

	};

	const _disconnect_socket = function(socket, protocol) {

		let that = this;
		if (that.__connection === socket) {

			socket.removeAllListeners('data');
			socket.removeAllListeners('error');
			socket.removeAllListeners('timeout');
			socket.removeAllListeners('close');
			socket.removeAllListeners('end');

			socket.destroy();
			protocol.close();


			that.__connection = null;
			that.__protocol   = null;

			that.trigger('disconnect');

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function() {

		this.__connection = null;
		this.__protocol   = null;


		_Emitter.call(this);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.socket.HTTP';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		connect: function(host, port, connection) {

			host       = typeof host === 'string'       ? host       : null;
			port       = typeof port === 'number'       ? (port | 0) : null;
			connection = typeof connection === 'object' ? connection : null;


			let that     = this;
			// let url      = /:/g.test(host) ? ('http://[' + host + ']:' + port) : ('http://' + host + ':' + port);
			let protocol = null;


			if (host !== null && port !== null) {

				if (connection !== null) {

					protocol = new _Protocol({
						type: _Protocol.TYPE.remote
					});

					connection.allowHalfOpen = true;
					connection.setTimeout(0);
					connection.setNoDelay(true);
					connection.setKeepAlive(true, 0);
					connection.removeAllListeners('timeout');


					_connect_socket.call(that, connection, protocol);

					connection.resume();

				} else {

					protocol   = new _Protocol({
						type: _Protocol.TYPE.client
					});
					connection = new _net.Socket({
						readable: true,
						writable: true
					});

					connection.allowHalfOpen = true;
					connection.setTimeout(0);
					connection.setNoDelay(true);
					connection.setKeepAlive(true, 0);
					connection.removeAllListeners('timeout');


					_connect_socket.call(that, connection, protocol);

					connection.connect({
						host: host,
						port: port
					});

				}


				return true;

			}


			return false;

		},

		send: function(payload, headers, binary) {

			payload = payload instanceof Buffer ? payload : null;
			headers = headers instanceof Object ? headers : null;
			binary  = binary === true;


			if (payload !== null) {

				let connection = this.__connection;
				let protocol   = this.__protocol;

				if (connection !== null && protocol !== null) {

					let chunk = protocol.send(payload, headers, binary);
					let enc   = binary === true ? 'binary' : 'utf8';

					if (chunk !== null) {

						connection.write(chunk, enc);

						return true;
					}

				}

			}


			return false;

		},

		disconnect: function() {

			let connection = this.__connection;
			let protocol   = this.__protocol;

			if (connection !== null && protocol !== null) {

				_disconnect_socket.call(this, connection, protocol);


				return true;

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('lychee.net.socket.WS').tags({
	platform: 'node'
}).requires([
	'lychee.crypto.SHA1',
	'lychee.net.protocol.WS'
]).includes([
	'lychee.event.Emitter'
]).supports(function(lychee, global) {

	if (
		typeof global.require === 'function'
		&& typeof global.setInterval === 'function'
	) {

		try {

			global.require('net');

			return true;

		} catch (err) {
		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _net           = global.require('net');
	const _clearInterval = global.clearInterval;
	const _setInterval   = global.setInterval;
	const _Emitter       = lychee.import('lychee.event.Emitter');
	const _Protocol      = lychee.import('lychee.net.protocol.WS');
	const _SHA1          = lychee.import('lychee.crypto.SHA1');



	/*
	 * HELPERS
	 */

	const _connect_socket = function(socket, protocol) {

		let that = this;
		if (that.__connection !== socket) {

			socket.on('data', function(blob) {

				let chunks = protocol.receive(blob);
				if (chunks.length > 0) {

					for (let c = 0, cl = chunks.length; c < cl; c++) {

						let chunk = chunks[c];
						if (chunk.payload[0] === 136) {

							that.send(chunk.payload, chunk.headers, true);
							that.disconnect();

							return;

						} else {

							that.trigger('receive', [ chunk.payload, chunk.headers ]);

						}

					}

				}

			});

			socket.on('error', function(err) {
				that.trigger('error');
				that.disconnect();
			});

			socket.on('timeout', function() {
				that.trigger('error');
				that.disconnect();
			});

			socket.on('close', function() {
				that.disconnect();
			});

			socket.on('end', function() {
				that.disconnect();
			});


			that.__connection = socket;
			that.__protocol   = protocol;

			that.trigger('connect');

		}

	};

	const _disconnect_socket = function(socket, protocol) {

		let that = this;
		if (that.__connection === socket) {

			socket.removeAllListeners('data');
			socket.removeAllListeners('error');
			socket.removeAllListeners('timeout');
			socket.removeAllListeners('close');
			socket.removeAllListeners('end');

			socket.destroy();
			protocol.close();


			that.__connection = null;
			that.__protocol   = null;

			that.trigger('disconnect');

		}

	};

	const _verify_client = function(headers, nonce) {

		let connection = (headers['connection'] || '').toLowerCase();
		let upgrade    = (headers['upgrade']    || '').toLowerCase();
		let protocol   = (headers['sec-websocket-protocol'] || '').toLowerCase();

		if (connection === 'upgrade' && upgrade === 'websocket' && protocol === 'lycheejs') {

			let accept = (headers['sec-websocket-accept'] || '');
			let expect = (function(nonce) {

				let sha1 = new _SHA1();
				sha1.update(nonce + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
				return sha1.digest().toString('base64');

			})(nonce.toString('base64'));


			if (accept === expect) {
				return accept;
			}

		}


		return null;

	};

	const _verify_remote = function(headers) {

		let connection = (headers['connection'] || '').toLowerCase();
		let upgrade    = (headers['upgrade']    || '').toLowerCase();
		let protocol   = (headers['sec-websocket-protocol'] || '').toLowerCase();

		if (connection === 'upgrade' && upgrade === 'websocket' && protocol === 'lycheejs') {

			let host   = headers['host']   || null;
			let nonce  = headers['sec-websocket-key'] || null;
			let origin = headers['origin'] || null;

			if (host !== null && nonce !== null && origin !== null) {

				let handshake = '';
				let accept    = (function(nonce) {

					let sha1 = new _SHA1();
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

		}


		return null;

	};

	const _upgrade_client = function(host, port, nonce) {

		// let that       = this;
		let handshake  = '';
		let identifier = lychee.ROOT.project;


		if (identifier.substr(0, lychee.ROOT.lychee.length) === lychee.ROOT.lychee) {
			identifier = lychee.ROOT.project.substr(lychee.ROOT.lychee.length + 1);
		}

		for (let n = 0; n < 16; n++) {
			nonce[n] = Math.round(Math.random() * 0xff);
		}



		// HEAD

		handshake += 'GET / HTTP/1.1\r\n';
		handshake += 'Host: ' + host + ':' + port + '\r\n';
		handshake += 'Upgrade: WebSocket\r\n';
		handshake += 'Connection: Upgrade\r\n';
		handshake += 'Origin: lycheejs://' + identifier + '\r\n';
		handshake += 'Sec-WebSocket-Key: ' + nonce.toString('base64') + '\r\n';
		handshake += 'Sec-WebSocket-Version: 13\r\n';
		handshake += 'Sec-WebSocket-Protocol: lycheejs\r\n';


		// BODY
		handshake += '\r\n';


		this.once('data', function(data) {

			let headers = {};
			let lines   = data.toString('utf8').split('\r\n');


			lines.forEach(function(line) {

				let index = line.indexOf(':');
				if (index !== -1) {

					let key = line.substr(0, index).trim().toLowerCase();
					let val = line.substr(index + 1, line.length - index - 1).trim();
					if (/connection|upgrade|sec-websocket-version|sec-websocket-origin|sec-websocket-protocol/g.test(key)) {
						headers[key] = val.toLowerCase();
					} else if (key === 'sec-websocket-accept') {
						headers[key] = val;
					}

				}

			});


			if (headers['connection'] === 'upgrade' && headers['upgrade'] === 'websocket') {

				this.emit('upgrade', {
					headers: headers,
					socket:  this
				});

			} else {

				let err = new Error('connect ECONNREFUSED');
				err.code = 'ECONNREFUSED';

				this.emit('error', err);

			}

		}.bind(this));


		this.write(handshake, 'ascii');

	};

	const _upgrade_remote = function(data) {

		let lines   = data.toString('utf8').split('\r\n');
		let headers = {};


		lines.forEach(function(line) {

			let index = line.indexOf(':');
			if (index !== -1) {

				let key = line.substr(0, index).trim().toLowerCase();
				let val = line.substr(index + 1, line.length - index - 1).trim();
				if (/host|connection|upgrade|origin|sec-websocket-protocol/g.test(key)) {
					headers[key] = val.toLowerCase();
				} else if (key === 'sec-websocket-key') {
					headers[key] = val;
				}

			}

		});


		if (headers['connection'] === 'upgrade' && headers['upgrade'] === 'websocket') {

			this.emit('upgrade', {
				headers: headers,
				socket:  this
			});

		} else {

			this.destroy();

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function() {

		this.__connection = null;
		this.__protocol   = null;


		_Emitter.call(this);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Emitter.prototype.serialize.call(this);
			data['constructor'] = 'lychee.net.socket.WS';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		connect: function(host, port, connection) {

			host       = typeof host === 'string'       ? host       : null;
			port       = typeof port === 'number'       ? (port | 0) : null;
			connection = typeof connection === 'object' ? connection : null;


			let that = this;
			// let url  = /:/g.test(host) ? ('ws://[' + host + ']:' + port) : ('ws://' + host + ':' + port);


			if (host !== null && port !== null) {

				if (connection !== null) {

					connection.once('data', _upgrade_remote.bind(connection));
					connection.resume();

					connection.once('error', function(err) {

						if (lychee.debug === true) {

							let code = err.code || '';
							if (/ECONNABORTED|ECONNREFUSED|ECONNRESET/.test(code)) {
								console.warn('lychee.net.socket.WS: BAD CONNECTION to ' + host + ':' + port);
							}

						}

						that.trigger('error');
						that.disconnect();

					});

					connection.on('upgrade', function(event) {

						let protocol = new _Protocol({
							type: _Protocol.TYPE.remote
						});
						let socket   = event.socket || null;


						if (socket !== null) {

							let verification = _verify_remote.call(socket, event.headers);
							if (verification !== null) {

								socket.allowHalfOpen = true;
								socket.setTimeout(0);
								socket.setNoDelay(true);
								socket.setKeepAlive(true, 0);
								socket.removeAllListeners('timeout');
								socket.write(verification, 'ascii');


								_connect_socket.call(that, socket, protocol);

							} else {

								if (lychee.debug === true) {
									console.warn('lychee.net.socket.WS: BAD HANDSHAKE to ' + host + ':' + port);
								}


								socket.write('', 'ascii');
								socket.end();
								socket.destroy();

								that.trigger('error');
								that.disconnect();

							}

						}

					});

				} else {

					let nonce     = new Buffer(16);
					let connector = new _net.Socket({
						fd:       null,
						readable: true,
						writable: true
					});


					connector.once('connect', _upgrade_client.bind(connector, host, port, nonce));

					connector.on('upgrade', function(event) {

						let protocol = new _Protocol({
							type: _Protocol.TYPE.client
						});
						let socket   = event.socket || null;


						if (socket !== null) {

							let verification = _verify_client(event.headers, nonce);
							if (verification !== null) {

								socket.setTimeout(0);
								socket.setNoDelay(true);
								socket.setKeepAlive(true, 0);
								socket.removeAllListeners('timeout');


								let interval_id = _setInterval(function() {

									if (socket.writable) {

										let chunk = protocol.ping();
										if (chunk !== null) {
											socket.write(chunk);
										}

									} else {

										_clearInterval(interval_id);
										interval_id = null;

									}

								}.bind(this), 60000);


								_connect_socket.call(that, socket, protocol);

							} else {

								if (lychee.debug === true) {
									console.warn('lychee.net.socket.WS: BAD HANDSHAKE to ' + host + ':' + port);
								}


								socket.end();
								socket.destroy();

								that.trigger('error');
								that.disconnect();

							}

						}

					});

					connector.once('error', function(err) {

						if (lychee.debug === true) {

							let code = err.code || '';
							if (/ECONNABORTED|ECONNREFUSED|ECONNRESET/.test(code)) {
								console.warn('lychee.net.socket.WS: BAD CONNECTION to ' + host + ':' + port);
							}

						}

						that.trigger('error');
						that.disconnect();

						this.end();
						this.destroy();

					});

					connector.connect({
						host: host,
						port: port
					});

				}


				return true;

			}


			return false;

		},

		send: function(payload, headers, binary) {

			payload = payload instanceof Buffer ? payload : null;
			headers = headers instanceof Object ? headers : null;
			binary  = binary === true;


			if (payload !== null) {

				let connection = this.__connection;
				let protocol   = this.__protocol;

				if (connection !== null && protocol !== null) {

					let chunk = protocol.send(payload, headers, binary);
					let enc   = binary === true ? 'binary' : 'utf8';

					if (chunk !== null) {

						connection.write(chunk, enc);

						return true;
					}

				}

			}


			return false;

		},

		disconnect: function() {

			let connection = this.__connection;
			let protocol   = this.__protocol;

			if (connection !== null && protocol !== null) {

				_disconnect_socket.call(this, connection, protocol);


				return true;

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('lychee.ui.entity.Download').tags({
	platform: 'node'
}).includes([
	'lychee.ui.entity.Button'
]).supports(function(lychee, global) {

	if (
		typeof global.require === 'function'
		&& typeof global.process !== 'undefined'
		&& typeof global.process.env === 'object'
	) {

		try {

			global.require('fs');

			return true;

		} catch (err) {

		}

	}


	return false;

}).exports(function(lychee, global, attachments) {

	const _fs     = global.require('fs');
	const _Button = lychee.import('lychee.ui.entity.Button');
	const _HOME   = (function(env) {

		let home    = env.HOME || null;
		let appdata = env.APPDATA || null;

		if (home !== null) {
			return home;
		} else if (appdata !== null) {
			return appdata;
		} else {
			return '/tmp';
		}

	})(global.process.env);



	/*
	 * HELPERS
	 */

	const _MIME_TYPE = {
		'Config':  { name: 'Entity', ext: 'json',    enc: 'utf8'   },
		'Font':    { name: 'Entity', ext: 'fnt',     enc: 'utf8'   },
		'Music':   {
			'mp3': { name: 'Entity', ext: 'msc.mp3', enc: 'binary' },
			'ogg': { name: 'Entity', ext: 'msc.ogg', enc: 'binary' }
		},
		'Sound':   {
			'mp3': { name: 'Entity', ext: 'snd.mp3', enc: 'binary' },
			'ogg': { name: 'Entity', ext: 'snd.ogg', enc: 'binary' }
		},
		'Texture': { name: 'Entity', ext: 'png',     enc: 'binary' },
		'Stuff':   { name: 'Entity', ext: 'stuff',   enc: 'utf8'   }
	};

	const _download = function(asset) {

		let data = asset.serialize();
		let url  = data.arguments[0];
		let name = url.split('/').pop();
		let mime = _MIME_TYPE[data.constructor] || _MIME_TYPE['Stuff'];


		if (data.blob !== null) {

			if (/Music|Sound/.test(data.constructor)) {

				for (let ext in mime) {

					let blob = new Buffer(data.blob.buffer[ext], 'base64');
					let path = _HOME + '/' + name + '.' + mime[ext].ext;

					_fs.writeFileSync(path, blob, mime[ext].enc);

				}

			} else {

				let blob = new Buffer(data.blob.buffer, 'base64');
				let path = _HOME + '/' + name + '.' + mime.ext;

				if (url.substr(0, 5) === 'data:') {
					path = _HOME + '/' + mime.name + '.' + mime.ext;
				}

				_fs.writeFileSync(path, blob, mime.enc);

			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({
			label: 'DOWNLOAD'
		}, data);


		this.value = [];


		this.setValue(settings.value);

		delete settings.value;


		_Button.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.unbind('touch');
		this.bind('touch', function() {

			this.value.forEach(function(asset) {
				_download(asset);
			});

		}, this);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Button.prototype.serialize.call(this);
			data['constructor'] = 'lychee.ui.entity.Download';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setValue: function(value) {

			value = value instanceof Array ? value : null;


			if (value !== null) {

				this.value = value.filter(function(asset) {

					if (asset instanceof global.Config)  return true;
					if (asset instanceof global.Font)    return true;
					if (asset instanceof global.Music)   return true;
					if (asset instanceof global.Sound)   return true;
					if (asset instanceof global.Texture) return true;
					if (asset instanceof global.Stuff)   return true;


					return false;

				});


				return true;

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('lychee.ui.entity.Helper').tags({
	platform: 'node'
}).includes([
	'lychee.ui.entity.Button'
]).supports(function(lychee, global) {

	if (typeof global.require === 'function') {

		try {

			global.require('child_process');

			return true;

		} catch (err) {

		}

	}


	return false;

}).attaches({
	"json": lychee.deserialize({"constructor":"Config","arguments":["/libraries/lychee/source/platform/node/ui/entity/Helper.json"],"blob":{"buffer":"data:application/json;base64,ewoJIm1hcCI6IHsKCQkiYm9vdCI6IFsKCQkJewoJCQkJIngiOiAwLAoJCQkJInkiOiAwLAoJCQkJInciOiAzMiwKCQkJCSJoIjogMzIKCQkJfQoJCV0sCgkJImVkaXQiOiBbCgkJCXsKCQkJCSJ4IjogMzIsCgkJCQkieSI6IDAsCgkJCQkidyI6IDMyLAoJCQkJImgiOiAzMgoJCQl9CgkJXSwKCQkiZmlsZSI6IFsKCQkJewoJCQkJIngiOiA2NCwKCQkJCSJ5IjogMCwKCQkJCSJ3IjogMzIsCgkJCQkiaCI6IDMyCgkJCX0KCQldLAoJCSJwcm9maWxlIjogWwoJCQl7CgkJCQkieCI6IDk2LAoJCQkJInkiOiAwLAoJCQkJInciOiAzMiwKCQkJCSJoIjogMzIKCQkJfQoJCV0sCgkJInJlZnJlc2giOiBbCgkJCXsKCQkJCSJ4IjogMCwKCQkJCSJ5IjogMzIsCgkJCQkidyI6IDMyLAoJCQkJImgiOiAzMgoJCQl9CgkJXSwKCQkic3RhcnQiOiBbCgkJCXsKCQkJCSJ4IjogMzIsCgkJCQkieSI6IDMyLAoJCQkJInciOiAzMiwKCQkJCSJoIjogMzIKCQkJfQoJCV0sCgkJInN0b3AiOiBbCgkJCXsKCQkJCSJ4IjogNjQsCgkJCQkieSI6IDMyLAoJCQkJInciOiAzMiwKCQkJCSJoIjogMzIKCQkJfQoJCV0sCgkJInVuYm9vdCI6IFsKCQkJewoJCQkJIngiOiA5NiwKCQkJCSJ5IjogMzIsCgkJCQkidyI6IDMyLAoJCQkJImgiOiAzMgoJCQl9CgkJXSwKCQkid2ViIjogWwoJCQl7CgkJCQkieCI6IDAsCgkJCQkieSI6IDY0LAoJCQkJInciOiAzMiwKCQkJCSJoIjogMzIKCQkJfQoJCV0KCX0sCgkic3RhdGVzIjogewoJCSJib290IjogewoJCQkiYW5pbWF0aW9uIjogZmFsc2UKCQl9LAoJCSJlZGl0IjogewoJCQkiYW5pbWF0aW9uIjogZmFsc2UKCQl9LAoJCSJmaWxlIjogewoJCQkiYW5pbWF0aW9uIjogZmFsc2UKCQl9LAoJCSJwcm9maWxlIjogewoJCQkiYW5pbWF0aW9uIjogZmFsc2UKCQl9LAoJCSJyZWZyZXNoIjogewoJCQkiYW5pbWF0aW9uIjogZmFsc2UKCQl9LAoJCSJzdGFydCI6IHsKCQkJImFuaW1hdGlvbiI6IGZhbHNlCgkJfSwKCQkic3RvcCI6IHsKCQkJImFuaW1hdGlvbiI6IGZhbHNlCgkJfSwKCQkidW5ib290IjogewoJCQkiYW5pbWF0aW9uIjogZmFsc2UKCQl9LAoJCSJ3ZWIiOiB7CgkJCSJhbmltYXRpb24iOiBmYWxzZQoJCX0KCX0KfQ=="}}),
	"png": lychee.deserialize({"constructor":"Texture","arguments":["/libraries/lychee/source/platform/node/ui/entity/Helper.png"],"blob":{"buffer":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAXcklEQVR4Xu2dB7R8V1XGvw9FsWEJIAioFAFBkCpSpUtHQCBSpRlqQOkhSE8oEoqKdBAjAgIqzcSGBiRGQBJFkaLYAEUsRCQgms/1m+z71n3z7sy9M29eZt5/7lnrreT/3sy95+zznd33PtY4tpoC3urVj4vXCIAtB8EIgBEAq6dAkq+RdAVJl5X0vZK+WdIFJX3C9puWfWOSC9r+6rzvD/nMsu/f1O8l+VpJV5N0cUkXqZ9zbP9S35xXxgGSfKukoyX9qKSbSeLf0+Ns212/nzvPJN8p6UWSfkzSI2y/uusLSY6V9DxJvybpsbb/rY8Ah/nvSS4t6URJt2/RO9JEtP+rpEv2HZh9A4ATJ+lnJD1B0rdL+rikd0n6kKSPSPp3SWdLelJtHtxg0EhyAUk/VYv8pnreNST9oqSfbhaX5BskvVzSfeq9V5f0nwWC1w162SH7UJLbSIKb/pck1vgHkj4l6QWSbi3p5rbf37esfQEgCZvyNkm3kvR2SU+x/eczTueLJT3Q9iAAJIGlsak/LOl9ko6R9NeSni3piZJOk3Q3SWz+b0hi058q6VmSflDSKyRdR9IfSXqIbb7bO5L8OOCS9PVzPvxs27xzLSPJd0n6C0l/Iumetr/ARJL8XB1GfvfGIZNbGgB18iHuD9XG/nJN4gK2z51+eZJXSbqj7YvNm1iSb5T0tNoEOAec5dW2YW2TkYSNf62k/5B0odIv7m37na3PwD0eVoDhM8+VdILtL/e8/9OS/rs4WddHryzpUpLusS4QJIED3h09yzY0gCYPlfRSScfb5pAMGvsBwHFF3PvYPjnJDSX9vKQfKFaNrP7j1obAIS5tGxY+cyRBdFxT0smg2TaybNdI8i2S3lCyj7/9uqSftP2ljs9eQtJLJHGyT7P9Iz3vB2hPtw0I94wkF5X0+5KuVFxmLqBaDwDMr7P9D4N2Zj6NeMYpthGPbP6FS9SebvtGM+b9fZIub/u3239fCgBJLlebzCTunIQT8ZeSULp+s5S175B0ZdufqUl+VNInbd+hZwNAMWiGhd1/+sSW7EM0XLI29tvYfEl/K+lBtt/Tfn4SRA5gupOk59t+/H4AUGsBBO+W9P0LbObXwbZtX2uB73QBEAvrf+twvLB1wF5WYvJh09p/khuXiP6ibfZqZywLAAh652JBn07yEEmYHFe3fVYSZPCZJXtfXggFHM+y/fQ+AiSBuyDLPwCYbH82CQomlsB9JQGmB9hGBnICblGnEZPzlZIeZ/vsJN8t6R2SriLpMbbRQ+aOJHM5QN/3Z/09CRzlqbaXonlrozH5MIWxclD4JiMJz8U64jAcYxs68Pu7SvrVEpMfs40IWx4ASUA92v0LmtOU5EFF+OuxKUmuJwkNFKXvNUkw31Cabmr7D4cQsSb++pLzzy/FDxsXWf5M21+ZOukopIAGUxCuw3eeXEri0bY5sX2bzynluafX/Pu+ssjfry8J+uwLALWpKNpsJrrQziirCV3sXnDD0o8Qy78lCeAcZfsG+wUArPl2ki5j+/M1IVjiX5X9+TtlFaAIIgI+nwRzBUvhEn1K2NSCmCyKJmwPGXoz2+gIM0fpIqdKQpn8H6wI2x8eslNl1XyxThjfXeUAXDiy9gWAOunQ+CZFz8keNKOccHDoe9R+wAkQqX8q6bO28RnsjLmTKecOZlYzLlMmGWbQz069GOUPloT5BkJhuR9JgtL3wTq1nYpVF5WTwM7fUgohG4hi+Gf4BWaBoDYfWQjLByjI2/eiMdv+5yG7eQhEQKMjIU6fMoN2nHb0g8/YPjEJ4EMEv9j28YMAkOSBJddx9LQHiLscMraPoEm+p1gp2vl1bOOc6R2l6IFiTDnMu3clwct4kiTMyF8oc4fTipxD4UQ0MGecIQ+3fUqSe5duwHvv1rZKZk1ikwGQBB0GEfcc2zjWBo0k6Gv4a3AO4TCazwHKzobVw0ox39rjfZzsvjcngQWBQrjM9W2zMb0jCV4s5PXf4Fa2jXY/GcWRTkC5LDn/SEmYQDhAsAaQ+5yMc1rfgSOxjqNKBveJkI1UApPAXfG4ons9dpqQs2Ig5UY/o+h1g7Y/hWfsEQG1AWw6svf208pW3w4muWqJgluWtw5F8JN932ttGPYqMg4/Nxv6tA6FDw8fjiU2l4HC+WDb6CE7o/wFxAbwIvK3W/SJgk3kAEmeUw4xWPijOzYfs/z3yh+C4vwxSXBF9gDg4NW8kW28h7tGFwD+pdgsrtbflYQz54wuJ8sUsdEPninpJyThmkQDf9k04oYAoWx3Nr9x/+6YfMUJcDqhWOISZXwCR0/bDZ0EpRMFiM8gHp5hu1ex2zQAJIGmyO2X2n54x+YTccWywkxmoxHZ/1eKMx8HGNDvH7to3wUAUIPMQANHsUMOE3C4rW188rtGbRabDXvCQYHX7blD5f08QJRfHi8fFgXiBMUT9y4RsL+rCBiAxQpBFEAgZB2oRx9g3Mn2tBib+dpNAkAS1ovfhLgG8Ywdd3gdBA4dm49nFF8Im3xbLDQ0/vKjfHjeIeyzAiAqwRiUL07SDTvYLKz1ipKwP5+M02bIKR/ymSSYm/j3EQkAEyAyJzYUhxCyDYcTbBGdBTcvyineP8QCnALlEytk0NgUACRByUPfeU15OKc3HyuJzSe8jmibq9vMWnwfAPDsnVkeNbxusBacGf/UPLAItpBWOmgnzlP6sFnx5CHz2VRYOa5m3serifCdafvosn85LYDgMSXGJt89bABIgpKHCESe4w7fFVwr66ph+7e0jcd0qdEJgArF4trl9HPqT09CuBXFEDaDQtFEoQ5Eay4W1wDgdl2evDYAOkTTA8o1eqgAkAQvHiYw7tv7dmw+7m02H6vmVrbhgkuPLh0AXzFeIxS5JxDpa532m0oimvRO20TXOKUHCQAsAZw/mHg4eLAIdrJ8ugCQhCARrJPkEEzJaw3xWUxxtJnRwGUpPTQWkORz5UjDBIbj7ozKAGLzcYnz90ksZD+jCwBoznch0mWbybDJb66Y/KlJ8C0TcGBTiLPjjFk5wVobwntI9EDB413PICOIbKApEYDr93GSiPYBSsQF0b+h4drJK5PgNEKv6c2mWZDwxAKuYbvtWd31iAp4kUH16OnAVUVc2XwcYbceku0zZH5dACCl60O2MecgCKlHOGZw7Z5UDh4ULsQDm3HzUkIGBXmGTKrrM0lIMkUZRTHE7ENOYuOfVSlonHpOP3kCj7dNYsfCIwlWBi5WNOtVDpTT59kmojlzJIFr4TlF9DaZPqwL+pL0yebv5Fnsd4JdAACBJFWiA2AKEmGD7V61Th2TQQkk4kay5v1sI6/Ol5EEawCTEH8/AwUJUxVN/1j0lfNlIgf0kiQcKMQs64HrEeXEEsAKu41tYhsrG10AwJYn+tYMzCz86DvevCS4dZHP5+vmNxMqjR93MFo/sXH8EK9dxum0Mkqu8EEVPkf3YvMZHMC72MY5t9LRBYBHlayFE3y0K5myUEpo85SVzmbBh1U28LmLuqsXfM1aPl7RUPIoAPibu1LjVjGxfcWmVzGB8RnrpcAIgPXSf+1vHwGw9i1Y7wRGAKyX/mt/+wiAtW/BeicwAmC99F/720cArH0L1juBlQIgCcEiqn86s08WWWplsl6egtCuWsNFnrWfzyYhqkgErj3wPp7c5CsmITJHmdZ0QSk1Bq84qDL1JFRZfcU2+RJLjZUAoCpz8MqRAo7XkPLwfY0kpKOR5UJghizfA401dE02CYGoSdi7Y+zk57Uqo7o+91DbRDJXPpLgGfyybdLflhr7AkBFqAi+UJBIcsYdFkkAnTXjOv2cHjJ/8PmT9Ei8gXKoQfn9S1Fj6ktJCLtSnPpI26SiT0YSUuPfaPsR9W/+S5T0oq1imc7vrmJerXmQogcAOChLjUEAqJIjUrCJDJIpTLwAQsCiKQql8IBByhaBJApHlq6CLRcvETH6AJALz38pEyepk0gd4eBdsfKlVt/zpREA520y2aacxCYTl+YDOylKSWD9BGbIZEEmkatHMInw8aRAcdHRAgAJKYR8mQdcgIRTkh4JAcNaDzTyt0kASEL2L5HZt9gm8RWa7OIASUiCoT0PiTN/P4TufTmB5JZTScJJJ/L31umHFrsmYvhe28dUIQKhZDKLn2SbnPaFRjWJoEkDcX1y43ZGVbkQUycaSZj0iQ3bXeglAz68KQBIQo4j6eEEhu5qm1TvLgDcsUQlpWHoTdBn7ugDQNP+hdyzmRkyScgbACjIwEnJWGUOIRvJa/uVvolMbTJhULJ/9gCgnk32D6KAVHQ+Rwbtq1ZtLWwCAJKQdMNa2QuabuxkXU9zgKINDTEoE0dcU47O92eOmQCo8jBSwai4oQpn7qA+wPakVq8ZSShLRnRQJUz+/qDRqtKlzp+yr86RhC4dtEuB7ZHHSHOEpdKju16wbgAkoTAGC4KGGIi86dTwTiWw8iWoJcCEpbZyZsLOPABAUKqZScleaiQhhYkyJXr8cFoHjSo2QaGcC4AW0EhfoxiEDCUIRn3CoELUeRNaJwBKlEI7OC9Z0bs2n3l3cYAWTRADtLKhVO+Ks/IJZqWFY3pRAErfnUnzp2VHNTSiUJSedbuaOsw52dQAAIBdXTB6NoscPtgdYodkFpJDX7+fLKE1AwDOxgm+SrtAtk2DJDTd+JJtFPA9IwkFO9QDvmhWa5xZAGg6ftDUaacIZBkQVM0+eWw3HprPVkWd6BKTRNRF3ls1DdTQo5fAIhELe4oihzxzXQAoFo6sf7dtMrBniUDM78xrBpmE0jqKZWjOscd0ngUANG8aLmEC7msUO2czaezY26OnWBvlX2TELgyA+j7rul9lDbOGQb2Jphe6RgDgWMPLt1Bd4wwuQBsZdLlrdnVKmQUAzCz64KFR7nskgZ2/cLqryBxkNwCgTdxOJ6xFJ1I+DJIr8R3QIo2U68FjjQAgroDid/FFlOcZAKBJB4W0VAjTW3HXmAUAHA4kh154PzK0eVMSZP+Js3rvdZw8Ch5R4pYGQHEeqmspHMUCQRHa00dwHhrWCABa6VASTuLtHuVvMILPUxQxmfGpdNJyFgAatrHwqenYTEqV6fIxWKGsTiAAALExt5BiBuppjcb36IlHrAJRsnAMYY0AaCqDLzRUcR7ATR9lG0/qIA4A68eXjzk1ccUuO5LgGsaSoNRsaL/eJgq3EAAqNkHQho7l+44irhEA9y8vJ61gqYJaelRRL022qCvY0994nh+gacDMxi1UX9eebRLsWJBMl69BoxWG3VMjN+PEU6PIqSFghLsUcxDTZ+7dAn2TWSMA6MUIgPcdSk4CTWiocamma2t73fMAQIs1So9pSsRDJqMig3iI9jSE7mD/TXeqhdzBrSLJTrY1BTAUPEKxBEsweeAaS9UFdsx/beHgqhGkrx+e1KVG9RQkTkPSCE2994y+WAAVthRh0uhp0nc/CXb5RWzD2meOil5RvowNTgeLwcpMtX2jHGomAKppBWYl1TMUtOInJ4lkZWNdHKDoTJEqzqDO3ghDFllt8ojD0Cm186aWPgDgTsSPTC8Awr6wEvoHULhI8kdnaVg5Y6gohkvQmmyhFLEWACj25HTvjGpTT3SsaZJIVTBl4L0NoIYQbepd6+QAOHnwxuIVvXYX++45gHRb4wCiQ9DVpfMA9iaElFcKPzsJIShxoPLaFYDBTYmJ0d4gCjWp50eJ5ORjgy40KseOrJtdAEhC0If3EwQi0ASHGBT3XmgC9eF1coDiArTBI+eBwlyadA0SbeUCJi2PcD4OoJl70AuAhnDVABr/AImfzfdOss1pnIzKDWDjafFKnH5XdHDoJrQAMEnFSoJVAggJ+mBSAox95x32zWfdACia0jgT3QZvKuvek5PRoj8cm+5oWG5wRPoHoQPMHIMB0HrJg+tmClgKvfcAxUpHi/BNU0S0elgiOgkNopa2ShaZ6CYAoEBARA+PJhyBDQUEWFf0aCD7Cn8H3BH/TdM6Dr9LL3dcCABJyETh8gHsevzrvS9YhOAtkJFeTUSPgScLfQL0L+TKXebd7e+0rJGuR52vWcFlfZHyxQmn3Uy7hwPzI0+T+AGK8TuGKt2LAgDNn9SvQX1/97MBlfNOg+g3LdLocT/v7Ppu3YWw65aNUm7f0GRA1zUycMYmObZ5FGz4lauu7S8lGWWcbi3sIa7uD9om5rLQWAgACz15/PChoMAIgEOxTQc3yREAB0fbQ/HkEQCHYpsObpIjAA6OtofiySMADsU2HdwkRwAcHG0PxZOXAkAS4u/YoHSvJAxLCTU9BfeVvHAoKHaETXIwAKpgk0xbGklzZ930bWKQBgcR0UOuN1nZxRFHGM03ajmDAJCEjedGajphkGXD5hMa5pp17hDAN0/xB4MQMBFCYgQEiyal5OPYTAr05QPgk6fGDB80xRa0IqFIkZTxt7YbJdTd9UQGCddSpYPbmHwBLm1c2EW5meQ68mY1LyWM0CIbSOyfCxj5fwov32+bq0h3dcqoYAUVQOSzoRcQxqRKlYueuWFk5y6/I4+Mh3dF8wDAiSc7lZspTktCiRLFCqSKTzJ8OlqlEJKkIJFs4hOSkJ3LpU8EdADRODaMArPqAujJD7unPIxTzGbDAb5gu5H1ewBQn6N7BwWL3CDOZ4jpU93DNfBk8YxjgyiwBwCVSQqrp4oG1s21QKQWEXKkV8AkObSLA9TvUP5I0b4Y7dEqh4/LpClMvNqQbOINos8RP5UuAGDivafu3YHVk5+OJs8NXqSHk1+GPOeHzBQ6g1CTz104+AfQGVAGSR6hxItSc5I6GHsuLz7iKbzhC+wCAOy6uambpAN+SEmaednRjDWSD8jJRwnk5i8qjmmaiOk4jg2hQBcAkOEft01+WcPquYCRbpkodfTv4Yd0Ze62QemjERQiA/ufH9KZ32ab7mHNM9AhjtpPx5ENodkRNY0uAFCQQRoTvfmazeOWKhQ7lMOdMW0FtD6PS/gDtu/Z+h3+BHoMNhc+H1GEPKyL2QWAUtjIYzvONp6+BgBU98AVqLodAgAyVz9lm9Kw5hkUcFClO91P97DS7oiYdxcHwK37knZPmSQ4eL5qGzt/CACICZxmGxdyAwB8CFQTjRxgg6DTBQA27wwuZG5tHtr+lWw3d/U1m7qrZ27r8xQx0BlsR+ErP8KoA2zQ5jOVLgDgrMGJQ3uSc8sHwOlF/tPqrVEAUQLZYMrFUBIbBRDzEOcRMQHavJ1T4WN0C0Bx7IbRYKun0wUACg9oDMmV5PSX4a7artFEBfERcHMnP9MD5w8KITVt3IhJx9GVVvBu9e6tYPFdACDkS30flSd4/TjhtEynNInOlbRcOYeWY1PRwIYz4ATiEmcKJZD3iA1MSgoc6Rg6hodXsHGresSsWACNiWlSdC/bbDg+fRRBGhbcvSXr9+gASXAj02F00hEkCfff0raFLuO0kh/HBlFgFgCI5+PFo1fPTWyfVSVSNBm6bNNwqSMaSFcRegdMmhQnod/dqeUWpufd4CYRG0SjI3oq88LBVKLiAMIs5B4AAIGH7xTbdK/oCgfjFbyuJJoTcH0M18xTwXrd5ir0I5qah3BxfRlB2P2YgGj8OIZg7/ybjlNvn9IBjqu0Me4KQPmD9aNIYvt/7hDSZium3JsTmOQK1aAAjkD7Vr5DthCdQGjEiFaPLjDhChU55L+0djl+0eaMW0H1DVpkLwCK1WMR4NVDMaQBwaxBejh9aamdJwo4jg2nwCAAtNeQBNlOazbu8KF1Cx04aUwwCfseRLOmDafhoZ7ewgA41KsdJ7+HAiMAthwUIwBGAGw5BbZ8+SMHGAGw5RTY8uWPHGAEwJZTYMuXP3KAEQBbToEtX/7IAUYAbDkFtnz5IwcYAbDlFNjy5Y8cYATAllNgy5c/coARAFtOgS1f/sgBRgBsOQW2fPkjBxgBsOUU2PLljxxgBMCWU2DLlz9ygBEAW06BLV/+yAFGAGw5BbZ8+SMHGAGw5RTY8uWPHGAEwJZTYMuXP3KAEQBbToEtX/7IAbYcAP8PmU3/F/4gW0oAAAAASUVORK5CYII="}})
}).exports(function(lychee, global, attachments) {

	const _child_process = global.require('child_process');
	const _Button        = lychee.import('lychee.ui.entity.Button');
	const _CONFIG        = attachments["json"].buffer;
	const _TEXTURE       = attachments["png"];
	const _ROOT          = lychee.ROOT.lychee;



	/*
	 * HELPERS
	 */

	const _is_value = function(value) {

		value = typeof value === 'string' ? value : null;


		if (value !== null) {

			let action   = value.split('=')[0] || '';
			let resource = value.split('=')[1] || '';
			let data     = value.split('=')[2] || '';


			if (action === 'boot' && resource !== '') {

				return true;

			} else if (action === 'profile' && resource !== '' && data !== '') {

				return true;

			} else if (action === 'unboot') {

				return true;

			} else if (/^(start|stop|edit|file|web)$/g.test(action) && resource !== '') {

				return true;

			} else if (action === 'refresh') {

				return true;

			}

		}


		return false;

	};

	const _help = function(value) {

		let action = value.split('=')[0];
		let result = false;


		if (action === 'refresh') {

			// TODO: How to refresh the local program?
			// Restart with same arguments might fail due to serialization.

		} else {

			try {

				let helper = _child_process.execFile(_ROOT + '/bin/helper.sh', [
					'lycheejs://' + value
				], {
					cwd: _ROOT
				}, function(error, stdout, stderr) {

					stderr = (stderr.trim() || '').toString();

					if (stderr !== '') {

						if (lychee.debug === true) {

							stderr.trim().split('\n').forEach(function(line) {
								console.error('lychee.ui.entity.Helper: "' + line.trim() + '"');
							});

						}

					}

				});

				helper.stdout.on('data', function(lines) {});
				helper.stderr.on('data', function(lines) {});

				helper.on('error', function() {
					this.kill('SIGTERM');
				});

				helper.on('exit', function(code) {});

				result = true;

			} catch (err) {

				result = false;

			}

		}


		return result;

	};



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({
			label: 'HELPER'
		}, data);


		this.__action = null;


		_Button.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.bind('change', function(value) {
			return _help(value);
		}, this);

	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Button.prototype.serialize.call(this);
			data['constructor'] = 'lychee.ui.entity.Helper';


			return data;

		},

		render: function(renderer, offsetX, offsetY) {

			if (this.visible === false) return;


			let action   = this.__action;
			let alpha    = this.alpha;
			let font     = this.font;
			let label    = this.label;
			let position = this.position;
			let x        = position.x + offsetX;
			let y        = position.y + offsetY;
			let hwidth   = this.width  / 2;
			let hheight  = this.height / 2;


			if (alpha !== 1) {
				renderer.setAlpha(alpha);
			}


			renderer.drawBox(
				x - hwidth,
				y - hheight,
				x + hwidth,
				y + hheight,
				'#545454',
				true
			);


			let pulse = this.__pulse;
			if (pulse.active === true) {

				renderer.setAlpha(pulse.alpha);

				renderer.drawBox(
					x - hwidth,
					y - hheight,
					x + hwidth,
					y + hheight,
					'#32afe5',
					true
				);

				renderer.setAlpha(1.0);

			}


			if (action !== null) {

				let map = _CONFIG.map[action] || null;
				if (map !== null) {

					if (this.width > 96) {

						renderer.drawSprite(
							x - hwidth,
							y - hheight,
							_TEXTURE,
							map[0]
						);

						renderer.drawText(
							x,
							y,
							label,
							font,
							true
						);

					} else {

						renderer.drawSprite(
							x - map[0].w / 2,
							y - hheight,
							_TEXTURE,
							map[0]
						);

					}

				} else if (label !== null && font !== null) {

					renderer.drawText(
						x,
						y,
						label,
						font,
						true
					);

				}

			} else if (label !== null && font !== null) {

				renderer.drawText(
					x,
					y,
					label,
					font,
					true
				);

			}


			if (alpha !== 1) {
				renderer.setAlpha(1.0);
			}

		},



		/*
		 * CUSTOM API
		 */

		setValue: function(value) {

			value = typeof value === 'string' ? value : null;


			if (value !== null && _is_value(value) === true) {

				this.value    = value;
				this.__action = value.split('=')[0] || null;

				return true;

			}


			return false;

		}

	};


	return Composite;

});


lychee.define('lychee.ui.entity.Upload').tags({
	platform: 'node'
}).includes([
	'lychee.ui.entity.Button'
]).supports(function(lychee, global) {

	// XXX: This is a stub API

	return true;

}).exports(function(lychee, global, attachments) {

	const _Button = lychee.import('lychee.ui.entity.Button');



	/*
	 * IMPLEMENTATION
	 */

	let Composite = function(data) {

		let settings = Object.assign({
			label: 'UPLOAD'
		}, data);


		this.type  = Composite.TYPE.asset;
		this.value = [];


		this.setType(settings.type);
		this.setValue(settings.value);

		delete settings.type;
		delete settings.value;


		_Button.call(this, settings);

		settings = null;



		/*
		 * INITIALIZATION
		 */

		this.unbind('touch');
		this.bind('touch', function() {

			// TODO: Show file dialog
			// TODO: trigger 'change' with null on no selection
			// TODO: trigger 'change' with Asset array on selection

		}, this);

	};


	Composite.TYPE = {
		'all':     0,
		'config':  1,
		'font':    2,
		'music':   3,
		'sound':   4,
		'texture': 5,
		'stuff':   6
	};


	Composite.prototype = {

		/*
		 * ENTITY API
		 */

		// deserialize: function(blob) {},

		serialize: function() {

			let data = _Button.prototype.serialize.call(this);
			data['constructor'] = 'lychee.ui.entity.Upload';


			return data;

		},



		/*
		 * CUSTOM API
		 */

		setType: function(type) {

			type = lychee.enumof(Composite.TYPE, type) ? type : null;


			if (type !== null) {

				this.type = type;

				return true;

			}


			return false;

		},

		setValue: function(value) {

			value = value instanceof Array ? value : null;


			if (value !== null) {

				this.value = value.filter(function(asset) {

					if (asset instanceof global.Config)  return true;
					if (asset instanceof global.Font)    return true;
					if (asset instanceof global.Music)   return true;
					if (asset instanceof global.Sound)   return true;
					if (asset instanceof global.Texture) return true;
					if (asset instanceof global.Stuff)   return true;


					return false;

				});


				return true;

			}


			return false;

		}

	};


	return Composite;

});


(function(lychee, global) {

	let environment = lychee.deserialize({"constructor":"lychee.Environment","arguments":[{"id":"/libraries/harvester/dist","build":"harvester.Main","debug":false,"sandbox":false,"timeout":5000,"type":"build","tags":{"platform":["node"]}}],"blob":{"definitions":{"harvester.Main":{"constructor":"lychee.Definition","arguments":["harvester.Main"],"blob":{"attaches":{},"requires":["lychee.Input","harvester.net.Admin","harvester.net.Server","harvester.Watcher"],"includes":["lychee.event.Emitter"],"exports":"function (lychee, global, attachments) {\n\n\tconst _harvester     = lychee.import('harvester');\n\tconst _clearInterval = global.clearInterval || function() {};\n\tconst _setInterval   = global.setInterval;\n\tconst _Emitter       = lychee.import('lychee.event.Emitter');\n\tconst _INTERFACES    = (function() {\n\n\t\tlet os = null;\n\n\t\ttry {\n\t\t\tos = require('os');\n\t\t} catch (err) {\n\t\t}\n\n\n\t\tif (os !== null) {\n\n\t\t\tlet candidates = [];\n\n\t\t\tObject.values(os.networkInterfaces()).forEach(function(iface) {\n\n\t\t\t\tiface.forEach(function(alias) {\n\n\t\t\t\t\tif (alias.internal === false) {\n\n\t\t\t\t\t\tif (alias.family === 'IPv6' && alias.scopeid === 0) {\n\t\t\t\t\t\t\tcandidates.push(alias.address);\n\t\t\t\t\t\t} else if (alias.family === 'IPv4') {\n\t\t\t\t\t\t\tcandidates.push(alias.address);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t});\n\n\t\t\t});\n\n\t\t\treturn candidates.unique();\n\n\t\t}\n\n\n\t\treturn [];\n\n\t})();\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _is_public = function(host) {\n\n\t\tif (host === '::1' || host === 'localhost') {\n\n\t\t\treturn false;\n\n\t\t} else if (/:/g.test(host) === true) {\n\n\t\t\t// TODO: Detect private IPv6 ranges?\n\n\t\t} else if (/\\./g.test(host) === true) {\n\n\t\t\tlet tmp = host.split('.');\n\n\t\t\tif (tmp[0] === '10') {\n\n\t\t\t\treturn false;\n\n\t\t\t} else if (tmp[0] === '192' && tmp[1] === '168') {\n\n\t\t\t\treturn false;\n\n\t\t\t} else if (tmp[0] === '172') {\n\n\t\t\t\tlet tmp2 = parseInt(tmp[1], 10);\n\t\t\t\tif (!isNaN(tmp2) && tmp2 >= 16 && tmp2 <= 31) {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn true;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(settings) {\n\n\t\tthis.settings = lychee.assignunlink({\n\t\t\thost:    null,\n\t\t\tport:    null,\n\t\t\tsandbox: false\n\t\t}, settings);\n\n\t\tthis.defaults = lychee.assignunlink({\n\t\t\thost:    null,\n\t\t\tport:    null,\n\t\t\tsandbox: false\n\t\t}, this.settings);\n\n\n\t\t// Updated by Watcher instance\n\t\tthis._libraries = {};\n\t\tthis._projects  = {};\n\n\t\tthis.admin   = null;\n\t\tthis.server  = null;\n\t\tthis.watcher = new _harvester.Watcher(this);\n\n\t\tthis.__interval = null;\n\n\n\t\tsettings.host    = typeof settings.host === 'string' ? settings.host       : null;\n\t\tsettings.port    = typeof settings.port === 'number' ? (settings.port | 0) : 8080;\n\t\tsettings.sandbox = settings.sandbox === true;\n\n\n\t\t_Emitter.call(this);\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('load', function() {\n\n\t\t\tthis.admin  = new _harvester.net.Admin({\n\t\t\t\thost: null,\n\t\t\t\tport: 4848\n\t\t\t});\n\n\t\t\tthis.server = new _harvester.net.Server({\n\t\t\t\thost: settings.host === 'localhost' ? null : settings.host,\n\t\t\t\tport: settings.port\n\t\t\t});\n\n\t\t}, this, true);\n\n\t\tthis.bind('init', function() {\n\n\t\t\tthis.admin.connect();\n\t\t\tthis.server.connect();\n\n\n\t\t\tconsole.log('\\n');\n\t\t\tconsole.info('+-------------------------------------------------------+');\n\t\t\tconsole.info('| Open one of these URLs with a Blink-based Web Browser |');\n\t\t\tconsole.info('+-------------------------------------------------------+');\n\t\t\tconsole.log('\\n');\n\t\t\tthis.getHosts().forEach(function(host) {\n\t\t\t\tconsole.log(host);\n\t\t\t});\n\t\t\tconsole.log('\\n\\n');\n\n\t\t}, this, true);\n\n\t\tthis.bind('init', function() {\n\n\t\t\tlet watcher = this.watcher || null;\n\t\t\tif (watcher !== null) {\n\n\t\t\t\twatcher.init(settings.sandbox);\n\n\t\t\t\tthis.__interval = _setInterval(function() {\n\t\t\t\t\twatcher.update();\n\t\t\t\t}.bind(this), 30000);\n\n\t\t\t}\n\n\t\t}, this, true);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\tdeserialize: function(blob) {\n\n\t\t\tlet admin = lychee.deserialize(blob.admin);\n\t\t\tif (admin !== null) {\n\t\t\t\tthis.admin = admin;\n\t\t\t}\n\n\n\t\t\tlet server = lychee.deserialize(blob.server);\n\t\t\tif (server !== null) {\n\t\t\t\tthis.server = server;\n\t\t\t}\n\n\t\t},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.Main';\n\n\n\t\t\tlet settings = lychee.assignunlink({}, this.settings);\n\t\t\tlet blob     = data['blob'] || {};\n\n\n\t\t\tif (this.admin !== null)  blob.admin  = lychee.serialize(this.admin);\n\t\t\tif (this.server !== null) blob.server = lychee.serialize(this.server);\n\n\n\t\t\tdata['arguments'][0] = settings;\n\t\t\tdata['blob']         = Object.keys(blob).length > 0 ? blob : null;\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * MAIN API\n\t\t */\n\n\t\tinit: function() {\n\n\t\t\tthis.trigger('load');\n\t\t\tthis.trigger('init');\n\n\t\t\treturn true;\n\n\t\t},\n\n\t\tdestroy: function() {\n\n\t\t\tfor (let pid in this._projects) {\n\n\t\t\t\tlet project = this._projects[pid];\n\t\t\t\tif (project.server !== null) {\n\n\t\t\t\t\tif (typeof project.server.destroy === 'function') {\n\t\t\t\t\t\tproject.server.destroy();\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (this.admin !== null) {\n\t\t\t\tthis.admin.disconnect();\n\t\t\t\tthis.admin = null;\n\t\t\t}\n\n\t\t\tif (this.server !== null) {\n\t\t\t\tthis.server.disconnect();\n\t\t\t\tthis.server = null;\n\t\t\t}\n\n\t\t\tif (this.__interval !== null) {\n\t\t\t\t_clearInterval(this.__interval);\n\t\t\t\tthis.__interval = null;\n\t\t\t}\n\n\n\t\t\tthis.trigger('destroy');\n\n\t\t\treturn true;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tgetHosts: function() {\n\n\t\t\tlet filtered = [];\n\n\n\t\t\tlet server = this.server;\n\t\t\tif (server !== null) {\n\n\t\t\t\tlet host = server.host || null;\n\t\t\t\tlet port = server.port;\n\t\t\t\tif (host === null) {\n\n\t\t\t\t\tfor (let i = 0, il = _INTERFACES.length; i < il; i++) {\n\n\t\t\t\t\t\tlet iface = _INTERFACES[i];\n\t\t\t\t\t\tif (/:/g.test(iface)) {\n\t\t\t\t\t\t\tfiltered.push('http://[' + iface + ']:' + port);\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tfiltered.push('http://' + iface + ':' + port);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t\tfiltered.push('http://localhost:' + port);\n\n\t\t\t\t} else {\n\n\t\t\t\t\tif (/:/g.test(host)) {\n\t\t\t\t\t\tfiltered.push('http://[' + host + ']:' + port);\n\t\t\t\t\t} else {\n\t\t\t\t\t\tfiltered.push('http://' + host + ':' + port);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn filtered;\n\n\t\t},\n\n\t\tgetNetworks: function() {\n\n\t\t\tlet networks = [];\n\t\t\tlet server   = null;\n\n\t\t\tif (server !== null) {\n\n\t\t\t\tlet host = server.host || null;\n\t\t\t\tlet port = server.port;\n\n\t\t\t\tif (_is_public(host) === true) {\n\t\t\t\t\tnetworks.push((/:/g.test(host) ? '[' + host + ']' : host) + ':' + port);\n\t\t\t\t}\n\n\t\t\t\tnetworks.push.apply(networks, _INTERFACES.filter(_is_public).map(function(host) {\n\t\t\t\t\treturn (/:/g.test(host) ? '[' + host + ']' : host) + ':' + port;\n\t\t\t\t}));\n\n\t\t\t}\n\n\n\t\t\treturn networks;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.event.Emitter":{"constructor":"lychee.Definition","arguments":["lychee.event.Emitter"],"blob":{"attaches":{},"exports":"function (lychee, global, attachments) {\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _bind = function(event, callback, scope, once) {\n\n\t\tif (event === null || callback === null) {\n\t\t\treturn false;\n\t\t}\n\n\n\t\tlet pass_event = false;\n\t\tlet pass_self  = false;\n\n\t\tlet modifier = event.charAt(0);\n\t\tif (modifier === '@') {\n\n\t\t\tevent      = event.substr(1, event.length - 1);\n\t\t\tpass_event = true;\n\n\t\t} else if (modifier === '#') {\n\n\t\t\tevent     = event.substr(1, event.length - 1);\n\t\t\tpass_self = true;\n\n\t\t}\n\n\n\t\tif (this.___events[event] === undefined) {\n\t\t\tthis.___events[event] = [];\n\t\t}\n\n\n\t\tthis.___events[event].push({\n\t\t\tpass_event: pass_event,\n\t\t\tpass_self:  pass_self,\n\t\t\tcallback:   callback,\n\t\t\tscope:      scope,\n\t\t\tonce:       once\n\t\t});\n\n\n\t\treturn true;\n\n\t};\n\n\tconst _relay = function(event, instance, once) {\n\n\t\tif (event === null || instance === null) {\n\t\t\treturn false;\n\t\t}\n\n\n\t\tlet callback = function() {\n\n\t\t\tlet event = arguments[0];\n\t\t\tlet data  = [];\n\n\t\t\tfor (let a = 1, al = arguments.length; a < al; a++) {\n\t\t\t\tdata.push(arguments[a]);\n\t\t\t}\n\n\t\t\tthis.trigger(event, data);\n\n\t\t};\n\n\n\t\tif (this.___events[event] === undefined) {\n\t\t\tthis.___events[event] = [];\n\t\t}\n\n\n\t\tthis.___events[event].push({\n\t\t\tpass_event: true,\n\t\t\tpass_self:  false,\n\t\t\tcallback:   callback,\n\t\t\tscope:      instance,\n\t\t\tonce:       once\n\t\t});\n\n\n\t\treturn true;\n\n\t};\n\n\tconst _trigger = function(event, data) {\n\n\t\tif (this.___events !== undefined && this.___events[event] !== undefined) {\n\n\t\t\tlet value = undefined;\n\n\t\t\tfor (let e = 0; e < this.___events[event].length; e++) {\n\n\t\t\t\tlet args  = [];\n\t\t\t\tlet entry = this.___events[event][e];\n\n\t\t\t\tif (entry.pass_event === true) {\n\n\t\t\t\t\targs.push(event);\n\n\t\t\t\t} else if (entry.pass_self === true) {\n\n\t\t\t\t\targs.push(this);\n\n\t\t\t\t}\n\n\n\t\t\t\tif (data !== null) {\n\t\t\t\t\targs.push.apply(args, data);\n\t\t\t\t}\n\n\n\t\t\t\tlet result = entry.callback.apply(entry.scope, args);\n\t\t\t\tif (result !== undefined) {\n\t\t\t\t\tvalue = result;\n\t\t\t\t}\n\n\n\t\t\t\tif (entry.once === true) {\n\n\t\t\t\t\tif (this.unbind(event, entry.callback, entry.scope) === true) {\n\t\t\t\t\t\te--;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (value !== undefined) {\n\t\t\t\treturn value;\n\t\t\t} else {\n\t\t\t\treturn true;\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn false;\n\n\t};\n\n\tconst _unbind = function(event, callback, scope) {\n\n\t\tlet found = false;\n\n\t\tif (event !== null) {\n\n\t\t\tfound = _unbind_event.call(this, event, callback, scope);\n\n\t\t} else {\n\n\t\t\tfor (event in this.___events) {\n\n\t\t\t\tlet result = _unbind_event.call(this, event, callback, scope);\n\t\t\t\tif (result === true) {\n\t\t\t\t\tfound = true;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn found;\n\n\t};\n\n\tconst _unbind_event = function(event, callback, scope) {\n\n\t\tif (this.___events !== undefined && this.___events[event] !== undefined) {\n\n\t\t\tlet found = false;\n\n\t\t\tfor (let e = 0, el = this.___events[event].length; e < el; e++) {\n\n\t\t\t\tlet entry = this.___events[event][e];\n\n\t\t\t\tif ((callback === null || entry.callback === callback) && (scope === null || entry.scope === scope)) {\n\n\t\t\t\t\tfound = true;\n\n\t\t\t\t\tthis.___events[event].splice(e, 1);\n\t\t\t\t\tel--;\n\t\t\t\t\te--;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn found;\n\n\t\t}\n\n\n\t\treturn false;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function() {\n\n\t\tthis.___events   = {};\n\t\tthis.___timeline = {\n\t\t\tbind:    [],\n\t\t\ttrigger: [],\n\t\t\trelay:   [],\n\t\t\tunbind:  []\n\t\t};\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\tdeserialize: function(blob) {\n\n\t\t\tif (blob.events instanceof Object) {\n\t\t\t\t// TODO: deserialize events\n\t\t\t}\n\n\t\t\tif (blob.timeline instanceof Object) {\n\t\t\t\t// TODO: deserialize timeline\n\t\t\t}\n\n\t\t},\n\n\t\tserialize: function() {\n\n\t\t\tlet blob = {};\n\n\n\t\t\tif (Object.keys(this.___events).length > 0) {\n\n\t\t\t\tblob.events = {};\n\n\t\t\t\tfor (let event in this.___events) {\n\n\t\t\t\t\tblob.events[event] = [];\n\n\t\t\t\t\tfor (let e = 0, el = this.___events[event].length; e < el; e++) {\n\n\t\t\t\t\t\tlet entry = this.___events[event][e];\n\n\t\t\t\t\t\tblob.events[event].push({\n\t\t\t\t\t\t\tpass_event: entry.pass_event,\n\t\t\t\t\t\t\tpass_self:  entry.pass_self,\n\t\t\t\t\t\t\tcallback:   lychee.serialize(entry.callback),\n\t\t\t\t\t\t\t// scope:      lychee.serialize(entry.scope),\n\t\t\t\t\t\t\tscope:      null,\n\t\t\t\t\t\t\tonce:       entry.once\n\t\t\t\t\t\t});\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (this.___timeline.bind.length > 0 || this.___timeline.trigger.length > 0 || this.___timeline.unbind.length > 0) {\n\n\t\t\t\tblob.timeline = {};\n\n\n\t\t\t\tif (this.___timeline.bind.length > 0) {\n\n\t\t\t\t\tblob.timeline.bind = [];\n\n\t\t\t\t\tfor (let b = 0, bl = this.___timeline.bind.length; b < bl; b++) {\n\t\t\t\t\t\tblob.timeline.bind.push(this.___timeline.bind[b]);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tif (this.___timeline.trigger.length > 0) {\n\n\t\t\t\t\tblob.timeline.trigger = [];\n\n\t\t\t\t\tfor (let t = 0, tl = this.___timeline.trigger.length; t < tl; t++) {\n\t\t\t\t\t\tblob.timeline.trigger.push(this.___timeline.trigger[t]);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tif (this.___timeline.unbind.length > 0) {\n\n\t\t\t\t\tblob.timeline.unbind = [];\n\n\t\t\t\t\tfor (let u = 0, ul = this.___timeline.unbind.length; u < ul; u++) {\n\t\t\t\t\t\tblob.timeline.unbind.push(this.___timeline.unbind[u]);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'lychee.event.Emitter',\n\t\t\t\t'arguments':   [],\n\t\t\t\t'blob':        Object.keys(blob).length > 0 ? blob : null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tbind: function(event, callback, scope, once) {\n\n\t\t\tevent    = typeof event === 'string'    ? event    : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\t\t\tonce     = once === true;\n\n\n\t\t\tlet result = _bind.call(this, event, callback, scope, once);\n\t\t\tif (result === true && lychee.debug === true) {\n\n\t\t\t\tthis.___timeline.bind.push({\n\t\t\t\t\ttime:     Date.now(),\n\t\t\t\t\tevent:    event,\n\t\t\t\t\tcallback: lychee.serialize(callback),\n\t\t\t\t\t// scope:    lychee.serialize(scope),\n\t\t\t\t\tscope:    null,\n\t\t\t\t\tonce:     once\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\trelay: function(event, instance, once) {\n\n\t\t\tevent    = typeof event === 'string'               ? event    : null;\n\t\t\tinstance = lychee.interfaceof(Composite, instance) ? instance : null;\n\t\t\tonce     = once === true;\n\n\n\t\t\tlet result = _relay.call(this, event, instance, once);\n\t\t\tif (result === true && lychee.debug === true) {\n\n\t\t\t\tthis.___timeline.relay.push({\n\t\t\t\t\ttime:     Date.now(),\n\t\t\t\t\tevent:    event,\n\t\t\t\t\tinstance: lychee.serialize(instance),\n\t\t\t\t\tonce:     once\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\ttrigger: function(event, data) {\n\n\t\t\tevent = typeof event === 'string' ? event : null;\n\t\t\tdata  = data instanceof Array     ? data  : null;\n\n\n\t\t\tlet result = _trigger.call(this, event, data);\n\t\t\tif (result === true && lychee.debug === true) {\n\n\t\t\t\tthis.___timeline.trigger.push({\n\t\t\t\t\ttime:  Date.now(),\n\t\t\t\t\tevent: event,\n\t\t\t\t\tdata:  lychee.serialize(data)\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\tunbind: function(event, callback, scope) {\n\n\t\t\tevent    = typeof event === 'string'    ? event    : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : null;\n\n\n\t\t\tlet result = _unbind.call(this, event, callback, scope);\n\t\t\tif (result === true) {\n\n\t\t\t\tthis.___timeline.unbind.push({\n\t\t\t\t\ttime:     Date.now(),\n\t\t\t\t\tevent:    event,\n\t\t\t\t\tcallback: lychee.serialize(callback),\n\t\t\t\t\t// scope:    lychee.serialize(scope)\n\t\t\t\t\tscope:    null\n\t\t\t\t});\n\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.Input":{"constructor":"lychee.Definition","arguments":["lychee.Input"],"blob":{"attaches":{},"tags":{"platform":"node"},"includes":["lychee.event.Emitter"],"supports":"function (lychee, global) {\n\n\tif (\n\t\ttypeof global.process !== 'undefined'\n\t\t&& typeof global.process.stdin === 'object'\n\t\t&& typeof global.process.stdin.on === 'function'\n\t) {\n\t\treturn true;\n\t}\n\n\n\treturn false;\n\n}","exports":"function (lychee, global, attachments) {\n\n\tconst _process   = global.process;\n\tconst _Emitter   = lychee.import('lychee.event.Emitter');\n\tconst _INSTANCES = [];\n\n\n\n\t/*\n\t * EVENTS\n\t */\n\n\tconst _listeners = {\n\n\t\tkeypress: function(key) {\n\n\t\t\t// TTY conform behaviour\n\t\t\tif (key.ctrl === true && key.name === 'c') {\n\n\t\t\t\tkey.name  = 'escape';\n\t\t\t\tkey.ctrl  = false;\n\t\t\t\tkey.alt   = false;\n\t\t\t\tkey.shift = false;\n\n\t\t\t}\n\n\n\t\t\tfor (let i = 0, l = _INSTANCES.length; i < l; i++) {\n\t\t\t\t_process_key.call(_INSTANCES[i], key.name, key.ctrl, key.meta, key.shift);\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * FEATURE DETECTION\n\t */\n\n\t(function() {\n\n\t\tlet keypress = true;\n\t\tif (keypress === true) {\n\t\t\t_process.stdin.on('keypress', _listeners.keypress);\n\t\t}\n\n\n\t\tif (lychee.debug === true) {\n\n\t\t\tlet methods = [];\n\n\t\t\tif (keypress) methods.push('Keyboard');\n\n\t\t\tif (methods.length === 0) {\n\t\t\t\tconsole.error('lychee.Input: Supported methods are NONE');\n\t\t\t} else {\n\t\t\t\tconsole.info('lychee.Input: Supported methods are ' + methods.join(', '));\n\t\t\t}\n\n\t\t}\n\n\t})();\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _process_key = function(key, ctrl, alt, shift) {\n\n\t\tif (this.key === false) {\n\n\t\t\treturn false;\n\n\t\t} else if (this.keymodifier === false) {\n\n\t\t\tif (key === 'ctrl' || key === 'meta' || key === 'shift') {\n\t\t\t\treturn true;\n\t\t\t}\n\n\t\t}\n\n\n\t\tlet name    = '';\n\t\tlet handled = false;\n\t\tlet delta   = Date.now() - this.__clock.key;\n\n\t\tif (delta < this.delay) {\n\t\t\treturn true;\n\t\t} else {\n\t\t\tthis.__clock.key = Date.now();\n\t\t}\n\n\n\t\t// 0. Computation: Normal Characters\n\t\tif (ctrl  === true) name += 'ctrl-';\n\t\tif (alt   === true) name += 'alt-';\n\t\tif (shift === true) name += 'shift-';\n\n\t\tname += key.toLowerCase();\n\n\n\t\t// 1. Event API\n\t\tif (key !== null) {\n\n\t\t\t// allow bind('key') and bind('ctrl-a');\n\n\t\t\thandled = this.trigger('key', [ key, name, delta ]) || handled;\n\t\t\thandled = this.trigger(name,  [ delta ])            || handled;\n\n\t\t}\n\n\n\t\treturn handled;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({}, data);\n\n\n\t\tthis.delay       = 0;\n\t\tthis.key         = false;\n\t\tthis.keymodifier = false;\n\t\tthis.touch       = false;\n\t\tthis.swipe       = false;\n\n\t\tthis.__clock  = {\n\t\t\tkey:   Date.now(),\n\t\t\ttouch: Date.now(),\n\t\t\tswipe: Date.now()\n\t\t};\n\n\n\t\tthis.setDelay(settings.delay);\n\t\tthis.setKey(settings.key);\n\t\tthis.setKeyModifier(settings.keymodifier);\n\t\tthis.setTouch(settings.touch);\n\t\tthis.setSwipe(settings.swipe);\n\n\n\t\t_Emitter.call(this);\n\n\t\t_INSTANCES.push(this);\n\n\t\tsettings = null;\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\tdestroy: function() {\n\n\t\t\tlet found = false;\n\n\t\t\tfor (let i = 0, il = _INSTANCES.length; i < il; i++) {\n\n\t\t\t\tif (_INSTANCES[i] === this) {\n\t\t\t\t\t_INSTANCES.splice(i, 1);\n\t\t\t\t\tfound = true;\n\t\t\t\t\til--;\n\t\t\t\t\ti--;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tthis.unbind();\n\n\n\t\t\treturn found;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.Input';\n\n\t\t\tlet settings = {};\n\n\n\t\t\tif (this.delay !== 0)           settings.delay       = this.delay;\n\t\t\tif (this.key !== false)         settings.key         = this.key;\n\t\t\tif (this.keymodifier !== false) settings.keymodifier = this.keymodifier;\n\t\t\tif (this.touch !== false)       settings.touch       = this.touch;\n\t\t\tif (this.swipe !== false)       settings.swipe       = this.swipe;\n\n\n\t\t\tdata['arguments'][0] = settings;\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsetDelay: function(delay) {\n\n\t\t\tdelay = typeof delay === 'number' ? delay : null;\n\n\n\t\t\tif (delay !== null) {\n\n\t\t\t\tthis.delay = delay;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetKey: function(key) {\n\n\t\t\tkey = typeof key === 'boolean' ? key : null;\n\n\n\t\t\tif (key !== null) {\n\n\t\t\t\tthis.key = key;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetKeyModifier: function(keymodifier) {\n\n\t\t\tkeymodifier = typeof keymodifier === 'boolean' ? keymodifier : null;\n\n\n\t\t\tif (keymodifier !== null) {\n\n\t\t\t\tthis.keymodifier = keymodifier;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetTouch: function(touch) {\n\n\t\t\ttouch = typeof touch === 'boolean' ? touch : null;\n\n\n\t\t\tif (touch !== null) {\n\n\t\t\t\t// XXX: No touch support\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetScroll: function(scroll) {\n\n\t\t\tscroll = typeof scroll === 'boolean' ? scroll : null;\n\n\n\t\t\tif (scroll !== null) {\n\n\t\t\t\t// XXX: No scroll support\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetSwipe: function(swipe) {\n\n\t\t\tswipe = typeof swipe === 'boolean' ? swipe : null;\n\n\n\t\t\tif (swipe !== null) {\n\n\t\t\t\t// XXX: No swipe support\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.net.Admin":{"constructor":"lychee.Definition","arguments":["harvester.net.Admin"],"blob":{"attaches":{},"requires":["harvester.net.Remote","harvester.net.remote.Console","harvester.net.remote.Harvester","harvester.net.remote.Library","harvester.net.remote.Profile","harvester.net.remote.Project","harvester.net.remote.Server","lychee.codec.JSON"],"includes":["lychee.net.Server"],"exports":"function (lychee, global, attachments) {\n\n\tconst _remote = lychee.import('harvester.net.remote');\n\tconst _Remote = lychee.import('harvester.net.Remote');\n\tconst _Server = lychee.import('lychee.net.Server');\n\tconst _JSON   = lychee.import('lychee.codec.JSON');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({\n\t\t\thost:   'localhost',\n\t\t\tport:   4848,\n\t\t\tcodec:  _JSON,\n\t\t\tremote: _Remote,\n\t\t\ttype:   _Server.TYPE.HTTP\n\t\t}, data);\n\n\n\t\t_Server.call(this, settings);\n\n\t\tsettings = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('connect', function(remote) {\n\n\t\t\tremote.addService(new _remote.Console(remote));\n\t\t\tremote.addService(new _remote.Harvester(remote));\n\t\t\tremote.addService(new _remote.Library(remote));\n\t\t\tremote.addService(new _remote.Profile(remote));\n\t\t\tremote.addService(new _remote.Project(remote));\n\t\t\tremote.addService(new _remote.Server(remote));\n\n\n\t\t\tremote.bind('receive', function(payload, headers) {\n\n\t\t\t\tlet method = headers['method'];\n\t\t\t\tif (method === 'OPTIONS') {\n\n\t\t\t\t\tremote.send({}, {\n\t\t\t\t\t\t'status':                       '200 OK',\n\t\t\t\t\t\t'access-control-allow-headers': 'Content-Type, X-Service-Id, X-Service-Method, X-Service-Event',\n\t\t\t\t\t\t'access-control-allow-origin':  '*',\n\t\t\t\t\t\t'access-control-allow-methods': 'GET, POST',\n\t\t\t\t\t\t'access-control-max-age':       '3600'\n\t\t\t\t\t});\n\n\t\t\t\t} else {\n\n\t\t\t\t\tremote.send({\n\t\t\t\t\t\t'message': 'Please go away. 凸(｀⌒´メ)凸'\n\t\t\t\t\t}, {\n\t\t\t\t\t\t'status': '404 Not Found'\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t}, this);\n\n\n\t\tthis.connect();\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Server.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.Admin';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.codec.JSON":{"constructor":"lychee.Definition","arguments":["lychee.codec.JSON"],"blob":{"attaches":{},"exports":"function (lychee, global, attachments) {\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _CHARS_SEARCH = /[\\\\\\\"\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]/g;\n\tconst _CHARS_META   = {\n\t\t'\\r': '',    // FUCK YOU, Microsoft!\n\t\t'\\b': '\\\\b',\n\t\t'\\t': '\\\\t',\n\t\t'\\n': '\\\\n',\n\t\t'\\f': '\\\\f',\n\t\t'\"':  '\\\\\"',\n\t\t'\\\\': '\\\\\\\\'\n\t};\n\n\tconst _desanitize_string = function(san) {\n\n\t\tlet str = san;\n\n\t\t// str = str.replace(/\\\\b/g, '\\b');\n\t\t// str = str.replace(/\\\\f/g, '\\f');\n\t\tstr = str.replace(/\\\\t/g, '\\t');\n\t\tstr = str.replace(/\\\\n/g, '\\n');\n\t\tstr = str.replace(/\\\\\\\\/g, '\\\\');\n\n\t\treturn str;\n\n\t};\n\n\tconst _sanitize_string = function(str) {\n\n\t\tlet san = str;\n\n\t\tif (_CHARS_SEARCH.test(san)) {\n\n\t\t\tsan = san.replace(_CHARS_SEARCH, function(char) {\n\n\t\t\t\tlet meta = _CHARS_META[char];\n\t\t\t\tif (meta !== undefined) {\n\t\t\t\t\treturn meta;\n\t\t\t\t} else {\n\t\t\t\t\treturn '\\\\u' + (char.charCodeAt(0).toString(16)).slice(-4);\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t}\n\n\t\treturn san;\n\n\t};\n\n\n\n\tconst _Stream = function(buffer, mode) {\n\n\t\tthis.__buffer = typeof buffer === 'string'        ? buffer : '';\n\t\tthis.__mode   = lychee.enumof(_Stream.MODE, mode) ? mode   : 0;\n\n\t\tthis.__index  = 0;\n\n\t};\n\n\n\t_Stream.MODE = {\n\t\tread:  0,\n\t\twrite: 1\n\t};\n\n\n\t_Stream.prototype = {\n\n\t\ttoString: function() {\n\t\t\treturn this.__buffer;\n\t\t},\n\n\t\tpointer: function() {\n\t\t\treturn this.__index;\n\t\t},\n\n\t\tlength: function() {\n\t\t\treturn this.__buffer.length;\n\t\t},\n\n\t\tread: function(bytes) {\n\n\t\t\tlet buffer = '';\n\n\t\t\tbuffer       += this.__buffer.substr(this.__index, bytes);\n\t\t\tthis.__index += bytes;\n\n\t\t\treturn buffer;\n\n\t\t},\n\n\t\tsearch: function(array) {\n\n\t\t\tlet bytes = Infinity;\n\n\t\t\tfor (let a = 0, al = array.length; a < al; a++) {\n\n\t\t\t\tlet token = array[a];\n\t\t\t\tlet size  = this.__buffer.indexOf(token, this.__index + 1) - this.__index;\n\t\t\t\tif (size > -1 && size < bytes) {\n\t\t\t\t\tbytes = size;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (bytes === Infinity) {\n\t\t\t\treturn 0;\n\t\t\t}\n\n\n\t\t\treturn bytes;\n\n\t\t},\n\n\t\tseek: function(bytes) {\n\n\t\t\tif (bytes > 0) {\n\t\t\t\treturn this.__buffer.substr(this.__index, bytes);\n\t\t\t} else {\n\t\t\t\treturn this.__buffer.substr(this.__index + bytes, Math.abs(bytes));\n\t\t\t}\n\n\t\t},\n\n\t\twrite: function(buffer) {\n\n\t\t\tthis.__buffer += buffer;\n\t\t\tthis.__index  += buffer.length;\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * ENCODER and DECODER\n\t */\n\n\tconst _encode = function(stream, data) {\n\n\t\t// null,false,true: Boolean or Null or EOS\n\t\tif (typeof data === 'boolean' || data === null) {\n\n\t\t\tif (data === null) {\n\t\t\t\tstream.write('null');\n\t\t\t} else if (data === false) {\n\t\t\t\tstream.write('false');\n\t\t\t} else if (data === true) {\n\t\t\t\tstream.write('true');\n\t\t\t}\n\n\n\t\t// 123,12.3: Integer or Float\n\t\t} else if (typeof data === 'number') {\n\n\t\t\tlet type = 1;\n\t\t\tif (data < 268435456 && data !== (data | 0)) {\n\t\t\t\ttype = 2;\n\t\t\t}\n\n\n\t\t\t// Negative value\n\t\t\tlet sign = 0;\n\t\t\tif (data < 0) {\n\t\t\t\tdata = -data;\n\t\t\t\tsign = 1;\n\t\t\t}\n\n\n\t\t\tif (sign === 1) {\n\t\t\t\tstream.write('-');\n\t\t\t}\n\n\n\t\t\tif (type === 1) {\n\t\t\t\tstream.write('' + data.toString());\n\t\t\t} else {\n\t\t\t\tstream.write('' + data.toString());\n\t\t\t}\n\n\n\t\t// \"\": String\n\t\t} else if (typeof data === 'string') {\n\n\t\t\tdata = _sanitize_string(data);\n\n\n\t\t\tstream.write('\"');\n\n\t\t\tstream.write(data);\n\n\t\t\tstream.write('\"');\n\n\n\t\t// []: Array\n\t\t} else if (data instanceof Array) {\n\n\t\t\tstream.write('[');\n\n\t\t\tfor (let d = 0, dl = data.length; d < dl; d++) {\n\n\t\t\t\t_encode(stream, data[d]);\n\n\t\t\t\tif (d < dl - 1) {\n\t\t\t\t\tstream.write(',');\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tstream.write(']');\n\n\n\t\t// {}: Object\n\t\t} else if (data instanceof Object && typeof data.serialize !== 'function') {\n\n\t\t\tstream.write('{');\n\n\t\t\tlet keys = Object.keys(data);\n\n\t\t\tfor (let k = 0, kl = keys.length; k < kl; k++) {\n\n\t\t\t\tlet key = keys[k];\n\n\t\t\t\t_encode(stream, key);\n\t\t\t\tstream.write(':');\n\n\t\t\t\t_encode(stream, data[key]);\n\n\t\t\t\tif (k < kl - 1) {\n\t\t\t\t\tstream.write(',');\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tstream.write('}');\n\n\n\t\t// Custom High-Level Implementation\n\t\t} else if (data instanceof Object && typeof data.serialize === 'function') {\n\n\t\t\tstream.write('%');\n\n\t\t\tlet blob = lychee.serialize(data);\n\n\t\t\t_encode(stream, blob);\n\n\t\t\tstream.write('%');\n\n\t\t}\n\n\t};\n\n\tconst _decode = function(stream) {\n\n\t\tlet value  = undefined;\n\t\tlet seek   = '';\n\t\tlet size   = 0;\n\t\tlet tmp    = 0;\n\t\tlet errors = 0;\n\t\tlet check  = null;\n\n\n\t\tif (stream.pointer() < stream.length()) {\n\n\t\t\tseek = stream.seek(1);\n\n\n\t\t\t// null,false,true: Boolean or Null or EOS\n\t\t\tif (seek === 'n' || seek === 'f' || seek === 't') {\n\n\t\t\t\tif (stream.seek(4) === 'null') {\n\t\t\t\t\tstream.read(4);\n\t\t\t\t\tvalue = null;\n\t\t\t\t} else if (stream.seek(5) === 'false') {\n\t\t\t\t\tstream.read(5);\n\t\t\t\t\tvalue = false;\n\t\t\t\t} else if (stream.seek(4) === 'true') {\n\t\t\t\t\tstream.read(4);\n\t\t\t\t\tvalue = true;\n\t\t\t\t}\n\n\n\t\t\t// 123: Number\n\t\t\t} else if (seek === '-' || !isNaN(parseInt(seek, 10))) {\n\n\t\t\t\tsize = stream.search([ ',', ']', '}' ]);\n\n\t\t\t\tif (size > 0) {\n\n\t\t\t\t\ttmp = stream.read(size);\n\n\t\t\t\t\tif (tmp.indexOf('.') !== -1) {\n\t\t\t\t\t\tvalue = parseFloat(tmp, 10);\n\t\t\t\t\t} else {\n\t\t\t\t\t\tvalue = parseInt(tmp, 10);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t// \"\": String\n\t\t\t} else if (seek === '\"') {\n\n\t\t\t\tstream.read(1);\n\n\t\t\t\tsize = stream.search([ '\"' ]);\n\n\t\t\t\tif (size > 0) {\n\t\t\t\t\tvalue = stream.read(size);\n\t\t\t\t} else {\n\t\t\t\t\tvalue = '';\n\t\t\t\t}\n\n\n\t\t\t\tcheck = stream.read(1);\n\n\n\t\t\t\tlet unichar = stream.seek(-2);\n\n\t\t\t\twhile (check === '\"' && unichar.charAt(0) === '\\\\') {\n\n\t\t\t\t\tif (value.charAt(value.length - 1) === '\\\\') {\n\t\t\t\t\t\tvalue = value.substr(0, value.length - 1) + check;\n\t\t\t\t\t}\n\n\t\t\t\t\tsize    = stream.search([ '\"' ]);\n\t\t\t\t\tvalue  += stream.read(size);\n\t\t\t\t\tcheck   = stream.read(1);\n\t\t\t\t\tunichar = stream.seek(-2);\n\n\t\t\t\t}\n\n\t\t\t\tvalue = _desanitize_string(value);\n\n\t\t\t// []: Array\n\t\t\t} else if (seek === '[') {\n\n\t\t\t\tvalue = [];\n\n\n\t\t\t\tsize  = stream.search([ ']' ]);\n\t\t\t\tcheck = stream.read(1).trim() + stream.seek(size).trim();\n\n\t\t\t\tif (check !== '[]') {\n\n\t\t\t\t\twhile (errors === 0) {\n\n\t\t\t\t\t\tvalue.push(_decode(stream));\n\n\t\t\t\t\t\tcheck = stream.seek(1);\n\n\t\t\t\t\t\tif (check === ',') {\n\t\t\t\t\t\t\tstream.read(1);\n\t\t\t\t\t\t} else if (check === ']') {\n\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\terrors++;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t\tstream.read(1);\n\n\t\t\t\t} else {\n\n\t\t\t\t\tstream.read(size);\n\n\t\t\t\t}\n\n\n\t\t\t// {}: Object\n\t\t\t} else if (seek === '{') {\n\n\t\t\t\tvalue = {};\n\n\n\t\t\t\tstream.read(1);\n\n\t\t\t\twhile (errors === 0) {\n\n\t\t\t\t\tif (stream.seek(1) === '}') {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\n\t\t\t\t\tlet object_key = _decode(stream);\n\t\t\t\t\tcheck = stream.seek(1);\n\n\t\t\t\t\tif (check === '}') {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t} else if (check === ':') {\n\t\t\t\t\t\tstream.read(1);\n\t\t\t\t\t} else if (check !== ':') {\n\t\t\t\t\t\terrors++;\n\t\t\t\t\t}\n\n\t\t\t\t\tlet object_value = _decode(stream);\n\t\t\t\t\tcheck = stream.seek(1);\n\n\n\t\t\t\t\tvalue[object_key] = object_value;\n\n\n\t\t\t\t\tif (check === '}') {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t} else if (check === ',') {\n\t\t\t\t\t\tstream.read(1);\n\t\t\t\t\t} else {\n\t\t\t\t\t\terrors++;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tstream.read(1);\n\n\t\t\t// %%: Custom High-Level Implementation\n\t\t\t} else if (seek === '%') {\n\n\t\t\t\tstream.read(1);\n\n\t\t\t\tlet blob = _decode(stream);\n\n\t\t\t\tvalue = lychee.deserialize(blob);\n\t\t\t\tcheck = stream.read(1);\n\n\t\t\t\tif (check !== '%') {\n\t\t\t\t\tvalue = undefined;\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\t// Invalid seek, assume it's a space character\n\n\t\t\t\tstream.read(1);\n\t\t\t\treturn _decode(stream);\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn value;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'lychee.codec.JSON',\n\t\t\t\t'blob':      null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tencode: function(data) {\n\n\t\t\tdata = data instanceof Object ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet stream = new _Stream('', _Stream.MODE.write);\n\n\t\t\t\t_encode(stream, data);\n\n\t\t\t\treturn new Buffer(stream.toString(), 'utf8');\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\t\tdecode: function(data) {\n\n\t\t\tdata = data instanceof Buffer ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet stream = new _Stream(data.toString('utf8'), _Stream.MODE.read);\n\t\t\t\tlet object = _decode(stream);\n\t\t\t\tif (object !== undefined) {\n\t\t\t\t\treturn object;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"}},"harvester.net.Server":{"constructor":"lychee.Definition","arguments":["harvester.net.Server"],"blob":{"attaches":{},"requires":["harvester.net.Remote","harvester.net.server.File","harvester.net.server.Redirect"],"includes":["lychee.net.Server"],"exports":"function (lychee, global, attachments) {\n\n\tconst _File     = lychee.import('harvester.net.server.File');\n\tconst _Redirect = lychee.import('harvester.net.server.Redirect');\n\tconst _Remote   = lychee.import('harvester.net.Remote');\n\tconst _Server   = lychee.import('lychee.net.Server');\n\tconst _CODEC    = {\n\t\tencode: function(data) {\n\t\t\treturn data;\n\t\t},\n\t\tdecode: function(data) {\n\t\t\treturn data;\n\t\t}\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({\n\t\t\tcodec:  _CODEC,\n\t\t\tremote: _Remote,\n\t\t\ttype:   _Server.TYPE.HTTP\n\t\t}, data);\n\n\n\t\t_Server.call(this, settings);\n\n\t\tsettings = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('connect', function(remote) {\n\n\t\t\tremote.bind('receive', function(payload, headers) {\n\n\t\t\t\tlet method = headers['method'];\n\t\t\t\tif (method === 'OPTIONS') {\n\n\t\t\t\t\tthis.send({}, {\n\t\t\t\t\t\t'status':                       '200 OK',\n\t\t\t\t\t\t'access-control-allow-headers': 'Content-Type',\n\t\t\t\t\t\t'access-control-allow-origin':  'http://localhost',\n\t\t\t\t\t\t'access-control-allow-methods': 'GET, POST',\n\t\t\t\t\t\t'access-control-max-age':       '3600'\n\t\t\t\t\t});\n\n\t\t\t\t} else {\n\n\t\t\t\t\tlet redirect = _Redirect.receive.call({ tunnel: this }, payload, headers);\n\t\t\t\t\tif (redirect === false) {\n\n\t\t\t\t\t\tlet file = _File.receive.call({ tunnel: this }, payload, headers);\n\t\t\t\t\t\tif (file === false) {\n\n\t\t\t\t\t\t\tthis.send('File not found.', {\n\t\t\t\t\t\t\t\t'status':       '404 Not Found',\n\t\t\t\t\t\t\t\t'content-type': 'text/plain; charset=utf-8'\n\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t}, this);\n\n\n\t\tthis.connect();\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Server.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.Server';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.Watcher":{"constructor":"lychee.Definition","arguments":["harvester.Watcher"],"blob":{"attaches":{},"requires":["harvester.data.Filesystem","harvester.data.Project","harvester.mod.Beautifier","harvester.mod.Fertilizer","harvester.mod.Harvester","harvester.mod.Packager","harvester.mod.Server","harvester.mod.Strainer"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Filesystem = lychee.import('harvester.data.Filesystem');\n\tconst _Project    = lychee.import('harvester.data.Project');\n\tconst _mod        = {\n\t\tBeautifier: lychee.import('harvester.mod.Beautifier'),\n\t\tFertilizer: lychee.import('harvester.mod.Fertilizer'),\n\t\tHarvester:  lychee.import('harvester.mod.Harvester'),\n\t\tPackager:   lychee.import('harvester.mod.Packager'),\n\t\tServer:     lychee.import('harvester.mod.Server'),\n\t\tStrainer:   lychee.import('harvester.mod.Strainer')\n\t};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _update_cache = function(silent) {\n\n\t\tsilent = silent === true;\n\n\n\t\t// Libraries\n\t\tlet libraries = this.filesystem.dir('/libraries').filter(function(value) {\n\t\t\treturn /README\\.md/.test(value) === false;\n\t\t}).map(function(value) {\n\t\t\treturn '/libraries/' + value;\n\t\t});\n\n\t\t// Remove Libraries\n\t\tObject.keys(this.libraries).forEach(function(identifier) {\n\n\t\t\tlet index = libraries.indexOf(identifier);\n\t\t\tif (index === -1) {\n\n\t\t\t\tif (silent === false) {\n\t\t\t\t\tconsole.log('harvester.Watcher: Remove Library \"' + identifier + '\"');\n\t\t\t\t}\n\n\t\t\t\tlet server = this.libraries[identifier].server || null;\n\t\t\t\tif (server !== null) {\n\t\t\t\t\tserver.destroy();\n\t\t\t\t}\n\n\t\t\t\tdelete this.libraries[identifier];\n\n\t\t\t}\n\n\t\t}.bind(this));\n\n\t\t// Add Libraries\n\t\tlibraries.forEach(function(identifier) {\n\n\t\t\tlet check = this.libraries[identifier] || null;\n\t\t\tlet info1 = this.filesystem.info(identifier + '/lychee.pkg');\n\n\t\t\tif (check === null && (info1 !== null && info1.type === 'file')) {\n\n\t\t\t\tif (silent === false) {\n\t\t\t\t\tconsole.log('harvester.Watcher: Add Library \"' + identifier + '\"');\n\t\t\t\t}\n\n\t\t\t\tthis.libraries[identifier] = new _Project({\n\t\t\t\t\tidentifier: identifier\n\t\t\t\t});\n\n\t\t\t}\n\n\t\t}.bind(this));\n\n\n\n\t\t// Projects\n\t\tlet projects = this.filesystem.dir('/projects').filter(function(value) {\n\t\t\treturn value !== 'README.md';\n\t\t}).map(function(value) {\n\t\t\treturn '/projects/' + value;\n\t\t});\n\n\n\t\t// Remove Projects\n\t\tObject.keys(this.projects).forEach(function(identifier) {\n\n\t\t\tlet index = projects.indexOf(identifier);\n\t\t\tif (index === -1) {\n\n\t\t\t\tif (silent === false) {\n\t\t\t\t\tconsole.log('harvester.Watcher: Remove Project \"' + identifier + '\"');\n\t\t\t\t}\n\n\t\t\t\tlet server = this.projects[identifier].server || null;\n\t\t\t\tif (server !== null) {\n\t\t\t\t\tserver.destroy();\n\t\t\t\t}\n\n\t\t\t\tdelete this.projects[identifier];\n\n\t\t\t}\n\n\t\t}.bind(this));\n\n\t\t// Add Projects\n\t\tprojects.forEach(function(identifier) {\n\n\t\t\tlet check = this.projects[identifier] || null;\n\t\t\tlet info1 = this.filesystem.info(identifier + '/index.html');\n\t\t\tlet info2 = this.filesystem.info(identifier + '/lychee.pkg');\n\n\t\t\tif (check === null && ((info1 !== null && info1.type === 'file') || (info2 !== null && info2.type === 'file'))) {\n\n\t\t\t\tif (silent === false) {\n\t\t\t\t\tconsole.log('harvester.Watcher: Add Project \"' + identifier + '\"');\n\t\t\t\t}\n\n\t\t\t\tthis.projects[identifier] = new _Project({\n\t\t\t\t\tidentifier: identifier\n\t\t\t\t});\n\n\t\t\t}\n\n\t\t}.bind(this));\n\n\t};\n\n\tconst _update_mods = function() {\n\n\t\tlet Fertilizer = _mod.Fertilizer;\n\t\tlet Harvester  = _mod.Harvester;\n\t\tlet Packager   = _mod.Packager;\n\t\tlet Server     = _mod.Server;\n\t\tlet Strainer   = _mod.Strainer;\n\t\tlet sandbox    = this.sandbox;\n\n\t\tif (sandbox === true) {\n\n\t\t\tHarvester  = null;\n\t\t\tFertilizer = null;\n\n\t\t} else {\n\n\t\t\t// XXX: Fertilizer disabled for performance reasons\n\t\t\tFertilizer = null;\n\n\t\t}\n\n\n\t\tfor (let lid in this.libraries) {\n\n\t\t\tlet library = this.libraries[lid];\n\t\t\tlet reasons = [];\n\n\t\t\tif (Packager !== null && Packager.can(library) === true) {\n\t\t\t\treasons = Packager.process(library);\n\t\t\t}\n\n\t\t\tif (Server !== null && Server.can(library) === true) {\n\t\t\t\tServer.process(library);\n\t\t\t}\n\n\n\t\t\tif (reasons.length > 0) {\n\n\t\t\t\tlet changed_api = reasons.find(function(path) {\n\t\t\t\t\treturn path.startsWith('/api/files');\n\t\t\t\t}) || null;\n\n\t\t\t\tlet changed_source = reasons.find(function(path) {\n\t\t\t\t\treturn path.startsWith('/source/files');\n\t\t\t\t}) || null;\n\n\t\t\t\tif (changed_api !== null && Harvester !== null && Harvester.can(library) === true) {\n\t\t\t\t\tHarvester.process(library);\n\t\t\t\t}\n\n\t\t\t\tif (changed_source !== null && Strainer !== null && Strainer.can(library) === true) {\n\t\t\t\t\tStrainer.process(library);\n\t\t\t\t}\n\n\t\t\t\tif (changed_source !== null && Fertilizer !== null && Fertilizer.can(library) === true) {\n\t\t\t\t\tFertilizer.process(library);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t\tfor (let pid in this.projects) {\n\n\t\t\tlet project = this.projects[pid];\n\t\t\tlet reasons = [];\n\n\t\t\tif (Packager !== null && Packager.can(project) === true) {\n\t\t\t\treasons = Packager.process(project);\n\t\t\t}\n\n\t\t\tif (Server !== null && Server.can(project) === true) {\n\t\t\t\tServer.process(project);\n\t\t\t}\n\n\n\t\t\tif (reasons.length > 0) {\n\n\t\t\t\tlet changed_api = reasons.find(function(path) {\n\t\t\t\t\treturn path.startsWith('/api/files');\n\t\t\t\t}) || null;\n\n\t\t\t\tlet changed_source = reasons.find(function(path) {\n\t\t\t\t\treturn path.startsWith('/source/files');\n\t\t\t\t}) || null;\n\n\t\t\t\tif (changed_api !== null && Harvester !== null && Harvester.can(project) === true) {\n\t\t\t\t\tHarvester.process(project);\n\t\t\t\t}\n\n\t\t\t\tif (changed_source !== null && Strainer !== null && Strainer.can(project) === true) {\n\t\t\t\t\tStrainer.process(project);\n\t\t\t\t}\n\n\t\t\t\tif (changed_source !== null && Fertilizer !== null && Fertilizer.can(project) === true) {\n\t\t\t\t\tFertilizer.process(project);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(main) {\n\n\t\tthis.filesystem = new _Filesystem();\n\t\tthis.libraries  = {};\n\t\tthis.projects   = {};\n\t\tthis.sandbox    = true;\n\n\n\t\t// Figure out if there's a cleaner way\n\t\tmain._libraries = this.libraries;\n\t\tmain._projects  = this.projects;\n\n\t};\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'harvester.Watcher',\n\t\t\t\t'arguments':   []\n\t\t\t};\n\n\t\t},\n\n\t\tinit: function(sandbox) {\n\n\t\t\tsandbox = sandbox === true;\n\n\n\t\t\tif (sandbox === true) {\n\n\t\t\t\tconsole.warn('harvester.Watcher: Sandbox Mode enabled  ');\n\t\t\t\tconsole.warn('harvester.Watcher: Software Bots disabled');\n\t\t\t\tconsole.log('\\n\\n');\n\n\t\t\t\tthis.sandbox = true;\n\n\t\t\t} else {\n\n\t\t\t\tconsole.info('harvester.Watcher: Sandbox Mode disabled');\n\t\t\t\tconsole.info('harvester.Watcher: Software Bots enabled');\n\t\t\t\tconsole.log('\\n\\n');\n\n\t\t\t\tthis.sandbox = false;\n\n\t\t\t}\n\n\n\t\t\t// XXX: Don't flood log on initialization\n\t\t\t_update_cache.call(this, true);\n\n\n\t\t\tfor (let lid in this.libraries) {\n\n\t\t\t\tlet library = this.libraries[lid];\n\n\t\t\t\tif (_mod.Packager !== null && _mod.Packager.can(library) === true) {\n\t\t\t\t\t_mod.Packager.process(library);\n\t\t\t\t}\n\n\t\t\t\tif (_mod.Beautifier !== null && _mod.Beautifier.can(library) === true) {\n\t\t\t\t\t_mod.Beautifier.process(library);\n\t\t\t\t}\n\n\t\t\t\tif (_mod.Server !== null && _mod.Server.can(library) === true) {\n\t\t\t\t\t_mod.Server.process(library);\n\t\t\t\t}\n\n\t\t\t\tif (_mod.Strainer !== null && _mod.Strainer.can(library) === true) {\n\t\t\t\t\t_mod.Strainer.process(library);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tfor (let pid in this.projects) {\n\n\t\t\t\tlet project = this.projects[pid];\n\n\t\t\t\tif (_mod.Packager !== null && _mod.Packager.can(project) === true) {\n\t\t\t\t\t_mod.Packager.process(project);\n\t\t\t\t}\n\n\t\t\t\tif (_mod.Beautifier !== null && _mod.Beautifier.can(project) === true) {\n\t\t\t\t\t_mod.Beautifier.process(project);\n\t\t\t\t}\n\n\t\t\t\tif (_mod.Server !== null && _mod.Server.can(project) === true) {\n\t\t\t\t\t_mod.Server.process(project);\n\t\t\t\t}\n\n\t\t\t\tif (_mod.Strainer !== null && _mod.Strainer.can(project) === true) {\n\t\t\t\t\t_mod.Strainer.process(project);\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn true;\n\n\t\t},\n\n\t\tupdate: function() {\n\n\t\t\t_update_cache.call(this);\n\t\t\t_update_mods.call(this);\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.net.Server":{"constructor":"lychee.Definition","arguments":["lychee.net.Server"],"blob":{"attaches":{},"tags":{"platform":"node"},"requires":["lychee.Storage","lychee.codec.JSON","lychee.net.Remote"],"includes":["lychee.event.Emitter"],"supports":"function (lychee, global) {\n\n\tif (typeof global.require === 'function') {\n\n\t\ttry {\n\n\t\t\tglobal.require('net');\n\t\t\treturn true;\n\n\t\t} catch (err) {\n\t\t}\n\n\t}\n\n\n\treturn false;\n\n}","exports":"function (lychee, global, attachments) {\n\n\tconst _net     = global.require('net');\n\tconst _Emitter = lychee.import('lychee.event.Emitter');\n\tconst _JSON    = lychee.import('lychee.codec.JSON');\n\tconst _Remote  = lychee.import('lychee.net.Remote');\n\tconst _Storage = lychee.import('lychee.Storage');\n\tconst _storage = new _Storage({\n\t\tid:    'server',\n\t\ttype:  _Storage.TYPE.persistent,\n\t\tmodel: {\n\t\t\tid:   '[::ffff]:1337',\n\t\t\ttype: 'client',\n\t\t\thost: '::ffff',\n\t\t\tport: 1337\n\t\t}\n\t});\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({}, data);\n\n\n\t\tthis.codec  = _JSON;\n\t\tthis.host   = null;\n\t\tthis.port   = 1337;\n\t\tthis.remote = _Remote;\n\t\tthis.type   = Composite.TYPE.WS;\n\n\n\t\tthis.__isConnected = false;\n\t\tthis.__server      = null;\n\n\n\t\tthis.setCodec(settings.codec);\n\t\tthis.setHost(settings.host);\n\t\tthis.setPort(settings.port);\n\t\tthis.setRemote(settings.remote);\n\t\tthis.setType(settings.type);\n\n\n\t\t_Emitter.call(this);\n\n\t\tsettings = null;\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('connect', function(remote) {\n\n\t\t\tlet id  = (/:/g.test(remote.host) ? '[' + remote.host + ']' : remote.host) + ':' + remote.port;\n\t\t\tlet obj = _storage.create();\n\t\t\tif (obj !== null) {\n\n\t\t\t\tobj.id   = id;\n\t\t\t\tobj.type = 'client';\n\t\t\t\tobj.host = remote.host;\n\t\t\t\tobj.port = remote.port;\n\n\t\t\t\t_storage.write(id, obj);\n\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('disconnect', function(remote) {\n\n\t\t\tlet id  = (/:/g.test(remote.host) ? '[' + remote.host + ']' : remote.host) + ':' + remote.port;\n\t\t\tlet obj = _storage.read(id);\n\t\t\tif (obj !== null) {\n\t\t\t\t_storage.remove(id);\n\t\t\t}\n\n\t\t}, this);\n\n\t};\n\n\n\tComposite.TYPE = {\n\t\tWS:   0,\n\t\tHTTP: 1,\n\t\tTCP:  2\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.Server';\n\n\t\t\tlet settings = {};\n\n\n\t\t\tif (this.codec !== _JSON)            settings.codec  = lychee.serialize(this.codec);\n\t\t\tif (this.host !== 'localhost')       settings.host   = this.host;\n\t\t\tif (this.port !== 1337)              settings.port   = this.port;\n\t\t\tif (this.remote !== _Remote)         settings.remote = lychee.serialize(this.remote);\n\t\t\tif (this.type !== Composite.TYPE.WS) settings.type   = this.type;\n\n\n\t\t\tdata['arguments'][0] = settings;\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tconnect: function() {\n\n\t\t\tif (this.__isConnected === false) {\n\n\t\t\t\tif (lychee.debug === true) {\n\t\t\t\t\tconsole.log('lychee.net.Server: Connected to ' + this.host + ':' + this.port);\n\t\t\t\t}\n\n\n\t\t\t\tlet that   = this;\n\t\t\t\tlet server = new _net.Server({\n\t\t\t\t\tallowHalfOpen:  true,\n\t\t\t\t\tpauseOnConnect: true\n\t\t\t\t});\n\n\n\t\t\t\tserver.on('connection', function(socket) {\n\n\t\t\t\t\tlet host   = socket.remoteAddress || socket.server._connectionKey.split(':')[1];\n\t\t\t\t\tlet port   = socket.remotePort    || socket.server._connectionKey.split(':')[2];\n\t\t\t\t\tlet remote = new that.remote({\n\t\t\t\t\t\tcodec: that.codec,\n\t\t\t\t\t\thost:  host,\n\t\t\t\t\t\tport:  port,\n\t\t\t\t\t\ttype:  that.type\n\t\t\t\t\t});\n\n\t\t\t\t\tthat.trigger('preconnect', [ remote ]);\n\n\t\t\t\t\tremote.bind('connect', function() {\n\t\t\t\t\t\tthat.trigger('connect', [ this ]);\n\t\t\t\t\t});\n\n\t\t\t\t\tremote.bind('disconnect', function() {\n\t\t\t\t\t\tthat.trigger('disconnect', [ this ]);\n\t\t\t\t\t});\n\n\n\t\t\t\t\tremote.connect(socket);\n\n\t\t\t\t});\n\n\t\t\t\tserver.on('error', function() {\n\t\t\t\t\tthis.close();\n\t\t\t\t});\n\n\t\t\t\tserver.on('close', function() {\n\t\t\t\t\tthat.__isConnected = false;\n\t\t\t\t\tthat.__server      = null;\n\t\t\t\t});\n\n\t\t\t\tserver.listen(this.port, this.host);\n\n\n\t\t\t\tthis.__server      = server;\n\t\t\t\tthis.__isConnected = true;\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tdisconnect: function() {\n\n\t\t\tlet server = this.__server;\n\t\t\tif (server !== null) {\n\t\t\t\tserver.close();\n\t\t\t}\n\n\n\t\t\treturn true;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * TUNNEL API\n\t\t */\n\n\t\tsetCodec: function(codec) {\n\n\t\t\tcodec = lychee.interfaceof(_JSON, codec) ? codec : null;\n\n\n\t\t\tif (codec !== null) {\n\n\t\t\t\tlet oldcodec = this.codec;\n\t\t\t\tif (oldcodec !== codec) {\n\n\t\t\t\t\tthis.codec = codec;\n\n\n\t\t\t\t\tif (this.__isConnected === true) {\n\t\t\t\t\t\tthis.disconnect();\n\t\t\t\t\t\tthis.connect();\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetHost: function(host) {\n\n\t\t\thost = typeof host === 'string' ? host : null;\n\n\n\t\t\tif (host !== null) {\n\n\t\t\t\tthis.host = host;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetPort: function(port) {\n\n\t\t\tport = typeof port === 'number' ? (port | 0) : null;\n\n\n\t\t\tif (port !== null) {\n\n\t\t\t\tthis.port = port;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetRemote: function(remote) {\n\n\t\t\tremote = lychee.interfaceof(_Remote, remote) ? remote : null;\n\n\n\t\t\tif (remote !== null) {\n\n\t\t\t\tlet oldremote = this.remote;\n\t\t\t\tif (oldremote !== remote) {\n\n\t\t\t\t\tthis.remote = remote;\n\n\n\t\t\t\t\tif (this.__isConnected === true) {\n\t\t\t\t\t\tthis.disconnect();\n\t\t\t\t\t\tthis.connect();\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetType: function(type) {\n\n\t\t\ttype = lychee.enumof(Composite.TYPE, type) ? type : null;\n\n\n\t\t\tif (type !== null) {\n\n\t\t\t\tlet oldtype = this.type;\n\t\t\t\tif (oldtype !== type) {\n\n\t\t\t\t\tthis.type = type;\n\n\n\t\t\t\t\tif (this.__isConnected === true) {\n\t\t\t\t\t\tthis.disconnect();\n\t\t\t\t\t\tthis.connect();\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.net.Remote":{"constructor":"lychee.Definition","arguments":["harvester.net.Remote"],"blob":{"attaches":{},"requires":["lychee.codec.BENCODE","lychee.codec.BITON","lychee.codec.JSON"],"includes":["lychee.net.Tunnel"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Tunnel  = lychee.import('lychee.net.Tunnel');\n\tconst _BENCODE = lychee.import('lychee.codec.BENCODE');\n\tconst _BITON   = lychee.import('lychee.codec.BITON');\n\tconst _JSON    = lychee.import('lychee.codec.JSON');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({}, data);\n\n\n\t\t_Tunnel.call(this, settings);\n\n\t\tsettings = null;\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Tunnel.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.Remote';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\treceive: function(payload, headers) {\n\n\t\t\tpayload = payload instanceof Buffer ? payload : null;\n\t\t\theaders = headers instanceof Object ? headers : {};\n\n\n\t\t\tlet host = headers['host'] || null;\n\t\t\tif (host !== null && payload !== null) {\n\n\t\t\t\tlet data = null;\n\t\t\t\tif (payload !== null) {\n\t\t\t\t\tdata = this.codec.decode(payload);\n\t\t\t\t}\n\n\t\t\t\tif (data !== null) {\n\t\t\t\t\tdata['@host'] = host;\n\t\t\t\t\tpayload = this.codec.encode(data);\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tlet result = _Tunnel.prototype.receive.call(this, payload, headers);\n\t\t\tif (result === true) {\n\t\t\t\treturn true;\n\t\t\t}\n\n\n\t\t\treturn true;\n\n\t\t},\n\n\t\tsend: function(data, headers) {\n\n\t\t\t// XXX: data can be Object, Buffer or String\n\n\t\t\tdata    = data !== undefined        ? data    : null;\n\t\t\theaders = headers instanceof Object ? headers : {};\n\n\n\t\t\tif (data instanceof Object) {\n\n\t\t\t\theaders['access-control-allow-origin'] = '*';\n\t\t\t\theaders['content-control']             = 'no-transform';\n\n\n\t\t\t\tlet codec = this.codec;\n\t\t\t\tif (codec === _BENCODE) {\n\t\t\t\t\theaders['content-type'] = 'application/bencode; charset=utf-8';\n\t\t\t\t} else if (codec === _BITON) {\n\t\t\t\t\theaders['content-type'] = 'application/biton; charset=binary';\n\t\t\t\t} else if (codec === _JSON) {\n\t\t\t\t\theaders['content-type'] = 'application/json; charset=utf-8';\n\t\t\t\t}\n\n\n\t\t\t\tlet event = headers['event'] || null;\n\t\t\t\tif (event === 'error') {\n\t\t\t\t\theaders['status'] = '400 Bad Request';\n\t\t\t\t}\n\n\n\t\t\t\tif (/@plug|@unplug/g.test(headers.method) === false) {\n\t\t\t\t\treturn _Tunnel.prototype.send.call(this, data, headers);\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tlet payload = null;\n\n\t\t\t\tif (typeof data === 'string') {\n\t\t\t\t\tpayload = new Buffer(data, 'utf8');\n\t\t\t\t} else if (data instanceof Buffer) {\n\t\t\t\t\tpayload = data;\n\t\t\t\t}\n\n\n\t\t\t\tif (payload instanceof Buffer) {\n\n\t\t\t\t\tthis.trigger('send', [ payload, headers ]);\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.net.remote.Console":{"constructor":"lychee.Definition","arguments":["harvester.net.remote.Console"],"blob":{"attaches":{},"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(remote) {\n\n\t\t_Service.call(this, 'console', remote, _Service.TYPE.remote);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.remote.Console';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tindex: function() {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null) {\n\n\t\t\t\tlet result = tunnel.send(lychee.serialize(console), {\n\t\t\t\t\tid:    this.id,\n\t\t\t\t\tevent: 'sync'\n\t\t\t\t});\n\n\t\t\t\tif (result === true) {\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsync: function() {\n\t\t\treturn this.index();\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.net.remote.Harvester":{"constructor":"lychee.Definition","arguments":["harvester.net.remote.Harvester"],"blob":{"attaches":{},"requires":["lychee.Storage"],"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\tconst _Storage = lychee.import('lychee.Storage');\n\tconst _storage = new _Storage({\n\t\tid:    'harvester',\n\t\ttype:  _Storage.TYPE.persistent,\n\t\tmodel: {\n\t\t\tid:        '13371337',\n\t\t\ttype:      'harvester',\n\t\t\tnetworks:  [ '[::ffff]:1337'         ],\n\t\t\tlibraries: [ '/libraries/lychee'     ],\n\t\t\tprojects:  [ '/projects/boilerplate' ]\n\t\t}\n\t});\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _generate_id = function() {\n\t\treturn ((Math.random() * 0x07fffffff) | 0).toString(16);\n\t};\n\n\tconst _serialize = function(harvester) {\n\n\t\treturn {\n\t\t\tid:        harvester.id,\n\t\t\ttype:      'harvester',\n\t\t\tnetworks:  harvester.networks  || [],\n\t\t\tlibraries: harvester.libraries || [],\n\t\t\tprojects:  harvester.projects  || []\n\t\t};\n\n\t};\n\n\tconst _on_connect = function(data) {\n\n\t\tlet id  = data.id || null;\n\t\tlet obj = null;\n\n\t\tif (id !== null) {\n\n\t\t\tobj = _storage.read(id);\n\n\t\t} else if (id === null) {\n\n\t\t\tid     = _generate_id();\n\t\t\tobj    = _storage.create();\n\t\t\tobj.id = id;\n\n\n\t\t\tlet tunnel = this.tunnel || null;\n\t\t\tif (tunnel !== null) {\n\n\t\t\t\ttunnel.send({\n\t\t\t\t\tid: id\n\t\t\t\t}, {\n\t\t\t\t\tid:    this.id,\n\t\t\t\t\tevent: 'handshake'\n\t\t\t\t});\n\n\t\t\t}\n\n\t\t}\n\n\n\t\tif (id !== null && obj !== null) {\n\n\t\t\tobj.networks  = data.networks  || [];\n\t\t\tobj.libraries = data.libraries || [];\n\t\t\tobj.projects  = data.projects  || [];\n\n\t\t\t_storage.write(id, obj);\n\n\t\t}\n\n\t};\n\n\tconst _on_disconnect = function(data) {\n\n\t\tlet id  = data.id || null;\n\t\tlet obj = _storage.read(id);\n\t\tif (obj !== null) {\n\t\t\t_storage.remove(id);\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(remote) {\n\n\t\t_Service.call(this, 'harvester', remote, _Service.TYPE.remote);\n\n\n\t\tthis.bind('connect',     _on_connect,    this);\n\t\tthis.bind('disconnect',  _on_disconnect, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.remote.Harvester';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tindex: function() {\n\n\t\t\tlet main   = global.MAIN || null;\n\t\t\tlet tunnel = this.tunnel;\n\n\t\t\tif (main !== null && tunnel !== null) {\n\n\t\t\t\tlet harvesters = _storage.filter(function(harvester) {\n\t\t\t\t\treturn true;\n\t\t\t\t});\n\n\t\t\t\tlet result = tunnel.send(harvesters, {\n\t\t\t\t\tid:    this.id,\n\t\t\t\t\tevent: 'sync'\n\t\t\t\t});\n\n\t\t\t\tif (result === true) {\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsync: function() {\n\t\t\treturn this.index();\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.net.remote.Library":{"constructor":"lychee.Definition","arguments":["harvester.net.remote.Library"],"blob":{"attaches":{},"requires":["harvester.mod.Server"],"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\tconst _Server  = lychee.import('harvester.mod.Server');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _serialize = function(library) {\n\n\t\tlet filesystem = null;\n\t\tlet server     = null;\n\n\t\tif (library.filesystem !== null) {\n\t\t\tfilesystem = library.filesystem.root;\n\t\t}\n\n\t\tif (library.server !== null) {\n\n\t\t\tserver = {\n\t\t\t\thost: library.server.host,\n\t\t\t\tport: library.server.port\n\t\t\t};\n\n\t\t}\n\n\n\t\treturn {\n\t\t\tidentifier: library.identifier,\n\t\t\tdetails:    library.details || null,\n\t\t\tfilesystem: filesystem,\n\t\t\tserver:     server,\n\t\t\tharvester:  library.harvester\n\t\t};\n\n\t};\n\n\tconst _on_start = function(data) {\n\n\t\tlet identifier = data.identifier || null;\n\t\tlet main       = global.MAIN     || null;\n\n\t\tif (identifier !== null && main !== null) {\n\n\t\t\tlet library = main._libraries[identifier] || null;\n\t\t\tif (library !== null && library.server === null) {\n\n\t\t\t\t_Server.process(library);\n\n\t\t\t\tthis.accept('Server started (\"' + identifier + '\")');\n\n\t\t\t} else {\n\n\t\t\t\tthis.reject('No server (\"' + identifier + '\")');\n\n\t\t\t}\n\n\t\t} else {\n\n\t\t\tthis.reject('No Identifier');\n\n\t\t}\n\n\t};\n\n\tconst _on_stop = function(data) {\n\n\t\tlet identifier = data.identifier || null;\n\t\tlet main       = global.MAIN     || null;\n\n\t\tif (identifier !== null && main !== null) {\n\n\t\t\tlet library = main._libraries[identifier] || null;\n\t\t\tif (library !== null && library.server !== null) {\n\n\t\t\t\tlibrary.server.destroy();\n\t\t\t\tlibrary.server = null;\n\n\t\t\t\tthis.accept('Server stopped (\"' + identifier + '\")');\n\n\t\t\t} else {\n\n\t\t\t\tthis.reject('No Server (\"' + identifier + '\")');\n\n\t\t\t}\n\n\t\t} else {\n\n\t\t\tthis.reject('No Identifier');\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(remote) {\n\n\t\t_Service.call(this, 'library', remote, _Service.TYPE.remote);\n\n\n\t\tthis.bind('start', _on_start, this);\n\t\tthis.bind('stop',  _on_stop,  this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.remote.Library';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tindex: function() {\n\n\t\t\tlet main   = global.MAIN || null;\n\t\t\tlet tunnel = this.tunnel;\n\n\t\t\tif (main !== null && tunnel !== null) {\n\n\t\t\t\tlet result = tunnel.send(Object.values(main._libraries).map(_serialize), {\n\t\t\t\t\tid:    this.id,\n\t\t\t\t\tevent: 'sync'\n\t\t\t\t});\n\n\t\t\t\tif (result === true) {\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.net.remote.Profile":{"constructor":"lychee.Definition","arguments":["harvester.net.remote.Profile"],"blob":{"attaches":{},"requires":["harvester.data.Filesystem","lychee.codec.JSON"],"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Filesystem = lychee.import('harvester.data.Filesystem');\n\tconst _Service    = lychee.import('lychee.net.Service');\n\tconst _CACHE      = {};\n\tconst _FILESYSTEM = new _Filesystem({\n\t\troot: '/libraries/harvester/profiles'\n\t});\n\tconst _JSON       = lychee.import('lychee.codec.JSON');\n\n\n\n\t/*\n\t * FEATURE DETECTION\n\t */\n\n\t(function(cache, filesystem) {\n\n\t\tlet identifiers = filesystem.dir('/').map(function(value) {\n\t\t\treturn value.split('.').slice(0, -1).join('.');\n\t\t});\n\n\t\tif (identifiers.length > 0) {\n\n\t\t\tidentifiers.forEach(function(identifier) {\n\n\t\t\t\tlet profile = filesystem.read('/' + identifier + '.json');\n\t\t\t\tif (profile !== null) {\n\t\t\t\t\tcache[identifier] = _JSON.decode(profile);\n\t\t\t\t\tcache[identifier].identifier = identifier;\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t}\n\n\t})(_CACHE, _FILESYSTEM);\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _save_profile = function(profile) {\n\n\t\tlet path = '/' + profile.identifier + '.json';\n\t\tlet data = _JSON.encode(profile);\n\n\t\tif (data !== null) {\n\n\t\t\t_FILESYSTEM.write(path, data);\n\n\t\t\treturn true;\n\n\t\t}\n\n\n\t\treturn false;\n\n\t};\n\n\tconst _serialize = function(profile) {\n\n\t\treturn {\n\t\t\tidentifier: profile.identifier || '',\n\t\t\thost:       profile.host       || 'localhost',\n\t\t\tport:       profile.port       || 8080,\n\t\t\tdebug:      profile.debug      || false,\n\t\t\tsandbox:    profile.sandbox    || false\n\t\t};\n\n\t};\n\n\tconst _on_save = function(data) {\n\n\t\tlet identifier = data.identifier || null;\n\t\tif (identifier !== null) {\n\n\t\t\tlet profile = _CACHE[identifier] || null;\n\t\t\tif (profile !== null) {\n\n\t\t\t\tprofile.identifier = identifier;\n\t\t\t\tprofile.host       = data.host    || 'localhost';\n\t\t\t\tprofile.port       = data.port    || 8080;\n\t\t\t\tprofile.debug      = data.debug   || false;\n\t\t\t\tprofile.sandbox    = data.sandbox || false;\n\n\n\t\t\t\t_save_profile(profile);\n\n\n\t\t\t\tthis.accept('Profile updated (\"' + identifier + '\")');\n\n\t\t\t} else {\n\n\t\t\t\tthis.reject('No profile (\"' + identifier + '\")');\n\n\t\t\t}\n\n\t\t} else {\n\n\t\t\tthis.reject('No identifier');\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(remote) {\n\n\t\t_Service.call(this, 'profile', remote, _Service.TYPE.remote);\n\n\n\t\tthis.bind('save', _on_save, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.remote.Profile';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tindex: function() {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null) {\n\n\t\t\t\tlet result = tunnel.send(Object.values(_CACHE).map(_serialize), {\n\t\t\t\t\tid:    this.id,\n\t\t\t\t\tevent: 'sync'\n\t\t\t\t});\n\n\t\t\t\tif (result === true) {\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsync: function() {\n\t\t\treturn this.index();\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.net.remote.Project":{"constructor":"lychee.Definition","arguments":["harvester.net.remote.Project"],"blob":{"attaches":{},"requires":["harvester.mod.Server"],"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\tconst _Server  = lychee.import('harvester.mod.Server');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _serialize_web = function(project) {\n\n\t\tlet main = global.MAIN || null;\n\t\tif (main !== null) {\n\t\t\treturn main.getHosts();\n\t\t}\n\n\t\treturn [];\n\n\t};\n\n\tconst _serialize = function(project) {\n\n\t\tlet filesystem = null;\n\t\tlet server     = null;\n\n\t\tif (project.filesystem !== null) {\n\t\t\tfilesystem = project.filesystem.root;\n\t\t}\n\n\t\tif (project.server !== null) {\n\n\t\t\tserver = {\n\t\t\t\thost: project.server.host,\n\t\t\t\tport: project.server.port\n\t\t\t};\n\n\t\t}\n\n\n\t\treturn {\n\t\t\tidentifier: project.identifier,\n\t\t\tdetails:    project.details || null,\n\t\t\tfilesystem: filesystem,\n\t\t\tserver:     server,\n\t\t\tweb:        _serialize_web(project),\n\t\t\tharvester:  project.harvester\n\t\t};\n\n\t};\n\n\tconst _on_start = function(data) {\n\n\t\tlet identifier = data.identifier || null;\n\t\tlet main       = global.MAIN     || null;\n\n\t\tif (identifier !== null && main !== null) {\n\n\t\t\tlet project = main._projects[identifier] || null;\n\t\t\tif (project !== null && project.server === null) {\n\n\t\t\t\t_Server.process(project);\n\n\t\t\t\tthis.accept('Server started (\"' + identifier + '\")');\n\n\t\t\t} else {\n\n\t\t\t\tthis.reject('No Server (\"' + identifier + '\")');\n\n\t\t\t}\n\n\t\t} else {\n\n\t\t\tthis.reject('No Identifier');\n\n\t\t}\n\n\t};\n\n\tconst _on_stop = function(data) {\n\n\t\tlet identifier = data.identifier || null;\n\t\tlet main       = global.MAIN     || null;\n\n\t\tif (identifier !== null && main !== null) {\n\n\t\t\tlet project = main._projects[identifier] || null;\n\t\t\tif (project !== null && project.server !== null) {\n\n\t\t\t\tproject.server.destroy();\n\t\t\t\tproject.server = null;\n\n\t\t\t\tthis.accept('Server stopped (\"' + identifier + '\")');\n\n\t\t\t} else {\n\n\t\t\t\tthis.reject('No Server (\"' + identifier + '\")');\n\n\t\t\t}\n\n\t\t} else {\n\n\t\t\tthis.reject('No Identifier');\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(remote) {\n\n\t\t_Service.call(this, 'project', remote, _Service.TYPE.remote);\n\n\n\t\tthis.bind('start', _on_start, this);\n\t\tthis.bind('stop',  _on_stop,  this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.remote.Project';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tindex: function() {\n\n\t\t\tlet main   = global.MAIN || null;\n\t\t\tlet tunnel = this.tunnel;\n\n\t\t\tif (main !== null && tunnel !== null) {\n\n\t\t\t\tlet result = tunnel.send(Object.values(main._projects).map(_serialize), {\n\t\t\t\t\tid:    this.id,\n\t\t\t\t\tevent: 'sync'\n\t\t\t\t});\n\n\t\t\t\tif (result === true) {\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\tsync: function() {\n\t\t\treturn this.index();\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.net.remote.Server":{"constructor":"lychee.Definition","arguments":["harvester.net.remote.Server"],"blob":{"attaches":{},"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _serialize_remotes = function(project) {\n\n\t\tlet remotes = [];\n\n\t\tlet info = project.filesystem.info('/lychee.store');\n\t\tif (info !== null) {\n\n\t\t\tlet database = JSON.parse(project.filesystem.read('/lychee.store'));\n\t\t\tif (database instanceof Object) {\n\n\t\t\t\tif (database['server'] instanceof Object) {\n\n\t\t\t\t\tlet objects = database['server']['@objects'] || null;\n\t\t\t\t\tif (objects instanceof Object) {\n\n\t\t\t\t\t\tremotes = Object.values(objects).map(function(remote) {\n\n\t\t\t\t\t\t\treturn {\n\t\t\t\t\t\t\t\tid:   remote.id,\n\t\t\t\t\t\t\t\ttype: remote.type,\n\t\t\t\t\t\t\t\thost: remote.host,\n\t\t\t\t\t\t\t\tport: remote.port\n\t\t\t\t\t\t\t};\n\n\t\t\t\t\t\t});\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t\treturn remotes;\n\n\t};\n\n\tconst _serialize = function(project) {\n\n\t\tproject = project instanceof Object ? project : null;\n\n\n\t\tif (project !== null) {\n\n\t\t\tlet main        = global.MAIN || null;\n\t\t\tlet remotes     = _serialize_remotes(project);\n\t\t\tlet server_host = null;\n\t\t\tlet server_port = null;\n\n\t\t\tif (project.server !== null) {\n\t\t\t\tserver_host = project.server.host;\n\t\t\t\tserver_port = project.server.port;\n\t\t\t}\n\n\n\t\t\tif (main !== null && server_host === null) {\n\t\t\t\tserver_host = main.server.host;\n\t\t\t}\n\n\t\t\tif (server_host === null) {\n\t\t\t\tserver_host = 'localhost';\n\t\t\t}\n\n\n\t\t\treturn {\n\t\t\t\tidentifier: project.identifier,\n\t\t\t\thost:       server_host,\n\t\t\t\tport:       server_port,\n\t\t\t\tremotes:    remotes\n\t\t\t};\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(remote) {\n\n\t\t_Service.call(this, 'server', remote, _Service.TYPE.remote);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.remote.Server';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tindex: function(data) {\n\n\t\t\tdata = data instanceof Object ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet host   = data['@host'] || null;\n\t\t\t\tlet main   = global.MAIN   || null;\n\t\t\t\tlet tunnel = this.tunnel;\n\n\t\t\t\tif (host !== null) {\n\n\t\t\t\t\tif (host.endsWith(':4848')) {\n\t\t\t\t\t\thost = host.substr(0, host.length - 5);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tif (main !== null && tunnel !== null) {\n\n\t\t\t\t\tlet all       = [];\n\t\t\t\t\tlet projects  = Object.values(main._projects);\n\t\t\t\t\tlet libraries = Object.values(main._libraries);\n\n\t\t\t\t\tfor (let p = 0, pl = projects.length; p < pl; p++) {\n\t\t\t\t\t\tall.push(projects[p]);\n\t\t\t\t\t}\n\n\t\t\t\t\tfor (let l = 0, ll = libraries.length; l < ll; l++) {\n\t\t\t\t\t\tall.push(libraries[l]);\n\t\t\t\t\t}\n\n\n\t\t\t\t\tall.forEach(function(project) {\n\t\t\t\t\t\tproject.host = project.host !== 'localhost' ? project.host : host;\n\t\t\t\t\t});\n\n\n\t\t\t\t\tlet result = tunnel.send(all.map(_serialize), {\n\t\t\t\t\t\tid:    this.id,\n\t\t\t\t\t\tevent: 'sync'\n\t\t\t\t\t});\n\n\t\t\t\t\tif (result === true) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tconnect: function(data) {\n\n\t\t\tdata = data instanceof Object ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet host       = data['@host']   || null;\n\t\t\t\tlet identifier = data.identifier || null;\n\t\t\t\tlet main       = global.MAIN     || null;\n\t\t\t\tlet tunnel     = this.tunnel;\n\n\t\t\t\tif (host !== null) {\n\n\t\t\t\t\tif (host.endsWith(':4848')) {\n\t\t\t\t\t\thost = host.substr(0, host.length - 5);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tif (identifier !== null && main !== null && tunnel !== null) {\n\n\t\t\t\t\tlet project = _serialize(main._libraries[identifier] || main._projects[identifier]);\n\t\t\t\t\tif (project !== null) {\n\n\t\t\t\t\t\tproject.host = project.host !== 'localhost' ? project.host : host;\n\n\t\t\t\t\t\tlet result = tunnel.send(project, {\n\t\t\t\t\t\t\tid:    this.id,\n\t\t\t\t\t\t\tevent: 'connect'\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\tif (result === true) {\n\t\t\t\t\t\t\treturn result;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t} else {\n\n\t\t\t\t\t\tthis.reject('No Server (\"' + identifier + '\")');\n\n\t\t\t\t\t}\n\n\t\t\t\t} else {\n\n\t\t\t\t\tthis.reject('No Identifier');\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.net.server.File":{"constructor":"lychee.Definition","arguments":["harvester.net.server.File"],"blob":{"attaches":{},"requires":["harvester.data.Filesystem"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Filesystem = lychee.import('harvester.data.Filesystem');\n\tconst _MIME       = {\n\t\t'default':  { binary: true,  type: 'application/octet-stream'      },\n\t\t'appcache': { binary: false, type: 'text/cache-manifest'           },\n\t\t'css':      { binary: false, type: 'text/css'                      },\n\t\t'env':      { binary: false, type: 'application/json'              },\n\t\t'eot':      { binary: false, type: 'application/vnd.ms-fontobject' },\n\t\t'gz':       { binary: true,  type: 'application/x-gzip'            },\n\t\t'fnt':      { binary: false, type: 'application/json'              },\n\t\t'html':     { binary: false, type: 'text/html'                     },\n\t\t'ico':      { binary: true,  type: 'image/x-icon'                  },\n\t\t'jpg':      { binary: true,  type: 'image/jpeg'                    },\n\t\t'js':       { binary: false, type: 'application/javascript'        },\n\t\t'json':     { binary: false, type: 'application/json'              },\n\t\t'md':       { binary: false, type: 'text/x-markdown'               },\n\t\t'mf':       { binary: false, type: 'text/cache-manifest'           },\n\t\t'mp3':      { binary: true,  type: 'audio/mp3'                     },\n\t\t'ogg':      { binary: true,  type: 'application/ogg'               },\n\t\t'pkg':      { binary: false, type: 'application/json'              },\n\t\t'store':    { binary: false, type: 'application/json'              },\n\t\t'tar':      { binary: true,  type: 'application/x-tar'             },\n\t\t'ttf':      { binary: false, type: 'application/x-font-truetype'   },\n\t\t'txt':      { binary: false, type: 'text/plain'                    },\n\t\t'png':      { binary: true,  type: 'image/png'                     },\n\t\t'svg':      { binary: true,  type: 'image/svg+xml'                 },\n\t\t'woff':     { binary: true,  type: 'application/font-woff'         },\n\t\t'woff2':    { binary: true,  type: 'application/font-woff'         },\n\t\t'xml':      { binary: false, type: 'text/xml'                      },\n\t\t'zip':      { binary: true,  type: 'application/zip'               }\n\t};\n\n\tconst _PUBLIC_PROJECT = {\n\t\tidentifier: '/libraries/harvester/public',\n\t\tfilesystem: new _Filesystem({\n\t\t\troot: '/libraries/harvester/public'\n\t\t})\n\t};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _get_headers = function(info, mime) {\n\n\t\tlet headers = {\n\t\t\t'status':          '200 OK',\n\t\t\t'e-tag':           '\"' + info.length + '-' + Date.parse(info.mtime) + '\"',\n\t\t\t'last-modified':   new Date(info.mtime).toUTCString(),\n\t\t\t'content-control': 'no-transform',\n\t\t\t'content-type':    mime.type,\n\t\t\t'expires':         new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString(),\n\t\t\t'vary':            'Accept-Encoding',\n\t\t\t'@binary':         mime.binary\n\t\t};\n\n\n\t\tif (mime.type.substr(0, 4) === 'text') {\n\t\t\theaders['content-type'] = mime.type + '; charset=utf-8';\n\t\t}\n\n\n\t\treturn headers;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * MODULE API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'harvester.net.server.File',\n\t\t\t\t'arguments': []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\treceive: function(payload, headers) {\n\n\t\t\tpayload = payload instanceof Buffer ? payload : null;\n\t\t\theaders = headers instanceof Object ? headers : {};\n\n\n\t\t\tlet identifier = null;\n\t\t\tlet info       = null;\n\t\t\tlet path       = null;\n\t\t\tlet project    = null;\n\t\t\tlet tunnel     = this.tunnel;\n\t\t\tlet url        = headers['url'];\n\t\t\tlet mime       = _MIME[url.split('.').pop()] || _MIME['default'];\n\n\n\t\t\t// Single-project mode\n\t\t\tif (lychee.ROOT.lychee !== lychee.ROOT.project) {\n\n\t\t\t\tidentifier = lychee.ROOT.project;\n\t\t\t\tpath       = url;\n\t\t\t\tproject    = lychee.import('MAIN')._projects[identifier] || null;\n\n\n\t\t\t// Multi-library mode /libraries/*\n\t\t\t} else if (url.substr(0, 10) === '/libraries') {\n\n\t\t\t\tidentifier = url.split('/').slice(0, 3).join('/');\n\t\t\t\tpath       = '/' + url.split('/').slice(3).join('/');\n\t\t\t\tproject    = lychee.import('MAIN')._libraries[identifier] || null;\n\n\n\t\t\t// Multi-project mode /projects/*\n\t\t\t} else if (url.substr(0, 9) === '/projects') {\n\n\t\t\t\tidentifier = url.split('/').slice(0, 3).join('/');\n\t\t\t\tpath       = '/' + url.split('/').slice(3).join('/');\n\t\t\t\tproject    = lychee.import('MAIN')._projects[identifier] || null;\n\n\n\t\t\t// /favicon.ico /index.html\n\t\t\t} else {\n\n\t\t\t\tidentifier = null;\n\t\t\t\tpath       = url;\n\t\t\t\tproject    = _PUBLIC_PROJECT;\n\n\t\t\t}\n\n\n\t\t\tif (project !== null) {\n\t\t\t\tinfo = project.filesystem.info(path);\n\t\t\t}\n\n\n\t\t\tif (project !== null && info !== null && info.type === 'file') {\n\n\t\t\t\tlet timestamp = headers['if-modified-since'] || null;\n\t\t\t\tif (timestamp !== null) {\n\n\t\t\t\t\tlet diff = info.mtime > new Date(timestamp);\n\t\t\t\t\tif (diff === false) {\n\n\t\t\t\t\t\ttunnel.send('', {\n\t\t\t\t\t\t\t'status':        '304 Not Modified',\n\t\t\t\t\t\t\t'last-modified': info.mtime.toUTCString()\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t} else {\n\n\t\t\t\t\t\tproject.filesystem.read(path, function(payload) {\n\t\t\t\t\t\t\ttunnel.send(payload, _get_headers(info, mime));\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t}\n\n\t\t\t\t} else {\n\n\t\t\t\t\tproject.filesystem.read(path, function(payload) {\n\t\t\t\t\t\ttunnel.send(payload, _get_headers(info, mime));\n\t\t\t\t\t});\n\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"}},"harvester.net.server.Redirect":{"constructor":"lychee.Definition","arguments":["harvester.net.server.Redirect"],"blob":{"attaches":{},"exports":"function (lychee, global, attachments) {\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * MODULE API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'harvester.net.server.Redirect',\n\t\t\t\t'arguments': []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\treceive: function(payload, headers) {\n\n\t\t\tpayload = payload instanceof Buffer ? payload : null;\n\t\t\theaders = headers instanceof Object ? headers : {};\n\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tlet url    = headers['url'];\n\n\n\t\t\t// Single-project mode\n\t\t\tif (lychee.ROOT.lychee !== lychee.ROOT.project) {\n\n\t\t\t\tlet identifier = lychee.ROOT.project;\n\t\t\t\tlet project    = lychee.import('MAIN')._projects[identifier] || null;\n\t\t\t\tif (project !== null) {\n\n\t\t\t\t\tlet path = url;\n\t\t\t\t\tif (path === '' || path === '/') {\n\n\t\t\t\t\t\tlet info = project.filesystem.info('/index.html');\n\t\t\t\t\t\tif (info !== null) {\n\n\t\t\t\t\t\t\ttunnel.send('', {\n\t\t\t\t\t\t\t\t'status':   '301 Moved Permanently',\n\t\t\t\t\t\t\t\t'location': '/index.html'\n\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t// Multi-project mode /index.html\n\t\t\t} else if (url === '/') {\n\n\t\t\t\ttunnel.send('SHIT', {\n\t\t\t\t\t'status':   '301 Moved Permanently',\n\t\t\t\t\t'location': '/index.html'\n\t\t\t\t});\n\n\t\t\t\treturn true;\n\n\n\t\t\t// Multi-project mode /projects/*\n\t\t\t} else if (url.substr(0, 9) === '/projects') {\n\n\t\t\t\tlet identifier = url.split('/').slice(0, 3).join('/');\n\t\t\t\tlet project    = lychee.import('MAIN')._projects[identifier] || null;\n\t\t\t\tif (project !== null) {\n\n\t\t\t\t\tlet path = '/' + url.split('/').slice(3).join('/');\n\t\t\t\t\tif (path === identifier || path === identifier + '/' || path === '/') {\n\n\t\t\t\t\t\tlet info = project.filesystem.info('/index.html');\n\t\t\t\t\t\tif (info !== null) {\n\n\t\t\t\t\t\t\ttunnel.send('', {\n\t\t\t\t\t\t\t\t'status':   '301 Moved Permanently',\n\t\t\t\t\t\t\t\t'location': identifier + '/index.html'\n\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"}},"harvester.data.Filesystem":{"constructor":"lychee.Definition","arguments":["harvester.data.Filesystem"],"blob":{"attaches":{},"tags":{"platform":"node"},"supports":"function (lychee, global) {\n\n\ttry {\n\n\t\trequire('fs');\n\t\trequire('path');\n\n\t\treturn true;\n\n\t} catch (err) {\n\n\t}\n\n\n\treturn false;\n\n}","exports":"function (lychee, global, attachments) {\n\n\tconst _ROOT = lychee.ROOT.lychee;\n\tconst _fs   = require('fs');\n\tconst _path = require('path');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _create_directory = function(path, mode) {\n\n\t\tif (mode === undefined) {\n\t\t\tmode = 0o777 & (~process.umask());\n\t\t}\n\n\n\t\tlet is_directory = false;\n\n\t\ttry {\n\n\t\t\tis_directory = _fs.lstatSync(path).isDirectory();\n\n\t\t} catch (err) {\n\n\t\t\tif (err.code === 'ENOENT') {\n\n\t\t\t\tif (_create_directory(_path.dirname(path), mode) === true) {\n\t\t\t\t\t_fs.mkdirSync(path, mode);\n\t\t\t\t}\n\n\t\t\t\ttry {\n\t\t\t\t\tis_directory = _fs.lstatSync(path).isDirectory();\n\t\t\t\t} catch (err) {\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn is_directory;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({}, data);\n\n\n\t\tthis.root = typeof settings.root === 'string' ? settings.root : null;\n\n\t\tthis.__root = _ROOT;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tif (this.root !== null) {\n\n\t\t\tlet tmp1 = _path.normalize(this.root);\n\t\t\tlet tmp2 = _ROOT;\n\t\t\tif (tmp1.startsWith('/')) {\n\t\t\t\ttmp2 = _ROOT + tmp1;\n\t\t\t} else if (tmp1.startsWith('./')) {\n\t\t\t\ttmp2 = _ROOT + tmp1.substr(1);\n\t\t\t}\n\n\t\t\tif (tmp2.endsWith('/')) {\n\t\t\t\ttmp2 = tmp2.substr(0, tmp2.length - 1);\n\t\t\t}\n\n\t\t\tthis.__root = tmp2;\n\n\t\t}\n\n\t\tsettings = null;\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'harvester.data.Filesystem',\n\t\t\t\t'arguments':   [ this.root.substr(_ROOT.length) ]\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tasset: function(path, callback, scope) {\n\n\t\t\tpath     = typeof path === 'string'     ? path     : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tif (path === null) {\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback(null);\n\t\t\t\t} else {\n\t\t\t\t\treturn null;\n\t\t\t\t}\n\n\t\t\t} else if (path.charAt(0) !== '/') {\n\t\t\t\tpath = '/' + path;\n\t\t\t}\n\n\n\t\t\tlet asset    = null;\n\t\t\tlet resolved = _path.normalize(this.__root.substr(process.cwd().length) + path);\n\t\t\tif (callback !== null) {\n\n\t\t\t\tasset = new lychee.Asset(resolved, null, true);\n\n\t\t\t\tif (asset !== null) {\n\n\t\t\t\t\tasset.onload = function() {\n\t\t\t\t\t\tcallback.call(scope, this);\n\t\t\t\t\t};\n\n\t\t\t\t\tasset.load();\n\n\t\t\t\t} else {\n\n\t\t\t\t\tcallback.call(scope, null);\n\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\ttry {\n\n\t\t\t\t\tasset = new lychee.Asset(resolved, null, true);\n\n\t\t\t\t\tif (asset !== null) {\n\t\t\t\t\t\tasset.load();\n\t\t\t\t\t}\n\n\t\t\t\t\treturn asset;\n\n\t\t\t\t} catch (err) {\n\t\t\t\t\treturn null;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\tdir: function(path, callback, scope) {\n\n\t\t\tpath     = typeof path === 'string'     ? path     : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tif (path === null) {\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback([]);\n\t\t\t\t} else {\n\t\t\t\t\treturn [];\n\t\t\t\t}\n\n\t\t\t} else if (path.charAt(0) !== '/') {\n\t\t\t\tpath = '/' + path;\n\t\t\t}\n\n\n\t\t\tlet resolved = _path.normalize(this.__root + path);\n\t\t\tif (callback !== null) {\n\n\t\t\t\t_fs.readdir(resolved, function(err, data) {\n\n\t\t\t\t\tif (err) {\n\t\t\t\t\t\tcallback.call(scope, []);\n\t\t\t\t\t} else {\n\t\t\t\t\t\tcallback.call(scope, data);\n\t\t\t\t\t}\n\n\t\t\t\t});\n\n\t\t\t} else {\n\n\t\t\t\ttry {\n\t\t\t\t\treturn _fs.readdirSync(resolved);\n\t\t\t\t} catch (err) {\n\t\t\t\t\treturn [];\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\tread: function(path, callback, scope) {\n\n\t\t\tpath     = typeof path === 'string'     ? path     : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tif (path === null) {\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback(null);\n\t\t\t\t} else {\n\t\t\t\t\treturn null;\n\t\t\t\t}\n\n\t\t\t} else if (path.charAt(0) !== '/') {\n\t\t\t\tpath = '/' + path;\n\t\t\t}\n\n\n\t\t\tlet resolved = _path.normalize(this.__root + path);\n\t\t\tif (callback !== null) {\n\n\t\t\t\tlet data = null;\n\t\t\t\ttry {\n\t\t\t\t\tdata = _fs.readFileSync(resolved);\n\t\t\t\t} catch (err) {\n\t\t\t\t\tdata = null;\n\t\t\t\t}\n\n\t\t\t\tcallback.call(scope, data);\n\n\t\t\t} else {\n\n\t\t\t\ttry {\n\t\t\t\t\treturn _fs.readFileSync(resolved);\n\t\t\t\t} catch (err) {\n\t\t\t\t\treturn null;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\twrite: function(path, data, callback, scope) {\n\n\t\t\tpath     = typeof path === 'string'     ? path     : null;\n\t\t\tdata     = data !== undefined           ? data     : null;\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tif (path === null) {\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback(false);\n\t\t\t\t} else {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\n\t\t\t} else if (path.charAt(0) !== '/') {\n\t\t\t\tpath = '/' + path;\n\t\t\t}\n\n\n\t\t\tlet encoding = 'binary';\n\n\t\t\tif (typeof data === 'string') {\n\t\t\t\tencoding = 'utf8';\n\t\t\t} else {\n\t\t\t\tencoding = 'binary';\n\t\t\t}\n\n\n\t\t\t_create_directory(_path.dirname(this.__root + path));\n\n\n\t\t\tlet info     = this.info(_path.dirname(path));\n\t\t\tlet resolved = _path.normalize(this.__root + path);\n\t\t\tif (resolved !== null && info !== null && info.type === 'directory') {\n\n\t\t\t\tif (callback !== null) {\n\n\t\t\t\t\tlet result = false;\n\t\t\t\t\ttry {\n\t\t\t\t\t\t_fs.writeFileSync(resolved, data, encoding);\n\t\t\t\t\t\tresult = true;\n\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\tresult = false;\n\t\t\t\t\t}\n\n\t\t\t\t\tcallback.call(scope, result);\n\n\t\t\t\t} else {\n\n\t\t\t\t\tlet result = false;\n\t\t\t\t\ttry {\n\t\t\t\t\t\t_fs.writeFileSync(resolved, data, encoding);\n\t\t\t\t\t\tresult = true;\n\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\tresult = false;\n\t\t\t\t\t}\n\n\t\t\t\t\treturn result;\n\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tif (callback !== null) {\n\t\t\t\t\tcallback.call(scope, false);\n\t\t\t\t} else {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\tinfo: function(path) {\n\n\t\t\tpath = typeof path === 'string' ? path : null;\n\n\n\t\t\tif (path === null) {\n\t\t\t\treturn null;\n\t\t\t} else if (path.charAt(0) !== '/') {\n\t\t\t\tpath = '/' + path;\n\t\t\t}\n\n\n\t\t\tlet resolved = _path.normalize(this.__root + path);\n\t\t\tif (resolved !== null) {\n\n\t\t\t\tlet stat = null;\n\n\t\t\t\ttry {\n\t\t\t\t\tstat = _fs.lstatSync(resolved);\n\t\t\t\t} catch (err) {\n\t\t\t\t\tstat = null;\n\t\t\t\t}\n\n\n\t\t\t\tif (stat !== null) {\n\n\t\t\t\t\treturn {\n\t\t\t\t\t\ttype:   stat.isFile() ? 'file' : 'directory',\n\t\t\t\t\t\tlength: stat.size,\n\t\t\t\t\t\tmtime:  new Date(stat.mtime.toUTCString())\n\t\t\t\t\t};\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.data.Project":{"constructor":"lychee.Definition","arguments":["harvester.data.Project"],"blob":{"attaches":{},"requires":["harvester.data.Filesystem","harvester.data.Package","harvester.data.Server"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Filesystem = lychee.import('harvester.data.Filesystem');\n\tconst _Package    = lychee.import('harvester.data.Package');\n\tconst _Server     = lychee.import('harvester.data.Server');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({}, data);\n\n\n\t\tthis.identifier = typeof settings.identifier === 'string' ? settings.identifier : '/projects/boilerplate';\n\t\tthis.filesystem = new _Filesystem({\n\t\t\troot: this.identifier\n\t\t});\n\t\tthis.package    = new _Package({\n\t\t\tbuffer: this.filesystem.read('/lychee.pkg')\n\t\t});\n\t\tthis.server     = null;\n\t\tthis.harvester  = false;\n\n\n\t\tif (Object.keys(this.package.source).length === 0) {\n\t\t\tconsole.error('harvester.data.Project: Invalid package at \"' + this.identifier + '/lychee.pkg\".');\n\t\t}\n\n\n\t\tlet check = this.filesystem.info('/harvester.js');\n\t\tif (check !== null) {\n\t\t\tthis.harvester = true;\n\t\t}\n\n\n\t\tsettings = null;\n\n\t};\n\n\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet blob = {};\n\n\n\t\t\tif (this.filesystem !== null) blob.filesystem = lychee.serialize(this.filesystem);\n\t\t\tif (this.package !== null)    blob.package    = lychee.serialize(this.package);\n\t\t\tif (this.server !== null)     blob.server     = lychee.serialize(this.server);\n\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'harvester.data.Project',\n\t\t\t\t'arguments':   [ this.identifier ],\n\t\t\t\t'blob':        Object.keys(blob).length > 0 ? blob : null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsetPackage: function(pkg) {\n\n\t\t\tpkg = pkg instanceof _Package ? pkg : null;\n\n\n\t\t\tif (pkg !== null) {\n\n\t\t\t\tthis.package = pkg;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetServer: function(server) {\n\n\t\t\tserver = server instanceof _Server ? server : null;\n\n\n\t\t\tif (server !== null) {\n\n\t\t\t\tthis.server = server;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.mod.Beautifier":{"constructor":"lychee.Definition","arguments":["harvester.mod.Beautifier"],"blob":{"attaches":{},"requires":["harvester.data.Project"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Project = lychee.import('harvester.data.Package');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _beautify_json = function(project, path) {\n\n\t\tlet data = null;\n\n\t\ttry {\n\t\t\tdata = JSON.parse(project.filesystem.read(path));\n\t\t} catch (err) {\n\t\t\tdata = null;\n\t\t}\n\n\n\t\tif (data !== null) {\n\n\t\t\tdata = JSON.stringify(data, null, '\\t');\n\t\t\tproject.filesystem.write(path, data);\n\n\t\t}\n\n\n\t\treturn data;\n\n\t};\n\n\tconst _get_files = function(project) {\n\n\t\tlet files = [];\n\n\n\t\t_walk_directory.call(project.filesystem, '/source', files);\n\n\n\t\treturn files;\n\n\t};\n\n\tconst _walk_directory = function(path, cache) {\n\n\t\tlet that = this;\n\t\tlet name = path.split('/').pop();\n\n\t\tlet info = this.info(path);\n\t\tif (info !== null && name.substr(0, 1) !== '.') {\n\n\t\t\tif (info.type === 'file') {\n\n\t\t\t\tlet ext = name.split('.').pop();\n\t\t\t\tif (ext === 'json') {\n\t\t\t\t\tcache.push(path);\n\t\t\t\t}\n\n\t\t\t} else if (info.type === 'directory') {\n\n\t\t\t\tthis.dir(path).forEach(function(child) {\n\t\t\t\t\t_walk_directory.call(that, path + '/' + child, cache);\n\t\t\t\t});\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'harvester.mod.Beautifier',\n\t\t\t\t'arguments': []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcan: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tif (project.identifier.indexOf('__') === -1 && project.package !== null && project.filesystem !== null) {\n\n\t\t\t\t\tlet files = _get_files(project);\n\t\t\t\t\tif (files.length > 0) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tprocess: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tif (project.package !== null) {\n\n\t\t\t\t\tlet files = _get_files(project);\n\t\t\t\t\tif (files.length > 0) {\n\n\t\t\t\t\t\tfiles.filter(function(path) {\n\t\t\t\t\t\t\treturn path.split('.').pop() === 'json';\n\t\t\t\t\t\t}).forEach(function(path) {\n\t\t\t\t\t\t\t_beautify_json(project, path);\n\t\t\t\t\t\t});\n\n\t\t\t\t\t}\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"}},"harvester.mod.Fertilizer":{"constructor":"lychee.Definition","arguments":["harvester.mod.Fertilizer"],"blob":{"attaches":{},"tags":{"platform":"node"},"requires":["harvester.data.Project"],"supports":"function (lychee, global) {\n\n\tif (typeof global.require === 'function') {\n\n\t\ttry {\n\n\t\t\tglobal.require('child_process');\n\n\t\t\treturn true;\n\n\t\t} catch (err) {\n\n\t\t}\n\n\t}\n\n\n\treturn false;\n\n}","exports":"function (lychee, global, attachments) {\n\n\tconst _child_process = global.require('child_process');\n\tconst _setInterval   = global.setInterval;\n\tconst _Project       = lychee.import('harvester.data.Project');\n\tlet   _ACTIVE        = false;\n\tconst _CACHE         = {};\n\tconst _QUEUE         = [];\n\n\n\n\t/*\n\t * FEATURE DETECTION\n\t */\n\n\t(function(cache) {\n\n\t\t_setInterval(function() {\n\n\t\t\tif (_ACTIVE === false) {\n\n\t\t\t\tlet tmp = _QUEUE.splice(0, 1);\n\t\t\t\tif (tmp.length === 1) {\n\n\t\t\t\t\t_ACTIVE = true;\n\t\t\t\t\t_fertilize(tmp[0].project, tmp[0].target);\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, 1000);\n\n\t})(_CACHE);\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _is_cached = function(id, target, pkg) {\n\n\t\tlet cache = _CACHE[id] || null;\n\t\tif (cache !== null) {\n\n\t\t\tif (cache[target] === pkg) {\n\t\t\t\treturn true;\n\t\t\t}\n\n\t\t}\n\n\t\treturn false;\n\n\t};\n\n\tconst _fertilize = function(project, target) {\n\n\t\t_child_process.execFile(lychee.ROOT.lychee + '/libraries/fertilizer/bin/fertilizer.sh', [\n\t\t\ttarget,\n\t\t\tproject\n\t\t], {\n\t\t\tcwd: lychee.ROOT.lychee\n\t\t}, function(error, stdout, stderr) {\n\n\t\t\t_ACTIVE = false;\n\n\t\t\tif (error || stdout.indexOf('fertilizer: SUCCESS') === -1) {\n\t\t\t\tconsole.error('harvester.mod.Fertilizer: FAILURE (\"' + project + ' | ' + target + '\")');\n\t\t\t} else {\n\t\t\t\tconsole.info('harvester.mod.Fertilizer: SUCCESS (\"' + project + ' | ' + target + '\")');\n\t\t\t}\n\n\t\t});\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'harvester.mod.Fertilizer',\n\t\t\t\t'arguments': []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcan: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tlet id  = project.identifier;\n\t\t\t\tlet pkg = project.package;\n\n\t\t\t\tif (id.indexOf('__') === -1 && pkg !== null) {\n\n\t\t\t\t\tlet build = pkg.json.build || null;\n\t\t\t\t\tif (build !== null) {\n\n\t\t\t\t\t\tlet environments = build.environments || null;\n\t\t\t\t\t\tif (environments !== null) {\n\n\t\t\t\t\t\t\tlet targets = Object.keys(environments).filter(function(target) {\n\t\t\t\t\t\t\t\treturn _is_cached(id, target, pkg) === false;\n\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t\tif (targets.length > 0) {\n\t\t\t\t\t\t\t\treturn true;\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tprocess: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tlet id  = project.identifier;\n\t\t\t\tlet fs  = project.filesystem;\n\t\t\t\tlet pkg = project.package;\n\n\t\t\t\tif (fs !== null && pkg !== null) {\n\n\t\t\t\t\tlet build = pkg.json.build || null;\n\t\t\t\t\tif (build !== null) {\n\n\t\t\t\t\t\tlet environments = build.environments || null;\n\t\t\t\t\t\tif (environments !== null) {\n\n\t\t\t\t\t\t\tObject.keys(environments).filter(function(target) {\n\t\t\t\t\t\t\t\treturn _is_cached(id, target, pkg) === false;\n\t\t\t\t\t\t\t}).forEach(function(target) {\n\n\t\t\t\t\t\t\t\tlet cache = _CACHE[id] || null;\n\t\t\t\t\t\t\t\tif (cache === null) {\n\t\t\t\t\t\t\t\t\tcache = _CACHE[id] = {};\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\tcache[target] = pkg;\n\n\t\t\t\t\t\t\t\t_QUEUE.push({\n\t\t\t\t\t\t\t\t\tproject: id,\n\t\t\t\t\t\t\t\t\ttarget:  target\n\t\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t\t});\n\n\n\t\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"}},"harvester.mod.Harvester":{"constructor":"lychee.Definition","arguments":["harvester.mod.Harvester"],"blob":{"attaches":{},"requires":["harvester.data.Git","harvester.data.Project","harvester.net.Client"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Client   = lychee.import('harvester.net.Client');\n\tconst _Git      = lychee.import('harvester.data.Git');\n\tconst _Project  = lychee.import('harvester.data.Project');\n\tconst _git      = new _Git();\n\tlet   _CLIENT   = null;\n\tconst _TIMEOUTS = {};\n\tlet   _TIMEOUT  = null;\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'harvester.mod.Harvester',\n\t\t\t\t'arguments': []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcan: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tif (_CLIENT === null) {\n\n\t\t\t\t\t_CLIENT = new _Client({\n\t\t\t\t\t\thost: 'harvester.artificial.engineering',\n\t\t\t\t\t\tport: 4848\n\t\t\t\t\t});\n\n\t\t\t\t\t_CLIENT.bind('connect', function() {\n\n\t\t\t\t\t\tlet service = _CLIENT.getService('harvester');\n\t\t\t\t\t\tif (service !== null) {\n\t\t\t\t\t\t\tservice.connect();\n\t\t\t\t\t\t}\n\n\t\t\t\t\t});\n\n\t\t\t\t\t_CLIENT.bind('disconnect', function() {\n\n\t\t\t\t\t\tconsole.log('\\n');\n\t\t\t\t\t\tconsole.warn('+--------------------------------------------------------+');\n\t\t\t\t\t\tconsole.warn('| No connection to harvester.artificial.engineering:4848 |');\n\t\t\t\t\t\tconsole.warn('| Cannot synchronize the AI\\'s api, knowledge or training |');\n\t\t\t\t\t\tconsole.warn('+--------------------------------------------------------+');\n\t\t\t\t\t\tconsole.log('\\n');\n\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\n\t\t\t\tlet id  = project.identifier;\n\t\t\t\tlet pkg = project.package;\n\n\t\t\t\tif (id.indexOf('__') === -1 && pkg !== null) {\n\n\t\t\t\t\tlet timeout = _TIMEOUTS[id] || null;\n\t\t\t\t\tif (timeout === null || Date.now() > timeout) {\n\n\t\t\t\t\t\tlet diff = _git.diff(project.identifier);\n\t\t\t\t\t\tif (diff === null) {\n\n\t\t\t\t\t\t\tlet service = _CLIENT.getService('harvester');\n\t\t\t\t\t\t\tif (service !== null) {\n\t\t\t\t\t\t\t\treturn true;\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tprocess: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tlet id  = project.identifier;\n\t\t\t\tlet pkg = project.package;\n\n\t\t\t\tif (id.indexOf('__') === -1 && pkg !== null) {\n\n\t\t\t\t\tlet report = _git.report(id);\n\t\t\t\t\tif (report.status === _Git.STATUS.update) {\n\n\t\t\t\t\t\t_TIMEOUTS[id] = Date.now() + 24 * 60 * 60 * 1000;\n\n\n\t\t\t\t\t\t// XXX: lychee.js Libraries / Projects are not\n\t\t\t\t\t\t// shipped in their own repositories.\n\n\t\t\t\t\t\tlet timeout = _TIMEOUT || null;\n\t\t\t\t\t\tif (timeout === null || Date.now() > timeout) {\n\n\t\t\t\t\t\t\tlet result = _git.fetch(report.branch);\n\t\t\t\t\t\t\tif (result === true) {\n\t\t\t\t\t\t\t\tconsole.info('harvester.mod.Harvester: FETCH (\"' + report.branch + '\")');\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\ttimeout = _TIMEOUT = Date.now() + 24 * 60 * 60 * 1000;\n\n\t\t\t\t\t\t}\n\n\n\t\t\t\t\t\t// XXX: This filters unnecessary checkouts\n\n\t\t\t\t\t\tif (timeout !== null) {\n\n\t\t\t\t\t\t\tif (report.branch === 'master' || report.branch === 'development') {\n\n\t\t\t\t\t\t\t\tlet result = _git.checkout(report.branch, id);\n\t\t\t\t\t\t\t\tif (result === true) {\n\n\t\t\t\t\t\t\t\t\tconsole.info('harvester.mod.Harvester: CHECKOUT (\"' + report.branch + '\", \"' + id + '\")');\n\n\t\t\t\t\t\t\t\t} else {\n\n\t\t\t\t\t\t\t\t\tconsole.error('harvester.mod.Harvester: CHECKOUT (\"' + report.branch + '\", \"' + id + '\")');\n\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\treturn result;\n\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"}},"harvester.mod.Packager":{"constructor":"lychee.Definition","arguments":["harvester.mod.Packager"],"blob":{"attaches":{},"requires":["harvester.data.Package","harvester.data.Project"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Package = lychee.import('harvester.data.Package');\n\tconst _Project = lychee.import('harvester.data.Project');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _get_reasons = function(aobject, bobject, reasons, path) {\n\n\t\tpath = typeof path === 'string' ? path : '';\n\n\n\t\tlet akeys = Object.keys(aobject);\n\t\tlet bkeys = Object.keys(bobject);\n\n\t\tif (akeys.length !== bkeys.length) {\n\n\t\t\tfor (let a = 0, al = akeys.length; a < al; a++) {\n\n\t\t\t\tlet aval = akeys[a];\n\t\t\t\tlet bval = bkeys.find(function(val) {\n\t\t\t\t\treturn val === aval;\n\t\t\t\t});\n\n\t\t\t\tif (bval === undefined) {\n\t\t\t\t\treasons.push(path + '/' + aval);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tfor (let b = 0, bl = bkeys.length; b < bl; b++) {\n\n\t\t\t\tlet bval = bkeys[b];\n\t\t\t\tlet aval = akeys.find(function(val) {\n\t\t\t\t\treturn val === bval;\n\t\t\t\t});\n\n\t\t\t\tif (aval === undefined) {\n\t\t\t\t\treasons.push(path + '/' + bval);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t} else {\n\n\t\t\tfor (let a = 0, al = akeys.length; a < al; a++) {\n\n\t\t\t\tlet key = akeys[a];\n\n\t\t\t\tif (bobject[key] !== undefined) {\n\n\t\t\t\t\tif (aobject[key] !== null && bobject[key] !== null) {\n\n\t\t\t\t\t\tif (aobject[key] instanceof Object && bobject[key] instanceof Object) {\n\t\t\t\t\t\t\t_get_reasons(aobject[key], bobject[key], reasons, path + '/' + key);\n\t\t\t\t\t\t} else if (typeof aobject[key] !== typeof bobject[key]) {\n\t\t\t\t\t\t\treasons.push(path + '/' + key);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t} else {\n\t\t\t\t\treasons.push(path + '/' + key);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _serialize = function(project) {\n\n\t\tlet json = {};\n\t\tlet tmp  = {};\n\n\n\t\ttry {\n\n\t\t\tjson = JSON.parse(project.filesystem.read('/lychee.pkg'));\n\n\t\t} catch (err) {\n\n\t\t\tconsole.error('harvester.mod.Packager: FAILURE (\"' + project.identifier + '\")');\n\n\t\t\ttry {\n\t\t\t\tjson = JSON.parse(JSON.stringify(project.package.json));\n\t\t\t} catch (err) {\n\t\t\t}\n\n\t\t}\n\n\t\tif (json === null)                      json        = {};\n\t\tif (typeof json.api    === 'undefined') json.api    = {};\n\t\tif (typeof json.build  === 'undefined') json.build  = {};\n\t\tif (typeof json.source === 'undefined') json.source = {};\n\n\t\tjson.api.files    = {};\n\t\tjson.build.files  = {};\n\t\tjson.source.files = {};\n\n\t\t_walk_directory.call(project.filesystem, tmp, '/api');\n\t\t_walk_directory.call(project.filesystem, tmp, '/build');\n\t\t_walk_directory.call(project.filesystem, tmp, '/source');\n\n\t\tjson.api.files    = tmp.api    || {};\n\t\tjson.build.files  = tmp.build  || {};\n\t\tjson.source.files = tmp.source || {};\n\n\t\tjson.api.files    = _sort_recursive(json.api.files);\n\t\tjson.build.files  = _sort_recursive(json.build.files);\n\t\tjson.source.files = _sort_recursive(json.source.files);\n\n\t\tjson.build.tags   = _walk_tags(json.build.files);\n\t\tjson.source.tags  = _walk_tags(json.source.files);\n\n\n\t\treturn {\n\t\t\tapi:    json.api,\n\t\t\tbuild:  json.build,\n\t\t\tsource: json.source\n\t\t};\n\n\t};\n\n\tconst _sort_recursive = function(obj) {\n\n\t\tif (obj instanceof Array) {\n\n\t\t\treturn obj.sort();\n\n\t\t} else if (obj instanceof Object) {\n\n\t\t\tfor (let prop in obj) {\n\t\t\t\tobj[prop] = _sort_recursive(obj[prop]);\n\t\t\t}\n\n\t\t\treturn Object.sort(obj);\n\n\t\t} else {\n\n\t\t\treturn obj;\n\n\t\t}\n\n\t};\n\n\tconst _walk_tags = function(files) {\n\n\t\tlet tags = {};\n\n\t\tif (files.platform instanceof Object) {\n\n\t\t\ttags.platform = {};\n\n\t\t\tfor (let id in files.platform) {\n\t\t\t\ttags.platform[id] = 'platform/' + id;\n\t\t\t}\n\n\t\t}\n\n\t\treturn tags;\n\n\t};\n\n\tconst _walk_directory = function(pointer, path) {\n\n\t\tlet that = this;\n\t\tlet name = path.split('/').pop();\n\n\t\tlet info = this.info(path);\n\t\tif (info !== null && name.substr(0, 1) !== '.') {\n\n\t\t\tif (info.type === 'file') {\n\n\t\t\t\tlet identifier = path.split('/').pop().split('.')[0];\n\t\t\t\tlet attachment = path.split('/').pop().split('.').slice(1).join('.');\n\n\t\t\t\t// Music and Sound asset have a trailing mp3 or ogg\n\t\t\t\t// extension which is dynamically chosen at runtime\n\t\t\t\tlet ext = attachment.split('.').pop();\n\t\t\t\tif (/(mp3|ogg)$/.test(ext)) {\n\t\t\t\t\tattachment = attachment.split('.').slice(0, -1).join('.');\n\t\t\t\t\text        = attachment.split('.').pop();\n\t\t\t\t}\n\n\t\t\t\tif (/(msc|snd|js|json|fnt|png|md|tpl)$/.test(ext) || path.substr(0, 7) === '/source') {\n\n\t\t\t\t\tif (pointer[identifier] instanceof Array) {\n\n\t\t\t\t\t\tif (pointer[identifier].indexOf(attachment) === -1) {\n\t\t\t\t\t\t\tpointer[identifier].push(attachment);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t} else {\n\t\t\t\t\t\tpointer[identifier] = [ attachment ];\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t} else if (info.type === 'directory') {\n\n\t\t\t\tpointer[name] = {};\n\n\t\t\t\tthis.dir(path).forEach(function(child) {\n\t\t\t\t\t_walk_directory.call(that, pointer[name], path + '/' + child);\n\t\t\t\t});\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'harvester.mod.Packager',\n\t\t\t\t'arguments': []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcan: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tif (project.identifier.indexOf('__') === -1 && project.package !== null && project.filesystem !== null) {\n\n\t\t\t\t\tlet diff_a = JSON.stringify(project.package.json);\n\t\t\t\t\tlet diff_b = JSON.stringify(_serialize(project));\n\t\t\t\t\tif (diff_a !== diff_b) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tprocess: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tlet reasons = [];\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tif (project.package !== null) {\n\n\t\t\t\t\tlet data = _serialize(project);\n\t\t\t\t\tlet blob = JSON.stringify(data, null, '\\t');\n\n\n\t\t\t\t\t_get_reasons(data, project.package.json, reasons);\n\n\n\t\t\t\t\tif (blob !== null) {\n\n\t\t\t\t\t\tproject.filesystem.write('/lychee.pkg', blob);\n\t\t\t\t\t\tproject.package = null;\n\t\t\t\t\t\tproject.package = new _Package({\n\t\t\t\t\t\t\tbuffer: new Buffer(blob, 'utf8')\n\t\t\t\t\t\t});\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\treturn reasons;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"}},"harvester.mod.Server":{"constructor":"lychee.Definition","arguments":["harvester.mod.Server"],"blob":{"attaches":{},"tags":{"platform":"node"},"requires":["harvester.data.Project","harvester.data.Server"],"supports":"function (lychee, global) {\n\n\tif (typeof global.require === 'function') {\n\n\t\ttry {\n\n\t\t\tglobal.require('child_process');\n\t\t\tglobal.require('net');\n\n\t\t\treturn true;\n\n\t\t} catch (err) {\n\n\t\t}\n\n\t}\n\n\n\treturn false;\n\n}","exports":"function (lychee, global, attachments) {\n\n\tconst _child_process = global.require('child_process');\n\tconst _net           = global.require('net');\n\tconst _Project       = lychee.import('harvester.data.Project');\n\tconst _Server        = lychee.import('harvester.data.Server');\n\tconst _BINARY        = process.execPath;\n\tconst _MIN_PORT      = 49152;\n\tlet   _CUR_PORT      = _MIN_PORT;\n\tconst _MAX_PORT      = 65534;\n\tlet   _LOG_PROJECT   = null;\n\tconst _ROOT          = lychee.ROOT.lychee;\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _report_error = function(text) {\n\n\t\tlet lines   = text.split('\\n');\n\t\tlet line    = null;\n\t\tlet file    = null;\n\t\tlet message = null;\n\n\n\t\tif (lines.length > 0) {\n\n\t\t\tif (lines[0].indexOf(':') !== -1) {\n\n\t\t\t\tfile = lines[0].split(':')[0];\n\t\t\t\tline = lines[0].split(':')[1];\n\n\t\t\t}\n\n\n\t\t\tlines.forEach(function(line) {\n\n\t\t\t\tlet err = line.substr(0, line.indexOf(':'));\n\t\t\t\tif (/Error/g.test(err)) {\n\t\t\t\t\tmessage = line.trim();\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t}\n\n\n\t\tif (file !== null && line !== null) {\n\t\t\tconsole.error('harvester.mod.Server: Report from ' + file + '#L' + line + ':');\n\t\t\tconsole.error('                      \"' + message + '\"');\n\t\t}\n\n\t};\n\n\tconst _scan_port = function(callback, scope) {\n\n\t\tcallback = callback instanceof Function ? callback : null;\n\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\tif (callback !== null) {\n\n\t\t\tlet socket = new _net.Socket();\n\t\t\tlet status = null;\n\t\t\tlet port   = _CUR_PORT++;\n\n\n\t\t\tsocket.setTimeout(100);\n\n\t\t\tsocket.on('connect', function() {\n\t\t\t\tstatus = 'used';\n\t\t\t\tsocket.destroy();\n\t\t\t});\n\n\t\t\tsocket.on('timeout', function(err) {\n\t\t\t\tstatus = 'free';\n\t\t\t\tsocket.destroy();\n\t\t\t});\n\n\t\t\tsocket.on('error', function(err) {\n\n\t\t\t\tif (err.code === 'ECONNREFUSED') {\n\t\t\t\t\tstatus = 'free';\n\t\t\t\t} else {\n\t\t\t\t\tstatus = 'used';\n\t\t\t\t}\n\n\t\t\t\tsocket.destroy();\n\n\t\t\t});\n\n\t\t\tsocket.on('close', function(err) {\n\n\t\t\t\tif (status === 'free') {\n\t\t\t\t\tcallback.call(scope, port);\n\t\t\t\t} else if (status === 'used') {\n\t\t\t\t\t_scan_port(callback, scope);\n\t\t\t\t} else {\n\t\t\t\t\tcallback.call(scope, null);\n\t\t\t\t}\n\n\t\t\t});\n\n\n\t\t\tsocket.connect(port, '127.0.0.1');\n\n\t\t}\n\n\t};\n\n\tconst _serve = function(project, host, port) {\n\n\t\tconsole.info('harvester.mod.Server: BOOTUP (\"' + project + ' | ' + host + ':' + port + '\")');\n\n\n\t\tlet server = null;\n\n\t\ttry {\n\n\t\t\t// XXX: Alternative is (_ROOT + '/bin/helper.sh', [ 'env:node', file, port, host ])\n\t\t\tserver = _child_process.execFile(_BINARY, [\n\t\t\t\t_ROOT + project + '/harvester.js',\n\t\t\t\tport,\n\t\t\t\thost\n\t\t\t], {\n\t\t\t\tcwd: _ROOT + project\n\t\t\t}, function(error, stdout, stderr) {\n\n\t\t\t\tstderr = (stderr.trim() || '').toString();\n\n\n\t\t\t\tif (error !== null && error.signal !== 'SIGTERM') {\n\n\t\t\t\t\t_LOG_PROJECT = project;\n\t\t\t\t\tconsole.error('harvester.mod.Server: FAILURE (\"' + project + ' | ' + host + ':' + port + '\")');\n\t\t\t\t\tconsole.error(stderr);\n\n\t\t\t\t} else if (stderr !== '') {\n\n\t\t\t\t\t_LOG_PROJECT = project;\n\t\t\t\t\tconsole.error('harvester.mod.Server: FAILURE (\"' + project + ' | ' + host + ':' + port + '\")');\n\t\t\t\t\t_report_error(stderr);\n\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t\tserver.stdout.on('data', function(lines) {\n\n\t\t\t\tlines = lines.trim().split('\\n').filter(function(message) {\n\n\t\t\t\t\tif (message.charAt(0) !== '\\u001b') {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t\treturn false;\n\n\t\t\t\t});\n\n\t\t\t\tif (lines.length > 0) {\n\n\t\t\t\t\tif (_LOG_PROJECT !== project) {\n\t\t\t\t\t\tconsole.log('harvester.mod.Server: LOG (\"' + project + '\")');\n\t\t\t\t\t\t_LOG_PROJECT = project;\n\t\t\t\t\t}\n\n\t\t\t\t\tlines.forEach(function(message) {\n\n\t\t\t\t\t\tlet type = message.trim().substr(0, 3);\n\t\t\t\t\t\tlet line = message.trim().substr(3).trim();\n\n\t\t\t\t\t\tif (type === '(L)') {\n\t\t\t\t\t\t\tconsole.log('                      ' + line);\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tconsole.log('                      ' + message.trim());\n\t\t\t\t\t\t}\n\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t\tserver.stderr.on('data', function(lines) {\n\n\t\t\t\tlines = lines.trim().split('\\n').filter(function(message) {\n\n\t\t\t\t\tif (message.charAt(0) === '\\u001b') {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t\treturn false;\n\n\t\t\t\t}).map(function(message) {\n\n\t\t\t\t\tif (message.charAt(0) === '\\u001b') {\n\t\t\t\t\t\tmessage = message.substr(12);\n\n\t\t\t\t\t\tif (message.charAt(message.length - 1) === 'm') {\n\t\t\t\t\t\t\tmessage = message.substr(0, message.length - 12);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t\treturn message;\n\n\t\t\t\t});\n\n\n\t\t\t\tif (lines.length > 0) {\n\n\t\t\t\t\tif (_LOG_PROJECT !== project) {\n\t\t\t\t\t\tconsole.error('harvester.mod.Server: ERROR (\"' + project + '\")');\n\t\t\t\t\t\t_LOG_PROJECT = project;\n\t\t\t\t\t}\n\n\t\t\t\t\tlines.forEach(function(message) {\n\n\t\t\t\t\t\tlet type = message.trim().substr(0, 3);\n\t\t\t\t\t\tlet line = message.trim().substr(3).trim();\n\n\t\t\t\t\t\tif (type === '(I)') {\n\t\t\t\t\t\t\tconsole.info('                      ' + line);\n\t\t\t\t\t\t} else if (type === '(W)') {\n\t\t\t\t\t\t\tconsole.warn('                      ' + line);\n\t\t\t\t\t\t} else if (type === '(E)') {\n\t\t\t\t\t\t\tconsole.error('                      ' + line);\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tconsole.error('                      ' + message.trim());\n\t\t\t\t\t\t}\n\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t\tserver.on('error', function() {\n\n\t\t\t\tconsole.warn('harvester.mod.Server: SHUTDOWN (\"' + project + ' | ' + host + ':' + port + '\")');\n\n\t\t\t\tthis.kill('SIGTERM');\n\n\t\t\t});\n\n\t\t\tserver.on('exit', function() {\n\t\t\t});\n\n\t\t\tserver.destroy = function() {\n\n\t\t\t\tconsole.warn('harvester.mod.Server: SHUTDOWN (\"' + project + ' | ' + host + ':' + port + '\")');\n\n\t\t\t\tthis.kill('SIGTERM');\n\n\t\t\t};\n\n\t\t} catch (err) {\n\n\t\t\tserver = null;\n\n\t\t}\n\n\t\treturn server;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'harvester.mod.Server',\n\t\t\t\t'arguments': []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcan: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tif (project.identifier.indexOf('__') === -1 && project.server === null) {\n\n\t\t\t\t\tlet info = project.filesystem.info('/harvester.js');\n\t\t\t\t\tif (info !== null && info.type === 'file') {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tprocess: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tif (project.server === null) {\n\n\t\t\t\t\tlet info = project.filesystem.info('/harvester.js');\n\t\t\t\t\tif (info !== null && info.type === 'file') {\n\n\t\t\t\t\t\t_scan_port(function(port) {\n\n\t\t\t\t\t\t\tif (port >= _MIN_PORT && port <= _MAX_PORT) {\n\n\t\t\t\t\t\t\t\tlet server = _serve(project.identifier, null, port);\n\t\t\t\t\t\t\t\tif (server !== null) {\n\n\t\t\t\t\t\t\t\t\tproject.setServer(new _Server({\n\t\t\t\t\t\t\t\t\t\tprocess: server,\n\t\t\t\t\t\t\t\t\t\thost:    null,\n\t\t\t\t\t\t\t\t\t\tport:    port\n\t\t\t\t\t\t\t\t\t}));\n\n\t\t\t\t\t\t\t\t} else {\n\n\t\t\t\t\t\t\t\t\tconsole.error('harvester.mod.Server: FAILURE (\"' + project.identifier + ' | null:' + port + '\") (chmod +x missing?)');\n\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}, this);\n\n\n\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"}},"harvester.mod.Strainer":{"constructor":"lychee.Definition","arguments":["harvester.mod.Strainer"],"blob":{"attaches":{},"tags":{"platform":"node"},"requires":["harvester.data.Project"],"supports":"function (lychee, global) {\n\n\tif (typeof global.require === 'function') {\n\n\t\ttry {\n\n\t\t\tglobal.require('child_process');\n\n\t\t\treturn true;\n\n\t\t} catch (err) {\n\n\t\t}\n\n\t}\n\n\n\treturn false;\n\n}","exports":"function (lychee, global, attachments) {\n\n\tconst _child_process = global.require('child_process');\n\tconst _setInterval   = global.setInterval;\n\tconst _Project       = lychee.import('harvester.data.Project');\n\tlet   _ACTIVE        = false;\n\tconst _QUEUE         = [];\n\n\n\n\t/*\n\t * FEATURE DETECTION\n\t */\n\n\t(function() {\n\n\t\t_setInterval(function() {\n\n\t\t\tif (_ACTIVE === false) {\n\n\t\t\t\tlet tmp = _QUEUE.splice(0, 1);\n\t\t\t\tif (tmp.length === 1) {\n\n\t\t\t\t\t_ACTIVE = true;\n\t\t\t\t\t_strain(tmp[0].project);\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, 1000);\n\n\t})();\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _is_queued = function(id) {\n\n\t\tlet entry = _QUEUE.find(function(entry) {\n\t\t\treturn entry.project === id;\n\t\t}) || null;\n\n\t\tif (entry !== null) {\n\t\t\treturn true;\n\t\t}\n\n\t\treturn false;\n\n\t};\n\n\tconst _strain = function(project) {\n\n\t\t_child_process.execFile(lychee.ROOT.lychee + '/libraries/strainer/bin/strainer.sh', [\n\t\t\t'check',\n\t\t\tproject\n\t\t], {\n\t\t\tcwd: lychee.ROOT.lychee\n\t\t}, function(error, stdout, stderr) {\n\n\t\t\t_ACTIVE = false;\n\n\n\t\t\tlet tmp = stderr.trim();\n\t\t\tif (error || tmp.indexOf('(E)') !== -1) {\n\n\t\t\t\tconsole.error('harvester.mod.Strainer: FAILURE (\"' + project + '\")');\n\n\t\t\t\tlet lines = tmp.split('\\n');\n\n\t\t\t\tfor (let l = 0, ll = lines.length; l < ll; l++) {\n\n\t\t\t\t\tlet line = lines[l];\n\t\t\t\t\tlet tmp1 = line.substr(15, line.length - 29).trim();\n\t\t\t\t\tif (tmp1.startsWith('strainer: /')) {\n\t\t\t\t\t\tconsole.error(tmp1.trim());\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tconsole.info('harvester.mod.Strainer: SUCCESS (\"' + project + '\")');\n\n\t\t\t}\n\n\t\t});\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'harvester.mod.Strainer',\n\t\t\t\t'arguments': []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcan: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tlet id  = project.identifier;\n\t\t\t\tlet fs  = project.filesystem;\n\t\t\t\tlet pkg = project.package;\n\n\t\t\t\tif (id.indexOf('__') === -1 && pkg !== null && fs !== null) {\n\n\t\t\t\t\tlet buffer = fs.read('/api/strainer.pkg');\n\t\t\t\t\tlet data   = [];\n\n\t\t\t\t\ttry {\n\t\t\t\t\t\tdata = JSON.parse(buffer.toString('utf8'));\n\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\tdata = [];\n\t\t\t\t\t}\n\n\n\t\t\t\t\tlet needs_check = false;\n\n\t\t\t\t\tif (data.length > 0) {\n\n\t\t\t\t\t\tfor (let d = 0, dl = data.length; d < dl; d++) {\n\n\t\t\t\t\t\t\tif (data[d] < Date.now()) {\n\t\t\t\t\t\t\t\tneeds_check = true;\n\t\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t} else {\n\n\t\t\t\t\t\tneeds_check = true;\n\n\t\t\t\t\t}\n\n\t\t\t\t\treturn needs_check;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tprocess: function(project) {\n\n\t\t\tproject = project instanceof _Project ? project : null;\n\n\n\t\t\tif (project !== null) {\n\n\t\t\t\tlet id  = project.identifier;\n\t\t\t\tlet fs  = project.filesystem;\n\t\t\t\tlet pkg = project.package;\n\n\t\t\t\tif (fs !== null && pkg !== null) {\n\n\t\t\t\t\tif (_is_queued(id) === false) {\n\n\t\t\t\t\t\t_QUEUE.push({\n\t\t\t\t\t\t\tproject: id\n\t\t\t\t\t\t});\n\n\n\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"}},"lychee.Storage":{"constructor":"lychee.Definition","arguments":["lychee.Storage"],"blob":{"attaches":{},"tags":{"platform":"node"},"includes":["lychee.event.Emitter"],"supports":"function (lychee, global) {\n\n\tif (typeof global.require === 'function') {\n\n\t\ttry {\n\n\t\t\tglobal.require('fs');\n\n\t\t\treturn true;\n\n\t\t} catch (err) {\n\n\t\t}\n\n\t}\n\n\n\treturn false;\n\n}","exports":"function (lychee, global, attachments) {\n\n\tlet   _id         = 0;\n\tconst _Emitter    = lychee.import('lychee.event.Emitter');\n\tconst _JSON       = {\n\t\tencode: JSON.stringify,\n\t\tdecode: JSON.parse\n\t};\n\tconst _PERSISTENT = {\n\t\tdata: {},\n\t\tread: function() {\n\t\t\treturn false;\n\t\t},\n\t\twrite: function() {\n\t\t\treturn false;\n\t\t}\n\t};\n\tconst _TEMPORARY  = {\n\t\tdata: {},\n\t\tread: function() {\n\t\t\treturn true;\n\t\t},\n\t\twrite: function() {\n\t\t\treturn true;\n\t\t}\n\t};\n\n\n\n\t/*\n\t * FEATURE DETECTION\n\t */\n\n\t(function() {\n\n\t\tconst _fs = global.require('fs');\n\n\n\t\tlet read = 'readFileSync' in _fs;\n\t\tif (read === true) {\n\n\t\t\t_PERSISTENT.read = function() {\n\n\t\t\t\tlet url = lychee.environment.resolve('./lychee.store');\n\n\n\t\t\t\tlet raw = null;\n\t\t\t\ttry {\n\t\t\t\t\traw = _fs.readFileSync(url, 'utf8');\n\t\t\t\t} catch (err) {\n\t\t\t\t\traw = null;\n\t\t\t\t}\n\n\n\t\t\t\tlet buffer = null;\n\t\t\t\ttry {\n\t\t\t\t\tbuffer = JSON.parse(raw);\n\t\t\t\t} catch (err) {\n\t\t\t\t\tbuffer = null;\n\t\t\t\t}\n\n\n\t\t\t\tif (buffer !== null) {\n\n\t\t\t\t\tfor (let id in buffer) {\n\t\t\t\t\t\t_PERSISTENT.data[id] = buffer[id];\n\t\t\t\t\t}\n\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\n\t\t\t\treturn false;\n\n\t\t\t};\n\n\t\t}\n\n\n\t\tlet write = 'writeFileSync' in _fs;\n\t\tif (write === true) {\n\n\t\t\t_PERSISTENT.write = function() {\n\n\t\t\t\tlet buffer = _JSON.encode(_PERSISTENT.data);\n\t\t\t\tlet url    = lychee.environment.resolve('./lychee.store');\n\n\n\t\t\t\tlet result = false;\n\t\t\t\ttry {\n\t\t\t\t\tresult = _fs.writeFileSync(url, buffer, 'utf8');\n\t\t\t\t} catch (err) {\n\t\t\t\t\tresult = false;\n\t\t\t\t}\n\n\n\t\t\t\treturn result;\n\n\t\t\t};\n\n\t\t}\n\n\n\t\tif (lychee.debug === true) {\n\n\t\t\tlet methods = [];\n\n\t\t\tif (read && write) methods.push('Persistent');\n\t\t\tif (_TEMPORARY)    methods.push('Temporary');\n\n\t\t\tif (methods.length === 0) {\n\t\t\t\tconsole.error('lychee.Storage: Supported methods are NONE');\n\t\t\t} else {\n\t\t\t\tconsole.info('lychee.Storage: Supported methods are ' + methods.join(', '));\n\t\t\t}\n\n\t\t}\n\n\n\t\t_PERSISTENT.read();\n\n\t})();\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _read_storage = function(silent) {\n\n\t\tsilent = silent === true;\n\n\n\t\tlet id   = this.id;\n\t\tlet blob = null;\n\n\n\t\tlet type = this.type;\n\t\tif (type === Composite.TYPE.persistent) {\n\t\t\tblob = _PERSISTENT.data[id] || null;\n\t\t} else if (type === Composite.TYPE.temporary) {\n\t\t\tblob = _TEMPORARY.data[id]  || null;\n\t\t}\n\n\n\t\tif (blob !== null) {\n\n\t\t\tif (this.model === null) {\n\n\t\t\t\tif (blob['@model'] instanceof Object) {\n\t\t\t\t\tthis.model = blob['@model'];\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (Object.keys(this.__objects).length !== Object.keys(blob['@objects']).length) {\n\n\t\t\t\tif (blob['@objects'] instanceof Object) {\n\n\t\t\t\t\tthis.__objects = {};\n\n\t\t\t\t\tfor (let o in blob['@objects']) {\n\t\t\t\t\t\tthis.__objects[o] = blob['@objects'][o];\n\t\t\t\t\t}\n\n\n\t\t\t\t\tif (silent === false) {\n\t\t\t\t\t\tthis.trigger('sync', [ this.__objects ]);\n\t\t\t\t\t}\n\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn false;\n\n\t};\n\n\tconst _write_storage = function(silent) {\n\n\t\tsilent = silent === true;\n\n\n\t\tlet operations = this.__operations;\n\t\tif (operations.length > 0) {\n\n\t\t\twhile (operations.length > 0) {\n\n\t\t\t\tlet operation = operations.shift();\n\t\t\t\tif (operation.type === 'update') {\n\n\t\t\t\t\tif (this.__objects[operation.id] !== operation.object) {\n\t\t\t\t\t\tthis.__objects[operation.id] = operation.object;\n\t\t\t\t\t}\n\n\t\t\t\t} else if (operation.type === 'remove') {\n\n\t\t\t\t\tif (this.__objects[operation.id] !== undefined) {\n\t\t\t\t\t\tdelete this.__objects[operation.id];\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tlet id   = this.id;\n\t\t\tlet blob = {\n\t\t\t\t'@model':   this.model,\n\t\t\t\t'@objects': this.__objects\n\t\t\t};\n\n\n\t\t\tlet type = this.type;\n\t\t\tif (type === Composite.TYPE.persistent) {\n\n\t\t\t\t_PERSISTENT.data[id] = blob;\n\t\t\t\t_PERSISTENT.write();\n\n\t\t\t} else if (type === Composite.TYPE.temporary) {\n\n\t\t\t\t_TEMPORARY.data[id] = blob;\n\n\t\t\t}\n\n\n\t\t\tif (silent === false) {\n\t\t\t\tthis.trigger('sync', [ this.__objects ]);\n\t\t\t}\n\n\n\t\t\treturn true;\n\n\t\t}\n\n\n\t\treturn false;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({}, data);\n\n\n\t\tthis.id    = 'lychee-Storage-' + _id++;\n\t\tthis.model = {};\n\t\tthis.type  = Composite.TYPE.persistent;\n\n\n\t\tthis.__objects    = {};\n\t\tthis.__operations = [];\n\n\n\t\tthis.setId(settings.id);\n\t\tthis.setModel(settings.model);\n\t\tthis.setType(settings.type);\n\n\n\t\t_Emitter.call(this);\n\n\t\tsettings = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\t_read_storage.call(this);\n\n\t};\n\n\n\tComposite.TYPE = {\n\t\tpersistent: 0,\n\t\ttemporary:  1\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\tsync: function(silent) {\n\n\t\t\tsilent = silent === true;\n\n\n\t\t\tlet result = false;\n\n\n\t\t\tif (this.__operations.length > 0) {\n\t\t\t\tresult = _write_storage.call(this, silent);\n\t\t\t} else {\n\t\t\t\tresult = _read_storage.call(this, silent);\n\t\t\t}\n\n\n\t\t\treturn result;\n\n\t\t},\n\n\t\tdeserialize: function(blob) {\n\n\t\t\tif (blob.objects instanceof Object) {\n\n\t\t\t\tthis.__objects = {};\n\n\t\t\t\tfor (let o in blob.objects) {\n\n\t\t\t\t\tlet object = blob.objects[o];\n\n\t\t\t\t\tif (lychee.interfaceof(this.model, object)) {\n\t\t\t\t\t\tthis.__objects[o] = object;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.Storage';\n\n\t\t\tlet settings = {};\n\t\t\tlet blob     = (data['blob'] || {});\n\n\n\t\t\tif (this.id.substr(0, 15) !== 'lychee-Storage-') settings.id    = this.id;\n\t\t\tif (Object.keys(this.model).length !== 0)        settings.model = this.model;\n\t\t\tif (this.type !== Composite.TYPE.persistent)     settings.type  = this.type;\n\n\n\t\t\tif (Object.keys(this.__objects).length > 0) {\n\n\t\t\t\tblob.objects = {};\n\n\t\t\t\tfor (let o in this.__objects) {\n\n\t\t\t\t\tlet object = this.__objects[o];\n\t\t\t\t\tif (object instanceof Object) {\n\t\t\t\t\t\tblob.objects[o] = _JSON.decode(_JSON.encode(object));\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tdata['arguments'][0] = settings;\n\t\t\tdata['blob']         = Object.keys(blob).length > 0 ? blob : null;\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcreate: function() {\n\t\t\treturn lychee.assignunlink({}, this.model);\n\t\t},\n\n\t\tfilter: function(callback, scope) {\n\n\t\t\tcallback = callback instanceof Function ? callback : null;\n\t\t\tscope    = scope !== undefined          ? scope    : this;\n\n\n\t\t\tlet filtered = [];\n\n\n\t\t\tif (callback !== null) {\n\n\t\t\t\tfor (let o in this.__objects) {\n\n\t\t\t\t\tlet object = this.__objects[o];\n\n\t\t\t\t\tif (callback.call(scope, object, o) === true) {\n\t\t\t\t\t\tfiltered.push(object);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t}\n\n\n\t\t\treturn filtered;\n\n\t\t},\n\n\t\tread: function(id) {\n\n\t\t\tid = typeof id === 'string' ? id : null;\n\n\n\t\t\tif (id !== null) {\n\n\t\t\t\tlet object = this.__objects[id] || null;\n\t\t\t\tif (object !== null) {\n\t\t\t\t\treturn object;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\t\tremove: function(id) {\n\n\t\t\tid = typeof id === 'string' ? id : null;\n\n\n\t\t\tif (id !== null) {\n\n\t\t\t\tlet object = this.__objects[id] || null;\n\t\t\t\tif (object !== null) {\n\n\t\t\t\t\tthis.__operations.push({\n\t\t\t\t\t\ttype:   'remove',\n\t\t\t\t\t\tid:     id,\n\t\t\t\t\t\tobject: object\n\t\t\t\t\t});\n\n\n\t\t\t\t\t_write_storage.call(this);\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\twrite: function(id, object) {\n\n\t\t\tid     = typeof id === 'string'                    ? id     : null;\n\t\t\tobject = lychee.diff(this.model, object) === false ? object : null;\n\n\n\t\t\tif (id !== null && object !== null) {\n\n\t\t\t\tthis.__operations.push({\n\t\t\t\t\ttype:   'update',\n\t\t\t\t\tid:     id,\n\t\t\t\t\tobject: object\n\t\t\t\t});\n\n\n\t\t\t\t_write_storage.call(this);\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetId: function(id) {\n\n\t\t\tid = typeof id === 'string' ? id : null;\n\n\n\t\t\tif (id !== null) {\n\n\t\t\t\tthis.id = id;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetModel: function(model) {\n\n\t\t\tmodel = model instanceof Object ? model : null;\n\n\n\t\t\tif (model !== null) {\n\n\t\t\t\tthis.model = _JSON.decode(_JSON.encode(model));\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetType: function(type) {\n\n\t\t\ttype = lychee.enumof(Composite.TYPE, type) ? type : null;\n\n\n\t\t\tif (type !== null) {\n\n\t\t\t\tthis.type = type;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.net.Remote":{"constructor":"lychee.Definition","arguments":["lychee.net.Remote"],"blob":{"attaches":{},"requires":["lychee.net.remote.Debugger","lychee.net.remote.Stash","lychee.net.remote.Storage"],"includes":["lychee.net.Tunnel"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Debugger = lychee.import('lychee.net.remote.Debugger');\n\tconst _Stash    = lychee.import('lychee.net.remote.Stash');\n\tconst _Storage  = lychee.import('lychee.net.remote.Storage');\n\tconst _Tunnel   = lychee.import('lychee.net.Tunnel');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({}, data);\n\n\n\t\t_Tunnel.call(this, settings);\n\n\t\tsettings = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tif (lychee.debug === true) {\n\n\t\t\tthis.bind('connect', function() {\n\t\t\t\tthis.addService(new _Debugger(this));\n\t\t\t}, this);\n\n\t\t}\n\n\n\t\tthis.bind('connect', function() {\n\n\t\t\tthis.addService(new _Stash(this));\n\t\t\tthis.addService(new _Storage(this));\n\n\t\t}, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Tunnel.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.Remote';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.net.Tunnel":{"constructor":"lychee.Definition","arguments":["lychee.net.Tunnel"],"blob":{"attaches":{},"requires":["lychee.net.socket.HTTP","lychee.net.socket.WS","lychee.codec.BENCODE","lychee.codec.BITON","lychee.codec.JSON","lychee.net.Service"],"includes":["lychee.event.Emitter"],"exports":"function (lychee, global, attachments) {\n\n\tconst _socket  = lychee.import('lychee.net.socket');\n\tconst _Emitter = lychee.import('lychee.event.Emitter');\n\tconst _Service = lychee.import('lychee.net.Service');\n\tconst _BENCODE = lychee.import('lychee.codec.BENCODE');\n\tconst _BITON   = lychee.import('lychee.codec.BITON');\n\tconst _JSON    = lychee.import('lychee.codec.JSON');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _plug_service = function(id, service) {\n\n\t\tid = typeof id === 'string' ? id : null;\n\n\t\tif (id === null || service === null) {\n\t\t\treturn;\n\t\t}\n\n\n\t\tlet found = false;\n\n\t\tfor (let w = 0, wl = this.__services.waiting.length; w < wl; w++) {\n\n\t\t\tif (this.__services.waiting[w] === service) {\n\t\t\t\tthis.__services.waiting.splice(w, 1);\n\t\t\t\tfound = true;\n\t\t\t\twl--;\n\t\t\t\tw--;\n\t\t\t}\n\n\t\t}\n\n\n\t\tif (found === true) {\n\n\t\t\tthis.__services.active.push(service);\n\n\t\t\tservice.trigger('plug');\n\n\t\t\tif (lychee.debug === true) {\n\t\t\t\tconsole.log('lychee.net.Tunnel: Remote plugged in Service (' + id + ')');\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _unplug_service = function(id, service) {\n\n\t\tid = typeof id === 'string' ? id : null;\n\n\t\tif (id === null || service === null) {\n\t\t\treturn;\n\t\t}\n\n\n\t\tlet found = false;\n\n\t\tfor (let w = 0, wl = this.__services.waiting.length; w < wl; w++) {\n\n\t\t\tif (this.__services.waiting[w] === service) {\n\t\t\t\tthis.__services.waiting.splice(w, 1);\n\t\t\t\tfound = true;\n\t\t\t\twl--;\n\t\t\t\tw--;\n\t\t\t}\n\n\t\t}\n\n\t\tfor (let a = 0, al = this.__services.active.length; a < al; a++) {\n\n\t\t\tif (this.__services.active[a] === service) {\n\t\t\t\tthis.__services.active.splice(a, 1);\n\t\t\t\tfound = true;\n\t\t\t\tal--;\n\t\t\t\ta--;\n\t\t\t}\n\n\t\t}\n\n\n\t\tif (found === true) {\n\n\t\t\tservice.trigger('unplug');\n\n\t\t\tif (lychee.debug === true) {\n\t\t\t\tconsole.log('lychee.net.Tunnel: Remote unplugged Service (' + id + ')');\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({}, data);\n\n\n\t\tthis.id        = 'localhost:1337';\n\t\tthis.codec     = lychee.interfaceof(_JSON, settings.codec) ? settings.codec : _JSON;\n\t\tthis.host      = 'localhost';\n\t\tthis.port      = 1337;\n\t\tthis.reconnect = 0;\n\t\tthis.type      = Composite.TYPE.WS;\n\n\n\t\tthis.__isConnected = false;\n\t\tthis.__socket      = null;\n\t\tthis.__services    = {\n\t\t\twaiting: [],\n\t\t\tactive:  []\n\t\t};\n\n\n\t\tthis.setHost(settings.host);\n\t\tthis.setPort(settings.port);\n\t\tthis.setReconnect(settings.reconnect);\n\t\tthis.setType(settings.type);\n\n\n\t\t_Emitter.call(this);\n\n\t\tsettings = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('connect', function() {\n\n\t\t\tthis.__isConnected = true;\n\n\t\t}, this);\n\n\t\tthis.bind('send', function(payload, headers) {\n\n\t\t\tif (this.__socket !== null) {\n\t\t\t\tthis.__socket.send(payload, headers);\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('disconnect', function() {\n\n\t\t\tthis.__isConnected = false;\n\n\n\t\t\tfor (let a = 0, al = this.__services.active.length; a < al; a++) {\n\t\t\t\tthis.__services.active[a].trigger('unplug');\n\t\t\t}\n\n\t\t\tthis.__services.active  = [];\n\t\t\tthis.__services.waiting = [];\n\n\n\t\t\tif (this.reconnect > 0) {\n\n\t\t\t\tsetTimeout(function() {\n\t\t\t\t\tthis.trigger('connect');\n\t\t\t\t}.bind(this), this.reconnect);\n\n\t\t\t}\n\n\t\t}, this);\n\n\t};\n\n\n\tComposite.TYPE = {\n\t\tWS:   0,\n\t\tHTTP: 1,\n\t\tTCP:  2\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\tdeserialize: function(blob) {\n\n\t\t\tlet socket = lychee.deserialize(blob.socket);\n\t\t\tif (socket !== null) {\n\t\t\t\tthis.__socket = socket;\n\t\t\t}\n\n\n\t\t\tif (blob.services instanceof Array) {\n\n\t\t\t\tfor (let s = 0, sl = blob.services.length; s < sl; s++) {\n\t\t\t\t\tthis.addService(lychee.deserialize(blob.services[s]));\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.Tunnel';\n\n\t\t\tlet settings = {};\n\t\t\tlet blob     = (data['blob'] || {});\n\n\n\t\t\tif (this.codec !== _JSON)            settings.codec     = lychee.serialize(this.codec);\n\t\t\tif (this.host !== 'localhost')       settings.host      = this.host;\n\t\t\tif (this.port !== 1337)              settings.port      = this.port;\n\t\t\tif (this.reconnect !== 0)            settings.reconnect = this.reconnect;\n\t\t\tif (this.type !== Composite.TYPE.WS) settings.type      = this.type;\n\n\n\t\t\tif (this.__socket !== null) blob.socket = lychee.serialize(this.__socket);\n\n\n\t\t\tif (this.__services.active.length > 0) {\n\n\t\t\t\tblob.services = [];\n\n\t\t\t\tfor (let a = 0, al = this.__services.active.length; a < al; a++) {\n\n\t\t\t\t\tlet service = this.__services.active[a];\n\n\t\t\t\t\tblob.services.push(lychee.serialize(service));\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tdata['arguments'][0] = settings;\n\t\t\tdata['blob']         = Object.keys(blob).length > 0 ? blob : null;\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tconnect: function(connection) {\n\n\t\t\tconnection = typeof connection === 'object' ? connection : null;\n\n\n\t\t\tif (this.__isConnected === false) {\n\n\t\t\t\tlet type = this.type;\n\t\t\t\tif (type === Composite.TYPE.WS) {\n\t\t\t\t\tthis.__socket = new _socket.WS();\n\t\t\t\t} else if (type === Composite.TYPE.HTTP) {\n\t\t\t\t\tthis.__socket = new _socket.HTTP();\n\t\t\t\t} else if (type === Composite.TYPE.TCP) {\n\t\t\t\t\tthis.__socket = new _socket.TCP();\n\t\t\t\t}\n\n\n\t\t\t\tthis.__socket.bind('connect', function() {\n\t\t\t\t\tthis.trigger('connect');\n\t\t\t\t}, this);\n\n\t\t\t\tthis.__socket.bind('receive', function(payload, headers) {\n\t\t\t\t\tthis.receive(payload, headers);\n\t\t\t\t}, this);\n\n\t\t\t\tthis.__socket.bind('disconnect', function() {\n\t\t\t\t\tthis.disconnect();\n\t\t\t\t}, this);\n\n\t\t\t\tthis.__socket.bind('error', function() {\n\t\t\t\t\tthis.setReconnect(0);\n\t\t\t\t\tthis.disconnect();\n\t\t\t\t}, this);\n\n\n\t\t\t\tthis.__socket.connect(this.host, this.port, connection);\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tdisconnect: function() {\n\n\t\t\tif (this.__isConnected === true) {\n\n\t\t\t\tlet socket = this.__socket;\n\t\t\t\tif (socket !== null) {\n\n\t\t\t\t\tsocket.unbind('connect');\n\t\t\t\t\tsocket.unbind('receive');\n\t\t\t\t\tsocket.unbind('disconnect');\n\t\t\t\t\tsocket.unbind('error');\n\t\t\t\t\tsocket.disconnect();\n\t\t\t\t\tthis.__socket = null;\n\n\t\t\t\t}\n\n\n\t\t\t\tthis.trigger('disconnect');\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsend: function(data, headers) {\n\n\t\t\tdata    = data instanceof Object    ? data    : null;\n\t\t\theaders = headers instanceof Object ? headers : {};\n\n\n\t\t\tif (data === null) {\n\t\t\t\treturn false;\n\t\t\t}\n\n\n\t\t\tif (typeof headers.id     === 'string') headers['@service-id']     = headers.id;\n\t\t\tif (typeof headers.event  === 'string') headers['@service-event']  = headers.event;\n\t\t\tif (typeof headers.method === 'string') headers['@service-method'] = headers.method;\n\n\n\t\t\tdelete headers.id;\n\t\t\tdelete headers.event;\n\t\t\tdelete headers.method;\n\n\n\t\t\tlet payload = null;\n\t\t\tif (data !== null) {\n\t\t\t\tpayload = this.codec.encode(data);\n\t\t\t}\n\n\n\t\t\tif (payload !== null) {\n\n\t\t\t\tthis.trigger('send', [ payload, headers ]);\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\treceive: function(payload, headers) {\n\n\t\t\tpayload = payload instanceof Buffer ? payload : null;\n\t\t\theaders = headers instanceof Object ? headers : {};\n\n\n\t\t\tlet id     = headers['@service-id']     || null;\n\t\t\tlet event  = headers['@service-event']  || null;\n\t\t\tlet method = headers['@service-method'] || null;\n\n\t\t\tlet data = null;\n\t\t\tif (payload.length === 0) {\n\t\t\t\tpayload = this.codec.encode({});\n\t\t\t}\n\n\t\t\tif (payload !== null) {\n\t\t\t\tdata = this.codec.decode(payload);\n\t\t\t}\n\n\n\t\t\tlet instance = this.getService(id);\n\t\t\tif (instance !== null && data !== null) {\n\n\t\t\t\tif (method === '@plug' || method === '@unplug') {\n\n\t\t\t\t\tif (method === '@plug') {\n\t\t\t\t\t\t_plug_service.call(this,   id, instance);\n\t\t\t\t\t} else if (method === '@unplug') {\n\t\t\t\t\t\t_unplug_service.call(this, id, instance);\n\t\t\t\t\t}\n\n\t\t\t\t} else if (method !== null) {\n\n\t\t\t\t\tif (typeof instance[method] === 'function') {\n\t\t\t\t\t\tinstance[method](data);\n\t\t\t\t\t}\n\n\t\t\t\t} else if (event !== null) {\n\n\t\t\t\t\tif (typeof instance.trigger === 'function') {\n\t\t\t\t\t\tinstance.trigger(event, [ data ]);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tthis.trigger('receive', [ data, headers ]);\n\n\t\t\t}\n\n\n\t\t\treturn true;\n\n\t\t},\n\n\t\tsetHost: function(host) {\n\n\t\t\thost = typeof host === 'string' ? host : null;\n\n\n\t\t\tif (host !== null) {\n\n\t\t\t\tthis.id   = (/:/g.test(host) ? '[' + host + ']' : host) + ':' + this.port;\n\t\t\t\tthis.host = host;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetPort: function(port) {\n\n\t\t\tport = typeof port === 'number' ? (port | 0) : null;\n\n\n\t\t\tif (port !== null) {\n\n\t\t\t\tthis.id   = (/:/g.test(this.host) ? '[' + this.host + ']' : this.host) + ':' + port;\n\t\t\t\tthis.port = port;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetReconnect: function(reconnect) {\n\n\t\t\treconnect = typeof reconnect === 'number' ? (reconnect | 0) : null;\n\n\n\t\t\tif (reconnect !== null) {\n\n\t\t\t\tthis.reconnect = reconnect;\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\taddService: function(service) {\n\n\t\t\tservice = lychee.interfaceof(_Service, service) ? service : null;\n\n\n\t\t\tif (service !== null) {\n\n\t\t\t\tlet found = false;\n\n\t\t\t\tfor (let w = 0, wl = this.__services.waiting.length; w < wl; w++) {\n\n\t\t\t\t\tif (this.__services.waiting[w] === service) {\n\t\t\t\t\t\tfound = true;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tfor (let a = 0, al = this.__services.active.length; a < al; a++) {\n\n\t\t\t\t\tif (this.__services.active[a] === service) {\n\t\t\t\t\t\tfound = true;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\tif (found === false) {\n\n\t\t\t\t\tthis.__services.waiting.push(service);\n\n\t\t\t\t\tthis.send({}, {\n\t\t\t\t\t\tid:     service.id,\n\t\t\t\t\t\tmethod: '@plug'\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tgetService: function(id) {\n\n\t\t\tid = typeof id === 'string' ? id : null;\n\n\n\t\t\tif (id !== null) {\n\n\t\t\t\tfor (let w = 0, wl = this.__services.waiting.length; w < wl; w++) {\n\n\t\t\t\t\tlet wservice = this.__services.waiting[w];\n\t\t\t\t\tif (wservice.id === id) {\n\t\t\t\t\t\treturn wservice;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tfor (let a = 0, al = this.__services.active.length; a < al; a++) {\n\n\t\t\t\t\tlet aservice = this.__services.active[a];\n\t\t\t\t\tif (aservice.id === id) {\n\t\t\t\t\t\treturn aservice;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\t\tremoveService: function(service) {\n\n\t\t\tservice = lychee.interfaceof(_Service, service) ? service : null;\n\n\n\t\t\tif (service !== null) {\n\n\t\t\t\tlet found = false;\n\n\t\t\t\tfor (let w = 0, wl = this.__services.waiting.length; w < wl; w++) {\n\n\t\t\t\t\tif (this.__services.waiting[w] === service) {\n\t\t\t\t\t\tfound = true;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tfor (let a = 0, al = this.__services.active.length; a < al; a++) {\n\n\t\t\t\t\tif (this.__services.active[a] === service) {\n\t\t\t\t\t\tfound = true;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\tif (found === true) {\n\n\t\t\t\t\tthis.send({}, {\n\t\t\t\t\t\tid:     service.id,\n\t\t\t\t\t\tmethod: '@unplug'\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tremoveServices: function() {\n\n\t\t\tthis.__services.waiting.slice(0).forEach(function(service) {\n\t\t\t\t_unplug_service.call(this, service.id, service);\n\t\t\t}.bind(this));\n\n\t\t\tthis.__services.active.slice(0).forEach(function(service) {\n\t\t\t\t_unplug_service.call(this, service.id, service);\n\t\t\t}.bind(this));\n\n\n\t\t\treturn true;\n\n\t\t},\n\n\t\tsetType: function(type) {\n\n\t\t\ttype = lychee.enumof(Composite.TYPE, type) ? type : null;\n\n\n\t\t\tif (type !== null) {\n\n\t\t\t\tlet oldtype = this.type;\n\t\t\t\tif (oldtype !== type) {\n\n\t\t\t\t\tthis.type = type;\n\n\n\t\t\t\t\tif (this.__isConnected === true) {\n\t\t\t\t\t\tthis.disconnect();\n\t\t\t\t\t\tthis.connect();\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.codec.BENCODE":{"constructor":"lychee.Definition","arguments":["lychee.codec.BENCODE"],"blob":{"attaches":{},"exports":"function (lychee, global, attachments) {\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _CHARS_DANGEROUS = /[\\u0000\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]/g;\n\tconst _CHARS_ESCAPABLE = /[\\\\\\\"\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]/g;\n\tconst _CHARS_META      = {\n\t\t'\\b': '\\\\b',\n\t\t'\\t': '\\\\t',\n\t\t'\\n': '\\\\n',\n\t\t'\\f': '\\\\f',\n\t\t'\\r': '',    // FUCK YOU, Microsoft!\n\t\t'\"':  '\\\\\"',\n\t\t'\\\\': '\\\\\\\\'\n\t};\n\n\tconst _sanitize_string = function(str) {\n\n\t\tlet san = str;\n\n\n\t\tif (_CHARS_ESCAPABLE.test(san)) {\n\n\t\t\tsan = san.replace(_CHARS_ESCAPABLE, function(char) {\n\n\t\t\t\tlet val = _CHARS_META[char];\n\t\t\t\tif (typeof val === 'string') {\n\t\t\t\t\treturn val;\n\t\t\t\t} else {\n\t\t\t\t\treturn '\\\\u' + (char.charCodeAt(0).toString(16)).slice(-4);\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t}\n\n\t\treturn san;\n\n\t};\n\n\tconst _Stream = function(buffer, mode) {\n\n\t\tthis.__buffer = typeof buffer === 'string' ? buffer : '';\n\t\tthis.__mode   = typeof mode === 'number'   ? mode   : 0;\n\n\t\tthis.__index  = 0;\n\n\t};\n\n\n\t_Stream.MODE = {\n\t\tread:  0,\n\t\twrite: 1\n\t};\n\n\n\t_Stream.prototype = {\n\n\t\ttoString: function() {\n\t\t\treturn this.__buffer;\n\t\t},\n\n\t\tpointer: function() {\n\t\t\treturn this.__index;\n\t\t},\n\n\t\tlength: function() {\n\t\t\treturn this.__buffer.length;\n\t\t},\n\n\t\tseek: function(array) {\n\n\t\t\tlet bytes = Infinity;\n\n\t\t\tfor (let a = 0, al = array.length; a < al; a++) {\n\n\t\t\t\tlet token = array[a];\n\t\t\t\tlet size  = this.__buffer.indexOf(token, this.__index + 1) - this.__index;\n\t\t\t\tif (size > -1 && size < bytes) {\n\t\t\t\t\tbytes = size;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (bytes === Infinity) {\n\t\t\t\treturn 0;\n\t\t\t}\n\n\n\t\t\treturn bytes;\n\n\t\t},\n\n\t\tseekRAW: function(bytes) {\n\t\t\treturn this.__buffer.substr(this.__index, bytes);\n\t\t},\n\n\t\treadRAW: function(bytes) {\n\n\t\t\tlet buffer = '';\n\n\t\t\tbuffer       += this.__buffer.substr(this.__index, bytes);\n\t\t\tthis.__index += bytes;\n\n\t\t\treturn buffer;\n\n\t\t},\n\n\t\twriteRAW: function(buffer) {\n\n\t\t\tthis.__buffer += buffer;\n\t\t\tthis.__index  += buffer.length;\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * ENCODER and DECODER\n\t */\n\n\tconst _encode = function(stream, data) {\n\n\t\t// bne, bfe, bte : null, false, true\n\t\tif (typeof data === 'boolean' || data === null) {\n\n\t\t\tif (data === null) {\n\t\t\t\tstream.writeRAW('bne');\n\t\t\t} else if (data === false) {\n\t\t\t\tstream.writeRAW('bfe');\n\t\t\t} else if (data === true) {\n\t\t\t\tstream.writeRAW('bte');\n\t\t\t}\n\n\n\t\t// i123e : Integer or Float (converted as Integer)\n\t\t} else if (typeof data === 'number') {\n\n\t\t\tlet hi = (data / 0x80000000) << 0;\n\t\t\tlet lo = (data % 0x80000000) << 0;\n\n\t\t\tstream.writeRAW('i');\n\t\t\tstream.writeRAW('' + (hi * 0x80000000 + lo).toString());\n\t\t\tstream.writeRAW('e');\n\n\n\t\t// <length>:<contents> : String\n\t\t} else if (typeof data === 'string') {\n\n\t\t\tdata = _sanitize_string(data);\n\n\n\t\t\tstream.writeRAW(data.length + ':' + data);\n\n\n\t\t// l<contents>e : Array\n\t\t} else if (data instanceof Array) {\n\n\t\t\tstream.writeRAW('l');\n\n\t\t\tfor (let d = 0, dl = data.length; d < dl; d++) {\n\t\t\t\t_encode(stream, data[d]);\n\t\t\t}\n\n\t\t\tstream.writeRAW('e');\n\n\n\t\t// d<contents>e : Object\n\t\t} else if (data instanceof Object && typeof data.serialize !== 'function') {\n\n\t\t\tstream.writeRAW('d');\n\n\t\t\tlet keys = Object.keys(data).sort(function(a, b) {\n\t\t\t\tif (a > b) return  1;\n\t\t\t\tif (a < b) return -1;\n\t\t\t\treturn 0;\n\t\t\t});\n\n\t\t\tfor (let k = 0, kl = keys.length; k < kl; k++) {\n\n\t\t\t\tlet key = keys[k];\n\n\t\t\t\t_encode(stream, key);\n\t\t\t\t_encode(stream, data[key]);\n\n\t\t\t}\n\n\t\t\tstream.writeRAW('e');\n\n\n\t\t// s<contents>e : Custom High-Level Implementation\n\t\t} else if (data instanceof Object && typeof data.serialize === 'function') {\n\n\t\t\tstream.writeRAW('s');\n\n\t\t\tlet blob = lychee.serialize(data);\n\n\t\t\t_encode(stream, blob);\n\n\t\t\tstream.writeRAW('e');\n\n\t\t}\n\n\t};\n\n\tconst _is_decodable_value = function(str) {\n\n\t\tlet head = str.charAt(0);\n\t\tif (/([bilds]+)/g.test(head)) {\n\t\t\treturn true;\n\t\t} else if (!isNaN(parseInt(head, 10))) {\n\t\t\treturn true;\n\t\t}\n\n\t\treturn false;\n\n\t};\n\n\tconst _decode = function(stream) {\n\n\t\tlet value  = undefined;\n\t\tlet size   = 0;\n\t\tlet tmp    = 0;\n\t\tlet errors = 0;\n\t\tlet check  = null;\n\n\n\t\tif (stream.pointer() < stream.length()) {\n\n\t\t\tlet seek = stream.seekRAW(1);\n\n\n\t\t\t// bne, bfe, bte : null, false, true\n\t\t\tif (seek === 'b') {\n\n\t\t\t\tif (stream.seekRAW(3) === 'bne') {\n\t\t\t\t\tstream.readRAW(3);\n\t\t\t\t\tvalue = null;\n\t\t\t\t} else if (stream.seekRAW(3) === 'bfe') {\n\t\t\t\t\tstream.readRAW(3);\n\t\t\t\t\tvalue = false;\n\t\t\t\t} else if (stream.seekRAW(3) === 'bte') {\n\t\t\t\t\tstream.readRAW(3);\n\t\t\t\t\tvalue = true;\n\t\t\t\t}\n\n\n\t\t\t// i123e : Integer or Float (converted as Integer)\n\t\t\t} else if (seek === 'i') {\n\n\t\t\t\tstream.readRAW(1);\n\n\t\t\t\tsize = stream.seek('e');\n\n\t\t\t\tif (size > 0) {\n\n\t\t\t\t\ttmp   = stream.readRAW(size);\n\t\t\t\t\tvalue = parseInt(tmp, 10);\n\t\t\t\t\tcheck = stream.readRAW(1);\n\n\t\t\t\t}\n\n\n\t\t\t// <length>:<contents> : String\n\t\t\t} else if (!isNaN(parseInt(seek, 10))) {\n\n\t\t\t\tsize = stream.seek(':');\n\n\t\t\t\tif (size > 0) {\n\n\t\t\t\t\tsize  = parseInt(stream.readRAW(size), 10);\n\t\t\t\t\tcheck = stream.readRAW(1);\n\n\t\t\t\t\tif (!isNaN(size) && check === ':') {\n\t\t\t\t\t\tvalue = stream.readRAW(size);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t// l<contents>e : Array\n\t\t\t} else if (seek === 'l') {\n\n\t\t\t\tvalue = [];\n\n\n\t\t\t\tstream.readRAW(1);\n\n\t\t\t\twhile (errors === 0) {\n\n\t\t\t\t\tvalue.push(_decode(stream));\n\n\t\t\t\t\tcheck = stream.seekRAW(1);\n\n\t\t\t\t\tif (check === 'e') {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t} else if (_is_decodable_value(check) === false) {\n\t\t\t\t\t\terrors++;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tstream.readRAW(1);\n\n\n\t\t\t// d<contents>e : Object\n\t\t\t} else if (seek === 'd') {\n\n\t\t\t\tvalue = {};\n\n\n\t\t\t\tstream.readRAW(1);\n\n\t\t\t\twhile (errors === 0) {\n\n\t\t\t\t\tlet object_key   = _decode(stream);\n\t\t\t\t\tlet object_value = _decode(stream);\n\n\t\t\t\t\tcheck = stream.seekRAW(1);\n\n\t\t\t\t\tvalue[object_key] = object_value;\n\n\t\t\t\t\tif (check === 'e') {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t} else if (isNaN(parseInt(check, 10))) {\n\t\t\t\t\t\terrors++;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t\tstream.readRAW(1);\n\n\n\t\t\t// s<contents>e : Custom High-Level Implementation\n\t\t\t} else if (seek === 's') {\n\n\t\t\t\tstream.readRAW(1);\n\n\t\t\t\tlet blob = _decode(stream);\n\n\t\t\t\tvalue = lychee.deserialize(blob);\n\t\t\t\tcheck = stream.readRAW(1);\n\n\t\t\t\tif (check !== 'e') {\n\t\t\t\t\tvalue = undefined;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn value;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'lychee.codec.BENCODE',\n\t\t\t\t'blob':      null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tencode: function(data) {\n\n\t\t\tdata = data instanceof Object ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet stream = new _Stream('', _Stream.MODE.write);\n\n\t\t\t\t_encode(stream, data);\n\n\t\t\t\treturn new Buffer(stream.toString(), 'utf8');\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\t\tdecode: function(data) {\n\n\t\t\tdata = data instanceof Buffer ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet stream = new _Stream(data.toString('utf8'), _Stream.MODE.read);\n\t\t\t\tlet object = _decode(stream);\n\t\t\t\tif (object !== undefined) {\n\t\t\t\t\treturn object;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"}},"lychee.codec.BITON":{"constructor":"lychee.Definition","arguments":["lychee.codec.BITON"],"blob":{"attaches":{},"exports":"function (lychee, global, attachments) {\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _CHAR_TABLE = new Array(256);\n\tconst _MASK_TABLE = new Array(9);\n\tconst _POW_TABLE  = new Array(9);\n\tconst _RPOW_TABLE = new Array(9);\n\n\t(function() {\n\n\t\tfor (let c = 0; c < 256; c++) {\n\t\t\t_CHAR_TABLE[c] = String.fromCharCode(c);\n\t\t}\n\n\t\tfor (let m = 0; m < 9; m++) {\n\t\t\t_POW_TABLE[m]  = Math.pow(2, m) - 1;\n\t\t\t_MASK_TABLE[m] = ~(_POW_TABLE[m] ^ 0xff);\n\t\t\t_RPOW_TABLE[m] = Math.pow(10, m);\n\t\t}\n\n\t})();\n\n\n\tconst _CHARS_ESCAPABLE = /[\\\\\\\"\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]/g;\n\tconst _CHARS_META      = {\n\t\t'\\b': '\\\\b',\n\t\t'\\t': '\\\\t',\n\t\t'\\n': '\\\\n',\n\t\t'\\f': '\\\\f',\n\t\t'\\r': '',    // FUCK YOU, Microsoft!\n\t\t'\"':  '\\\\\"',\n\t\t'\\\\': '\\\\\\\\'\n\t};\n\n\tconst _sanitize_string = function(str) {\n\n\t\tlet san  = str;\n\t\tlet keys = Object.keys(_CHARS_META);\n\t\tlet vals = Object.values(_CHARS_META);\n\n\n\t\tkeys.forEach(function(key, i) {\n\t\t\tsan = san.replace(key, vals[i]);\n\t\t});\n\n\n\t\tif (_CHARS_ESCAPABLE.test(san)) {\n\n\t\t\tsan = san.replace(_CHARS_ESCAPABLE, function(chr) {\n\t\t\t\treturn '\\\\u' + (chr.charCodeAt(0).toString(16)).slice(-4);\n\t\t\t});\n\n\t\t}\n\n\t\treturn san;\n\n\t};\n\n\tconst _desanitize_string = function(san) {\n\n\t\tlet str  = san;\n\t\tlet keys = Object.keys(_CHARS_META);\n\t\tlet vals = Object.values(_CHARS_META);\n\n\n\t\tvals.forEach(function(val, i) {\n\n\t\t\tif (val !== '') {\n\t\t\t\tstr = str.replace(val, keys[i]);\n\t\t\t}\n\n\t\t});\n\n\n\t\treturn str;\n\n\t};\n\n\tconst _resolve_constructor = function(identifier, scope) {\n\n\t\tlet pointer = scope;\n\n\t\tlet ns = identifier.split('.');\n\t\tfor (let n = 0, l = ns.length; n < l; n++) {\n\n\t\t\tlet name = ns[n];\n\n\t\t\tif (pointer[name] !== undefined) {\n\t\t\t\tpointer = pointer[name];\n\t\t\t} else {\n\t\t\t\tpointer = null;\n\t\t\t\tbreak;\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn pointer;\n\n\t};\n\n\n\n\tconst _Stream = function(buffer, mode) {\n\n\t\tthis.__buffer    = typeof buffer === 'string' ? buffer : '';\n\t\tthis.__mode      = typeof mode === 'number'   ? mode   : 0;\n\n\t\tthis.__pointer   = 0;\n\t\tthis.__value     = 0;\n\t\tthis.__remaining = 8;\n\t\tthis.__index     = 0;\n\n\t\tif (this.__mode === _Stream.MODE.read) {\n\t\t\tthis.__value = this.__buffer.charCodeAt(this.__index);\n\t\t}\n\n\t};\n\n\n\t_Stream.MODE = {\n\t\tread:  0,\n\t\twrite: 1\n\t};\n\n\n\t_Stream.prototype = {\n\n\t\ttoString: function() {\n\n\t\t\tif (this.__mode === _Stream.MODE.write) {\n\n\t\t\t\tif (this.__value > 0) {\n\t\t\t\t\tthis.__buffer += _CHAR_TABLE[this.__value];\n\t\t\t\t\tthis.__value   = 0;\n\t\t\t\t}\n\n\n\t\t\t\t// 0: Boolean or Null or EOS\n\t\t\t\tthis.write(0, 3);\n\t\t\t\t// 00: EOS\n\t\t\t\tthis.write(0, 2);\n\n\t\t\t}\n\n\t\t\treturn this.__buffer;\n\n\t\t},\n\n\t\tpointer: function() {\n\t\t\treturn this.__pointer;\n\t\t},\n\n\t\tlength: function() {\n\t\t\treturn this.__buffer.length * 8;\n\t\t},\n\n\t\tread: function(bits) {\n\n\t\t\tlet overflow = bits - this.__remaining;\n\t\t\tlet captured = this.__remaining < bits ? this.__remaining : bits;\n\t\t\tlet shift    = this.__remaining - captured;\n\n\n\t\t\tlet buffer = (this.__value & _MASK_TABLE[this.__remaining]) >> shift;\n\n\n\t\t\tthis.__pointer   += captured;\n\t\t\tthis.__remaining -= captured;\n\n\n\t\t\tif (this.__remaining === 0) {\n\n\t\t\t\tthis.__value     = this.__buffer.charCodeAt(++this.__index);\n\t\t\t\tthis.__remaining = 8;\n\n\t\t\t\tif (overflow > 0) {\n\t\t\t\t\tbuffer = buffer << overflow | ((this.__value & _MASK_TABLE[this.__remaining]) >> (8 - overflow));\n\t\t\t\t\tthis.__remaining -= overflow;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn buffer;\n\n\t\t},\n\n\t\treadRAW: function(bytes) {\n\n\t\t\tif (this.__remaining !== 8) {\n\n\t\t\t\tthis.__index++;\n\t\t\t\tthis.__value     = 0;\n\t\t\t\tthis.__remaining = 8;\n\n\t\t\t}\n\n\n\t\t\tlet buffer = '';\n\n\t\t\tif (this.__remaining === 8) {\n\n\t\t\t\tbuffer       += this.__buffer.substr(this.__index, bytes);\n\t\t\t\tthis.__index += bytes;\n\t\t\t\tthis.__value  = this.__buffer.charCodeAt(this.__index);\n\n\t\t\t}\n\n\n\t\t\treturn buffer;\n\n\t\t},\n\n\t\twrite: function(buffer, bits) {\n\n\t\t\tlet overflow = bits - this.__remaining;\n\t\t\tlet captured = this.__remaining < bits ? this.__remaining : bits;\n\t\t\tlet shift    = this.__remaining - captured;\n\n\n\t\t\tif (overflow > 0) {\n\t\t\t\tthis.__value += buffer >> overflow << shift;\n\t\t\t} else {\n\t\t\t\tthis.__value += buffer << shift;\n\t\t\t}\n\n\n\t\t\tthis.__pointer   += captured;\n\t\t\tthis.__remaining -= captured;\n\n\n\t\t\tif (this.__remaining === 0) {\n\n\t\t\t\tthis.__buffer    += _CHAR_TABLE[this.__value];\n\t\t\t\tthis.__remaining  = 8;\n\t\t\t\tthis.__value      = 0;\n\n\t\t\t\tif (overflow > 0) {\n\t\t\t\t\tthis.__value     += (buffer & _POW_TABLE[overflow]) << (8 - overflow);\n\t\t\t\t\tthis.__remaining -= overflow;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t},\n\n\t\twriteRAW: function(buffer) {\n\n\t\t\tif (this.__remaining !== 8) {\n\n\t\t\t\tthis.__buffer    += _CHAR_TABLE[this.__value];\n\t\t\t\tthis.__value      = 0;\n\t\t\t\tthis.__remaining  = 8;\n\n\t\t\t}\n\n\t\t\tif (this.__remaining === 8) {\n\n\t\t\t\tthis.__buffer  += buffer;\n\t\t\t\tthis.__pointer += buffer.length * 8;\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * ENCODER and DECODER\n\t */\n\n\tconst _encode = function(stream, data) {\n\n\t\t// 0: Boolean or Null or EOS\n\t\tif (typeof data === 'boolean' || data === null) {\n\n\t\t\tstream.write(0, 3);\n\n\t\t\tif (data === null) {\n\t\t\t\tstream.write(1, 2);\n\t\t\t} else if (data === false) {\n\t\t\t\tstream.write(2, 2);\n\t\t\t} else if (data === true) {\n\t\t\t\tstream.write(3, 2);\n\t\t\t}\n\n\n\t\t// 1: Integer, 2: Float\n\t\t} else if (typeof data === 'number') {\n\n\t\t\tlet type = 1;\n\t\t\tif (data < 268435456 && data !== (data | 0)) {\n\t\t\t\ttype = 2;\n\t\t\t}\n\n\n\t\t\tstream.write(type, 3);\n\n\n\t\t\t// Negative value\n\t\t\tlet sign = 0;\n\t\t\tif (data < 0) {\n\t\t\t\tdata = -data;\n\t\t\t\tsign = 1;\n\t\t\t}\n\n\n\t\t\t// Float only: Calculate the integer value and remember the shift\n\t\t\tlet shift = 0;\n\n\t\t\tif (type === 2) {\n\n\t\t\t\tlet step = 10;\n\t\t\t\tlet m    = data;\n\t\t\t\tlet tmp  = 0;\n\n\n\t\t\t\t// Calculate the exponent and shift\n\t\t\t\tdo {\n\n\t\t\t\t\tm     = data * step;\n\t\t\t\t\tstep *= 10;\n\t\t\t\t\ttmp   = m | 0;\n\t\t\t\t\tshift++;\n\n\t\t\t\t} while (m - tmp > 1 / step && shift < 8 && m < 214748364);\n\n\n\t\t\t\tstep = tmp / 10;\n\n\t\t\t\t// Recorrect shift if we are > 0.5\n\t\t\t\t// and shift is too high\n\t\t\t\tif (step === (step | 0)) {\n\t\t\t\t\ttmp = step;\n\t\t\t\t\tshift--;\n\t\t\t\t}\n\n\t\t\t\tdata = tmp;\n\n\t\t\t}\n\n\n\n\t\t\tif (data < 2) {\n\n\t\t\t\tstream.write(0, 4);\n\t\t\t\tstream.write(data, 1);\n\n\t\t\t} else if (data < 16) {\n\n\t\t\t\tstream.write(1, 4);\n\t\t\t\tstream.write(data, 4);\n\n\t\t\t} else if (data < 256) {\n\n\t\t\t\tstream.write(2, 4);\n\t\t\t\tstream.write(data, 8);\n\n\t\t\t} else if (data < 4096) {\n\n\t\t\t\tstream.write(3, 4);\n\t\t\t\tstream.write(data >>  8 & 0xff, 4);\n\t\t\t\tstream.write(data       & 0xff, 8);\n\n\t\t\t} else if (data < 65536) {\n\n\t\t\t\tstream.write(4, 4);\n\t\t\t\tstream.write(data >>  8 & 0xff, 8);\n\t\t\t\tstream.write(data       & 0xff, 8);\n\n\t\t\t} else if (data < 1048576) {\n\n\t\t\t\tstream.write(5, 4);\n\t\t\t\tstream.write(data >> 16 & 0xff, 4);\n\t\t\t\tstream.write(data >>  8 & 0xff, 8);\n\t\t\t\tstream.write(data       & 0xff, 8);\n\n\t\t\t} else if (data < 16777216) {\n\n\t\t\t\tstream.write(6, 4);\n\t\t\t\tstream.write(data >> 16 & 0xff, 8);\n\t\t\t\tstream.write(data >>  8 & 0xff, 8);\n\t\t\t\tstream.write(data       & 0xff, 8);\n\n\t\t\t} else if (data < 268435456) {\n\n\t\t\t\tstream.write(7, 4);\n\t\t\t\tstream.write(data >> 24 & 0xff, 8);\n\t\t\t\tstream.write(data >> 16 & 0xff, 8);\n\t\t\t\tstream.write(data >>  8 & 0xff, 8);\n\t\t\t\tstream.write(data       & 0xff, 8);\n\n\t\t\t} else {\n\n\t\t\t\tstream.write(8, 4);\n\n\t\t\t\t_encode(stream, data.toString());\n\n\t\t\t}\n\n\n\n\t\t\tstream.write(sign, 1);\n\n\n\t\t\t// Float only: Remember the shift for precision\n\t\t\tif (type === 2) {\n\t\t\t\tstream.write(shift, 4);\n\t\t\t}\n\n\n\t\t// 3: String\n\t\t} else if (typeof data === 'string') {\n\n\t\t\tdata = _sanitize_string(data);\n\n\n\t\t\tstream.write(3, 3);\n\n\n\t\t\tlet l = data.length;\n\n\t\t\t// Write Size Field\n\t\t\tif (l > 65535) {\n\n\t\t\t\tstream.write(31, 5);\n\n\t\t\t\tstream.write(l >> 24 & 0xff, 8);\n\t\t\t\tstream.write(l >> 16 & 0xff, 8);\n\t\t\t\tstream.write(l >>  8 & 0xff, 8);\n\t\t\t\tstream.write(l       & 0xff, 8);\n\n\t\t\t} else if (l > 255) {\n\n\t\t\t\tstream.write(30, 5);\n\n\t\t\t\tstream.write(l >>  8 & 0xff, 8);\n\t\t\t\tstream.write(l       & 0xff, 8);\n\n\t\t\t} else if (l > 28) {\n\n\t\t\t\tstream.write(29, 5);\n\n\t\t\t\tstream.write(l, 8);\n\n\t\t\t} else {\n\n\t\t\t\tstream.write(l, 5);\n\n\t\t\t}\n\n\n\t\t\tstream.writeRAW(data);\n\n\n\t\t// 4: Start of Array\n\t\t} else if (data instanceof Array) {\n\n\t\t\tstream.write(4, 3);\n\n\t\t\tfor (let d = 0, dl = data.length; d < dl; d++) {\n\t\t\t\tstream.write(0, 3);\n\t\t\t\t_encode(stream, data[d]);\n\t\t\t}\n\n\t\t\t// Write EOO marker\n\t\t\tstream.write(7, 3);\n\n\n\t\t// 5: Start of Object\n\t\t} else if (data instanceof Object && typeof data.serialize !== 'function') {\n\n\t\t\tstream.write(5, 3);\n\n\t\t\tfor (let prop in data) {\n\n\t\t\t\tif (data.hasOwnProperty(prop)) {\n\t\t\t\t\tstream.write(0, 3);\n\t\t\t\t\t_encode(stream, prop);\n\t\t\t\t\t_encode(stream, data[prop]);\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\t// Write EOO marker\n\t\t\tstream.write(7, 3);\n\n\n\t\t// 6: Custom High-Level Implementation\n\t\t} else if (data instanceof Object && typeof data.serialize === 'function') {\n\n\t\t\tstream.write(6, 3);\n\n\t\t\tlet blob = lychee.serialize(data);\n\n\t\t\t_encode(stream, blob);\n\n\t\t\t// Write EOO marker\n\t\t\tstream.write(7, 3);\n\n\t\t}\n\n\t};\n\n\tconst _decode = function(stream) {\n\n\t\tlet value  = undefined;\n\t\tlet tmp    = 0;\n\t\tlet errors = 0;\n\t\tlet check  = 0;\n\n\t\tif (stream.pointer() < stream.length()) {\n\n\t\t\tlet type = stream.read(3);\n\n\n\t\t\t// 0: Boolean or Null (or EOS)\n\t\t\tif (type === 0) {\n\n\t\t\t\ttmp = stream.read(2);\n\n\t\t\t\tif (tmp === 1) {\n\t\t\t\t\tvalue = null;\n\t\t\t\t} else if (tmp === 2) {\n\t\t\t\t\tvalue = false;\n\t\t\t\t} else if (tmp === 3) {\n\t\t\t\t\tvalue = true;\n\t\t\t\t}\n\n\n\t\t\t// 1: Integer, 2: Float\n\t\t\t} else if (type === 1 || type === 2) {\n\n\t\t\t\ttmp = stream.read(4);\n\n\n\t\t\t\tif (tmp === 0) {\n\n\t\t\t\t\tvalue = stream.read(1);\n\n\t\t\t\t} else if (tmp === 1) {\n\n\t\t\t\t\tvalue = stream.read(4);\n\n\t\t\t\t} else if (tmp === 2) {\n\n\t\t\t\t\tvalue = stream.read(8);\n\n\t\t\t\t} else if (tmp === 3) {\n\n\t\t\t\t\tvalue = (stream.read(4) <<  8) + stream.read(8);\n\n\t\t\t\t} else if (tmp === 4) {\n\n\t\t\t\t\tvalue = (stream.read(8) <<  8) + stream.read(8);\n\n\t\t\t\t} else if (tmp === 5) {\n\n\t\t\t\t\tvalue = (stream.read(4) << 16) + (stream.read(8) <<  8) + stream.read(8);\n\n\t\t\t\t} else if (tmp === 6) {\n\n\t\t\t\t\tvalue = (stream.read(8) << 16) + (stream.read(8) <<  8) + stream.read(8);\n\n\t\t\t\t} else if (tmp === 7) {\n\n\t\t\t\t\tvalue = (stream.read(8) << 24) + (stream.read(8) << 16) + (stream.read(8) <<  8) + stream.read(8);\n\n\t\t\t\t} else if (tmp === 8) {\n\n\t\t\t\t\tlet str = _decode(stream);\n\n\t\t\t\t\tvalue = parseInt(str, 10);\n\n\t\t\t\t}\n\n\n\t\t\t\t// Negative value\n\t\t\t\tlet sign = stream.read(1);\n\t\t\t\tif (sign === 1) {\n\t\t\t\t\tvalue = -1 * value;\n\t\t\t\t}\n\n\n\t\t\t\t// Float only: Shift it back by the precision\n\t\t\t\tif (type === 2) {\n\t\t\t\t\tlet shift = stream.read(4);\n\t\t\t\t\tvalue /= _RPOW_TABLE[shift];\n\t\t\t\t}\n\n\n\t\t\t// 3: String\n\t\t\t} else if (type === 3) {\n\n\t\t\t\tlet size = stream.read(5);\n\n\t\t\t\tif (size === 31) {\n\n\t\t\t\t\tsize = (stream.read(8) << 24) + (stream.read(8) << 16) + (stream.read(8) <<  8) + stream.read(8);\n\n\t\t\t\t} else if (size === 30) {\n\n\t\t\t\t\tsize = (stream.read(8) <<  8) + stream.read(8);\n\n\t\t\t\t} else if (size === 29) {\n\n\t\t\t\t\tsize = stream.read(8);\n\n\t\t\t\t}\n\n\n\t\t\t\tvalue = _desanitize_string(stream.readRAW(size));\n\n\n\t\t\t// 4: Array\n\t\t\t} else if (type === 4) {\n\n\t\t\t\tvalue = [];\n\n\n\t\t\t\twhile (errors === 0) {\n\n\t\t\t\t\tcheck = stream.read(3);\n\n\t\t\t\t\tif (check === 0) {\n\t\t\t\t\t\tvalue.push(_decode(stream));\n\t\t\t\t\t} else if (check === 7) {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t} else {\n\t\t\t\t\t\terrors++;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t// 5: Object\n\t\t\t} else if (type === 5) {\n\n\t\t\t\tvalue = {};\n\n\n\t\t\t\twhile (errors === 0) {\n\n\t\t\t\t\tcheck = stream.read(3);\n\n\t\t\t\t\tif (check === 0) {\n\t\t\t\t\t\tvalue[_decode(stream)] = _decode(stream);\n\t\t\t\t\t} else if (check === 7) {\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t} else {\n\t\t\t\t\t\terrors++;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t// 6: Custom High-Level Implementation\n\t\t\t} else if (type === 6) {\n\n\t\t\t\tlet blob = _decode(stream);\n\n\t\t\t\tvalue = lychee.deserialize(blob);\n\t\t\t\tcheck = stream.read(3);\n\n\t\t\t\tif (check !== 7) {\n\t\t\t\t\tvalue = undefined;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn value;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tconst Module = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'reference': 'lychee.codec.BITON',\n\t\t\t\t'blob':      null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tencode: function(data) {\n\n\t\t\tdata = data instanceof Object ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet stream = new _Stream('', _Stream.MODE.write);\n\n\t\t\t\t_encode(stream, data);\n\n\t\t\t\treturn new Buffer(stream.toString(), 'utf8');\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\t\tdecode: function(data) {\n\n\t\t\tdata = data instanceof Buffer ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet stream = new _Stream(data.toString('utf8'), _Stream.MODE.read);\n\t\t\t\tlet object = _decode(stream);\n\t\t\t\tif (object !== undefined) {\n\t\t\t\t\treturn object;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t}\n\n\t};\n\n\n\treturn Module;\n\n}"}},"lychee.net.Service":{"constructor":"lychee.Definition","arguments":["lychee.net.Service"],"blob":{"attaches":{},"includes":["lychee.event.Emitter"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Emitter  = lychee.import('lychee.event.Emitter');\n\tconst _SERVICES = {};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _plug_broadcast = function() {\n\n\t\tlet id = this.id;\n\t\tif (id !== null) {\n\n\t\t\tlet cache = _SERVICES[id] || null;\n\t\t\tif (cache === null) {\n\t\t\t\tcache = _SERVICES[id] = [];\n\t\t\t}\n\n\n\t\t\tlet found = false;\n\n\t\t\tfor (let c = 0, cl = cache.length; c < cl; c++) {\n\n\t\t\t\tif (cache[c] === this) {\n\t\t\t\t\tfound = true;\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (found === false) {\n\t\t\t\tcache.push(this);\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\tconst _unplug_broadcast = function() {\n\n\t\tthis.setMulticast([]);\n\n\n\t\tlet id = this.id;\n\t\tif (id !== null) {\n\n\t\t\tlet cache = _SERVICES[id] || null;\n\t\t\tif (cache !== null) {\n\n\t\t\t\tfor (let c = 0, cl = cache.length; c < cl; c++) {\n\n\t\t\t\t\tif (cache[c] === this) {\n\t\t\t\t\t\tcache.splice(c, 1);\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(id, tunnel, type) {\n\n\t\tthis.id     = typeof id === 'string'                        ? id     : null;\n\t\tthis.tunnel = lychee.interfaceof(lychee.net.Tunnel, tunnel) ? tunnel : null;\n\t\tthis.type   = lychee.enumof(Composite.TYPE, type)           ? type   : null;\n\n\t\tthis.__multicast = [];\n\n\n\t\tif (lychee.debug === true) {\n\n\t\t\tif (this.id === null) {\n\t\t\t\tconsole.error('lychee.net.Service: Invalid (string) id. It has to be kept in sync with the lychee.net.Client and lychee.net.Remote instance.');\n\t\t\t}\n\n\t\t\tif (this.tunnel === null) {\n\t\t\t\tconsole.error('lychee.net.Service: Invalid (lychee.net.Tunnel) tunnel.');\n\t\t\t}\n\n\t\t\tif (this.type === null) {\n\t\t\t\tconsole.error('lychee.net.Service: Invalid (lychee.net.Service.TYPE) type.');\n\t\t\t}\n\n\t\t}\n\n\n\t\t_Emitter.call(this);\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tif (this.type === Composite.TYPE.remote) {\n\n\t\t\tthis.bind('plug',   _plug_broadcast,   this);\n\t\t\tthis.bind('unplug', _unplug_broadcast, this);\n\n\t\t}\n\n\t};\n\n\n\tComposite.TYPE = {\n\t\t// 'default': 0, (deactivated)\n\t\t'client': 1,\n\t\t'remote': 2\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.Service';\n\n\t\t\tlet id     = null;\n\t\t\tlet tunnel = null;\n\t\t\tlet type   = null;\n\t\t\tlet blob   = (data['blob'] || {});\n\n\n\t\t\tif (this.id !== null)   id   = this.id;\n\t\t\tif (this.type !== null) type = this.type;\n\n\t\t\tif (this.type === Composite.TYPE.client) {\n\t\t\t\ttunnel = '#MAIN.client';\n\t\t\t} else {\n\t\t\t\ttunnel = null;\n\t\t\t}\n\n\n\t\t\tdata['arguments'][0] = id;\n\t\t\tdata['arguments'][1] = tunnel;\n\t\t\tdata['arguments'][2] = type;\n\t\t\tdata['blob']         = Object.keys(blob).length > 0 ? blob : null;\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * SERVICE API\n\t\t */\n\n\t\tmulticast: function(data, service) {\n\n\t\t\tdata    = data instanceof Object    ? data    : null;\n\t\t\tservice = service instanceof Object ? service : null;\n\n\n\t\t\tif (data === null) {\n\t\t\t\treturn false;\n\t\t\t}\n\n\n\t\t\tlet type = this.type;\n\t\t\tif (type === Composite.TYPE.client) {\n\n\t\t\t\tif (service === null) {\n\n\t\t\t\t\tservice = {\n\t\t\t\t\t\tid:    this.id,\n\t\t\t\t\t\tevent: 'multicast'\n\t\t\t\t\t};\n\n\t\t\t\t}\n\n\n\t\t\t\tif (this.tunnel !== null) {\n\n\t\t\t\t\tthis.tunnel.send({\n\t\t\t\t\t\tdata:    data,\n\t\t\t\t\t\tservice: service\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid:     this.id,\n\t\t\t\t\t\tmethod: 'multicast'\n\t\t\t\t\t});\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t} else if (type === Composite.TYPE.remote) {\n\n\t\t\t\tif (data.service !== null) {\n\n\t\t\t\t\tfor (let m = 0, ml = this.__multicast.length; m < ml; m++) {\n\n\t\t\t\t\t\tlet tunnel = this.__multicast[m];\n\t\t\t\t\t\tif (tunnel !== this.tunnel) {\n\n\t\t\t\t\t\t\tdata.data.tid = this.tunnel.host + ':' + this.tunnel.port;\n\n\t\t\t\t\t\t\ttunnel.send(\n\t\t\t\t\t\t\t\tdata.data,\n\t\t\t\t\t\t\t\tdata.service\n\t\t\t\t\t\t\t);\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tbroadcast: function(data, service) {\n\n\t\t\tdata    = data instanceof Object    ? data    : null;\n\t\t\tservice = service instanceof Object ? service : null;\n\n\n\t\t\tif (data === null || this.id === null) {\n\t\t\t\treturn false;\n\t\t\t}\n\n\n\t\t\tlet type = this.type;\n\t\t\tif (type === Composite.TYPE.client) {\n\n\t\t\t\tif (service === null) {\n\n\t\t\t\t\tservice = {\n\t\t\t\t\t\tid:    this.id,\n\t\t\t\t\t\tevent: 'broadcast'\n\t\t\t\t\t};\n\n\t\t\t\t}\n\n\n\t\t\t\tif (this.tunnel !== null) {\n\n\t\t\t\t\tthis.tunnel.send({\n\t\t\t\t\t\tdata:    data,\n\t\t\t\t\t\tservice: service\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid:     this.id,\n\t\t\t\t\t\tmethod: 'broadcast'\n\t\t\t\t\t});\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t} else if (type === Composite.TYPE.remote) {\n\n\t\t\t\t// XXX: Allow method calls from remote side\n\t\t\t\tif (data !== null && service !== null) {\n\n\t\t\t\t\tdata = {\n\t\t\t\t\t\tdata:    data,\n\t\t\t\t\t\tservice: service\n\t\t\t\t\t};\n\n\t\t\t\t}\n\n\n\t\t\t\tif (data.service !== null) {\n\n\t\t\t\t\tlet broadcast = _SERVICES[this.id] || null;\n\t\t\t\t\tif (broadcast !== null) {\n\n\t\t\t\t\t\tfor (let b = 0, bl = broadcast.length; b < bl; b++) {\n\n\t\t\t\t\t\t\tlet tunnel = broadcast[b].tunnel;\n\t\t\t\t\t\t\tif (tunnel !== this.tunnel) {\n\n\t\t\t\t\t\t\t\tdata.data.tid = this.tunnel.host + ':' + this.tunnel.port;\n\n\t\t\t\t\t\t\t\ttunnel.send(\n\t\t\t\t\t\t\t\t\tdata.data,\n\t\t\t\t\t\t\t\t\tdata.service\n\t\t\t\t\t\t\t\t);\n\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\treturn true;\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\taccept: function(message, blob) {\n\n\t\t\tmessage = typeof message === 'string' ? message : null;\n\t\t\tblob    = blob instanceof Object      ? blob    : null;\n\n\n\t\t\tif (message !== null) {\n\n\t\t\t\tlet tunnel = this.tunnel;\n\t\t\t\tif (tunnel !== null) {\n\n\t\t\t\t\ttunnel.send({\n\t\t\t\t\t\tmessage: message,\n\t\t\t\t\t\tblob:    blob\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid:    this.id,\n\t\t\t\t\t\tevent: 'success'\n\t\t\t\t\t});\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\treject: function(message, blob) {\n\n\t\t\tmessage = typeof message === 'string' ? message : null;\n\t\t\tblob    = blob instanceof Object      ? blob    : null;\n\n\n\t\t\tif (message !== null) {\n\n\t\t\t\tlet tunnel = this.tunnel;\n\t\t\t\tif (tunnel !== null) {\n\n\t\t\t\t\ttunnel.send({\n\t\t\t\t\t\tmessage: message,\n\t\t\t\t\t\tblob:    blob\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid:    this.id,\n\t\t\t\t\t\tevent: 'error'\n\t\t\t\t\t});\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsetMulticast: function(multicast) {\n\n\t\t\tmulticast = multicast instanceof Array ? multicast : null;\n\n\n\t\t\tif (multicast !== null) {\n\n\t\t\t\tthis.__multicast = multicast.filter(function(instance) {\n\t\t\t\t\treturn lychee.interfaceof(lychee.net.Tunnel, instance);\n\t\t\t\t});\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.data.Package":{"constructor":"lychee.Definition","arguments":["harvester.data.Package"],"blob":{"attaches":{},"exports":"function (lychee, global, attachments) {\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _parse_buffer = function() {\n\n\t\tlet json = null;\n\n\t\ttry {\n\t\t\tjson = JSON.parse(this.buffer.toString('utf8'));\n\t\t} catch (err) {\n\t\t}\n\n\n\t\tif (json instanceof Object) {\n\n\t\t\tif (json.api instanceof Object) {\n\n\t\t\t\tif (json.api.files instanceof Object) {\n\t\t\t\t\t_walk_directory(this.api, json.api.files, '');\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tjson.api = {\n\t\t\t\t\tfiles: {}\n\t\t\t\t};\n\n\t\t\t}\n\n\n\t\t\tif (json.build instanceof Object) {\n\n\t\t\t\tif (json.build.files instanceof Object) {\n\t\t\t\t\t_walk_directory(this.build, json.build.files, '');\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tjson.build = {\n\t\t\t\t\tenvironments: {},\n\t\t\t\t\tfiles:        {}\n\t\t\t\t};\n\n\t\t\t}\n\n\n\t\t\tif (json.source instanceof Object) {\n\n\t\t\t\tif (json.source.files instanceof Object) {\n\t\t\t\t\t_walk_directory(this.source, json.source.files, '');\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tjson.source = {\n\t\t\t\t\tenvironments: {},\n\t\t\t\t\tfiles:        {},\n\t\t\t\t\ttags:         {}\n\t\t\t\t};\n\n\t\t\t}\n\n\n\t\t\tthis.json = json;\n\n\t\t}\n\n\t};\n\n\tconst _walk_directory = function(files, node, path) {\n\n\t\tif (node instanceof Array) {\n\n\t\t\tnode.forEach(function(ext) {\n\n\t\t\t\tif (/(msc|snd)$/.test(ext)) {\n\n\t\t\t\t\tif (files.indexOf(path + '.' + ext) === -1) {\n\t\t\t\t\t\tfiles.push(path + '.' + ext);\n\t\t\t\t\t}\n\n\t\t\t\t} else if (/(js|json|fnt|png)$/.test(ext)) {\n\n\t\t\t\t\tif (files.indexOf(path + '.' + ext) === -1) {\n\t\t\t\t\t\tfiles.push(path + '.' + ext);\n\t\t\t\t\t}\n\n\t\t\t\t} else if (/(md|tpl)$/.test(ext)) {\n\n\t\t\t\t\tif (files.indexOf(path + '.' + ext) === -1) {\n\t\t\t\t\t\tfiles.push(path + '.' + ext);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t} else if (node instanceof Object) {\n\n\t\t\tObject.keys(node).forEach(function(child) {\n\t\t\t\t_walk_directory(files, node[child], path + '/' + child);\n\t\t\t});\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({}, data);\n\n\n\t\tthis.buffer = null;\n\n\t\tthis.api    = [];\n\t\tthis.build  = [];\n\t\tthis.source = [];\n\t\tthis.json   = {};\n\n\n\t\tthis.setBuffer(settings.buffer);\n\n\t\tsettings = null;\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\tdeserialize: function(blob) {\n\n\t\t\tlet buffer = lychee.deserialize(blob.buffer);\n\t\t\tif (buffer !== null) {\n\t\t\t\tthis.setBuffer(buffer);\n\t\t\t}\n\n\t\t},\n\n\t\tserialize: function() {\n\n\t\t\tlet blob = {};\n\n\n\t\t\tif (this.buffer !== null) blob.buffer = lychee.serialize(this.buffer);\n\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'harvester.data.Package',\n\t\t\t\t'arguments':   [ null ],\n\t\t\t\t'blob':        Object.keys(blob).length > 0 ? blob : null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsetBuffer: function(buffer) {\n\n\t\t\tbuffer = buffer instanceof Buffer ? buffer : null;\n\n\n\t\t\tif (buffer !== null) {\n\n\t\t\t\tthis.buffer = buffer;\n\t\t\t\t_parse_buffer.call(this);\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.data.Server":{"constructor":"lychee.Definition","arguments":["harvester.data.Server"],"blob":{"attaches":{},"exports":"function (lychee, global, attachments) {\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({}, data);\n\n\n\t\tthis.host = typeof settings.host === 'string' ? settings.host : null;\n\t\tthis.port = typeof settings.port === 'number' ? settings.port : null;\n\n\t\tthis.__process = settings.process || null;\n\n\n\t\tsettings = null;\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet settings = {};\n\n\n\t\t\tif (this.host !== null) settings.host = this.host;\n\t\t\tif (this.port !== null) settings.port = this.port;\n\n\n\t\t\t// XXX: native process instance can't be serialized :(\n\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'harvester.data.Server',\n\t\t\t\t'arguments':   [ settings ]\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tdestroy: function() {\n\n\t\t\tif (this.__process !== null) {\n\n\t\t\t\tthis.__process.destroy();\n\t\t\t\tthis.__process = null;\n\n\t\t\t}\n\n\n\t\t\tthis.host = null;\n\t\t\tthis.port = null;\n\n\n\t\t\treturn true;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.data.Git":{"constructor":"lychee.Definition","arguments":["harvester.data.Git"],"blob":{"attaches":{},"tags":{"platform":"node"},"requires":["harvester.data.Filesystem"],"supports":"function (lychee, global) {\n\n\ttry {\n\n\t\trequire('child_process');\n\t\trequire('path');\n\n\t\treturn true;\n\n\t} catch (err) {\n\t}\n\n\n\treturn false;\n\n}","exports":"function (lychee, global, attachments) {\n\n\tconst _ROOT          = lychee.ROOT.lychee;\n\tconst _Filesystem    = lychee.import('harvester.data.Filesystem');\n\tconst _child_process = require('child_process');\n\tconst _path          = require('path');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _parse_remotes = function(content) {\n\n\t\tlet remotes = {};\n\t\tlet pointer = null;\n\n\t\tcontent.split('\\n').map(function(line) {\n\n\t\t\tif (line.startsWith('[remote')) {\n\n\t\t\t\tlet tmp = line.split('\"')[1] || null;\n\t\t\t\tif (tmp !== null) {\n\n\t\t\t\t\tpointer = remotes[tmp] = {\n\t\t\t\t\t\turl:   null,\n\t\t\t\t\t\tfetch: null\n\t\t\t\t\t};\n\n\t\t\t\t} else {\n\n\t\t\t\t\tpointer = null;\n\n\t\t\t\t}\n\n\t\t\t} else if (pointer !== null) {\n\n\t\t\t\tlet tmp = line.trim().split('=').map(function(val) {\n\t\t\t\t\treturn val.trim();\n\t\t\t\t});\n\n\t\t\t\tif (tmp[0] === 'url') {\n\t\t\t\t\tpointer.url = tmp[1];\n\t\t\t\t} else if (tmp[0] === 'fetch') {\n\t\t\t\t\tpointer.fetch = tmp[1];\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t});\n\n\n\t\treturn remotes;\n\n\t};\n\n\tconst _parse_log = function(content) {\n\n\t\treturn content.split('\\n').map(function(line) {\n\t\t\treturn line.substr(line.indexOf(' ') + 1).trim();\n\t\t}).filter(function(line) {\n\t\t\treturn line !== '';\n\t\t}).map(function(line) {\n\n\t\t\tlet hash = line.substr(0, line.indexOf(' '));\n\t\t\tline = line.substr(hash.length + 1);\n\n\t\t\tlet name = line.substr(0, line.indexOf('<') - 1);\n\t\t\tline = line.substr(name.length + 1);\n\n\t\t\tlet email = line.substr(1, line.indexOf('>') - 1);\n\t\t\tline = line.substr(email.length + 3);\n\n\t\t\tlet timestamp = line.substr(0, line.indexOf('\\t'));\n\t\t\tline = line.substr(timestamp.length + 1);\n\n\t\t\tlet message = line.trim();\n\n\n\t\t\treturn {\n\t\t\t\thash:      hash,\n\t\t\t\tname:      name,\n\t\t\t\temail:     email,\n\t\t\t\ttimestamp: timestamp,\n\t\t\t\tmessage:   message\n\t\t\t};\n\n\t\t});\n\n\t};\n\n\tconst _get_log = function() {\n\n\t\tlet development = _parse_log((this.filesystem.read('/logs/refs/remotes/origin/development') || '').toString('utf8'));\n\t\tlet master      = _parse_log((this.filesystem.read('/logs/refs/remotes/origin/master')      || '').toString('utf8'));\n\t\tlet branch      = _parse_log((this.filesystem.read('/logs/HEAD')                            || '').toString('utf8'));\n\t\tlet diff        = branch.filter(function(commit) {\n\n\t\t\tlet is_master = master.find(function(other) {\n\t\t\t\treturn other.hash === commit.hash;\n\t\t\t});\n\t\t\tlet is_development = development.find(function(other) {\n\t\t\t\treturn other.hash === commit.hash;\n\t\t\t});\n\n\t\t\tif (is_master === false && is_development === false) {\n\t\t\t\treturn true;\n\t\t\t}\n\n\t\t\treturn false;\n\n\t\t});\n\n\n\t\treturn {\n\t\t\tmaster:      master,\n\t\t\tdevelopment: development,\n\t\t\tbranch:      branch,\n\t\t\tdiff:        diff\n\t\t};\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({}, data);\n\n\n\t\tthis.identifier = typeof settings.identifier === 'string' ? settings.identifier : '';\n\t\tthis.filesystem = new _Filesystem({\n\t\t\troot: this.identifier + '/.git'\n\t\t});\n\n\n\t\tsettings = null;\n\n\t};\n\n\n\tComposite.STATUS = {\n\t\tignore: 0,\n\t\tupdate: 1,\n\t\tmanual: 2\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet blob = {};\n\n\n\t\t\tif (this.filesystem !== null) blob.filesystem = lychee.serialize(this.filesystem);\n\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'harvester.data.Git',\n\t\t\t\t'arguments':   [ this.identifier ],\n\t\t\t\t'blob':        Object.keys(blob).length > 0 ? blob : null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tcheckout: function(branch, path) {\n\n\t\t\tbranch = typeof branch === 'string' ? branch : null;\n\t\t\tpath   = typeof path === 'string'   ? path   : null;\n\n\n\t\t\tif (branch !== null && path !== null) {\n\n\t\t\t\tlet filesystem = this.filesystem;\n\t\t\t\tlet result     = null;\n\n\t\t\t\ttry {\n\n\t\t\t\t\tlet cwd  = _ROOT;\n\t\t\t\t\tlet root = _ROOT + path;\n\n\t\t\t\t\tlet tmp = filesystem.root.split('/');\n\t\t\t\t\tif (tmp.pop() === '.git') {\n\t\t\t\t\t\tcwd = tmp.join('/');\n\t\t\t\t\t}\n\n\t\t\t\t\tlet real = _path.relative(cwd, root);\n\t\t\t\t\tif (real.substr(0, 2) !== '..') {\n\n\t\t\t\t\t\tlet handle = _child_process.spawnSync('git', [\n\t\t\t\t\t\t\t'checkout',\n\t\t\t\t\t\t\t'--quiet',\n\t\t\t\t\t\t\t'origin/' + branch,\n\t\t\t\t\t\t\t'./' + real\n\t\t\t\t\t\t], {\n\t\t\t\t\t\t\tcwd: cwd\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\tlet stdout = (handle.stdout || '').toString().trim();\n\t\t\t\t\t\tlet stderr = (handle.stderr || '').toString().trim();\n\t\t\t\t\t\tif (stderr !== '') {\n\t\t\t\t\t\t\tresult = null;\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tresult = stdout;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t} catch (err) {\n\n\t\t\t\t\tconsole.error(err.message);\n\n\t\t\t\t\tresult = null;\n\n\t\t\t\t}\n\n\t\t\t\treturn result !== null;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tdiff: function(path) {\n\n\t\t\tpath = typeof path === 'string' ? path : null;\n\n\n\t\t\tif (path !== null) {\n\n\t\t\t\tlet filesystem = this.filesystem;\n\t\t\t\tlet result     = null;\n\n\t\t\t\ttry {\n\n\t\t\t\t\tlet root = _ROOT;\n\t\t\t\t\tlet tmp  = filesystem.root.split('/');\n\t\t\t\t\tif (tmp.pop() === '.git') {\n\t\t\t\t\t\troot = tmp.join('/');\n\t\t\t\t\t}\n\n\t\t\t\t\tresult = _child_process.execSync('git diff HEAD .' + path, {\n\t\t\t\t\t\tcwd: root\n\t\t\t\t\t}).toString() || null;\n\n\t\t\t\t} catch (err) {\n\n\t\t\t\t\tresult = null;\n\n\t\t\t\t}\n\n\t\t\t\treturn result;\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\t\tfetch: function(branch) {\n\n\t\t\tbranch = typeof branch === 'string' ? branch : null;\n\n\n\t\t\tif (branch !== null) {\n\n\t\t\t\tlet filesystem = this.filesystem;\n\t\t\t\tlet result     = null;\n\n\t\t\t\ttry {\n\n\t\t\t\t\tlet cwd = _ROOT;\n\t\t\t\t\tlet tmp = filesystem.root.split('/');\n\t\t\t\t\tif (tmp.pop() === '.git') {\n\t\t\t\t\t\tcwd = tmp.join('/');\n\t\t\t\t\t}\n\n\t\t\t\t\tresult = _child_process.execSync('git fetch --quiet origin \"' + branch + '\"', {\n\t\t\t\t\t\tcwd: cwd\n\t\t\t\t\t}).toString();\n\n\t\t\t\t} catch (err) {\n\n\t\t\t\t\tresult = null;\n\n\t\t\t\t}\n\n\t\t\t\treturn result !== null;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tconfig: function() {\n\n\t\t\tlet config  = (this.filesystem.read('/config') || '').toString().trim();\n\t\t\tlet remotes = _parse_remotes(config);\n\n\n\t\t\treturn {\n\t\t\t\tremotes: remotes\n\t\t\t};\n\n\t\t},\n\n\t\treport: function(path) {\n\n\t\t\tpath = typeof path === 'string' ? path : null;\n\n\n\t\t\tlet head       = (this.filesystem.read('/HEAD')       || '').toString().trim();\n\t\t\tlet fetch_head = (this.filesystem.read('/FETCH_HEAD') || '').toString().trim();\n\t\t\tlet orig_head  = (this.filesystem.read('/ORIG_HEAD')  || '').toString().trim();\n\t\t\tlet branch     = 'master';\n\n\n\t\t\tif (head.startsWith('ref: ')) {\n\n\t\t\t\tif (head.startsWith('ref: refs/heads/')) {\n\t\t\t\t\tbranch = head.substr(16).trim();\n\t\t\t\t}\n\n\t\t\t\tlet ref = this.filesystem.read('/' + head.substr(5));\n\t\t\t\tif (ref !== null) {\n\t\t\t\t\thead = ref.toString().trim();\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif (fetch_head.includes('\\t')) {\n\t\t\t\tfetch_head = fetch_head.split('\\t')[0];\n\t\t\t}\n\n\n\t\t\tlet log    = _get_log.call(this);\n\t\t\tlet status = Composite.STATUS.manual;\n\n\t\t\tif (log.diff.length === 0) {\n\n\t\t\t\tif (head === fetch_head) {\n\n\t\t\t\t\tstatus = Composite.STATUS.ignore;\n\n\t\t\t\t} else {\n\n\t\t\t\t\tlet check = log.development.find(function(other) {\n\t\t\t\t\t\treturn other.hash === head;\n\t\t\t\t\t});\n\n\t\t\t\t\tif (check !== undefined) {\n\t\t\t\t\t\tstatus = Composite.STATUS.update;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tstatus = Composite.STATUS.manual;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\n\t\t\t\t// XXX: Verify that user did not break their git history\n\t\t\t\tif (fetch_head !== orig_head) {\n\n\t\t\t\t\tlet check = log.development.find(function(other) {\n\t\t\t\t\t\treturn other.hash === orig_head;\n\t\t\t\t\t});\n\n\t\t\t\t\tif (check !== undefined) {\n\t\t\t\t\t\tstatus = Composite.STATUS.update;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tstatus = Composite.STATUS.manual;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tstatus = Composite.STATUS.manual;\n\n\t\t\t}\n\n\n\t\t\tif (path !== null) {\n\n\t\t\t\tlet diff = this.diff(path);\n\t\t\t\tif (diff !== null) {\n\t\t\t\t\tstatus = Composite.STATUS.manual;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn {\n\t\t\t\tbranch: branch,\n\t\t\t\tstatus: status,\n\t\t\t\thead: {\n\t\t\t\t\tbranch: head,\n\t\t\t\t\tfetch:  fetch_head,\n\t\t\t\t\torigin: orig_head\n\t\t\t\t},\n\t\t\t\tlog: log\n\t\t\t};\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.net.Client":{"constructor":"lychee.Definition","arguments":["harvester.net.Client"],"blob":{"attaches":{},"requires":["harvester.net.client.Console","harvester.net.client.Harvester","harvester.net.client.Library","harvester.net.client.Profile","harvester.net.client.Project","lychee.codec.BENCODE","lychee.codec.BITON","lychee.codec.JSON","lychee.net.Client"],"includes":["lychee.net.Tunnel"],"exports":"function (lychee, global, attachments) {\n\n\tconst _client  = lychee.import('harvester.net.client');\n\tconst _Client  = lychee.import('lychee.net.Client');\n\tconst _Tunnel  = lychee.import('lychee.net.Tunnel');\n\tconst _BENCODE = lychee.import('lychee.codec.BENCODE');\n\tconst _BITON   = lychee.import('lychee.codec.BITON');\n\tconst _JSON    = lychee.import('lychee.codec.JSON');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({\n\t\t\thost:      'localhost',\n\t\t\tport:      4848,\n\t\t\tcodec:     _JSON,\n\t\t\ttype:      _Client.TYPE.HTTP,\n\t\t\treconnect: 10000\n\t\t}, data);\n\n\n\t\t_Tunnel.call(this, settings);\n\n\t\tsettings = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('connect', function() {\n\n\t\t\tthis.addService(new _client.Console(this));\n\t\t\tthis.addService(new _client.Harvester(this));\n\t\t\tthis.addService(new _client.Library(this));\n\t\t\tthis.addService(new _client.Profile(this));\n\t\t\tthis.addService(new _client.Project(this));\n\n\n\t\t\tif (lychee.debug === true) {\n\t\t\t\tconsole.log('harvester.net.Client: Remote connected');\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('disconnect', function(code) {\n\n\t\t\tif (lychee.debug === true) {\n\t\t\t\tconsole.log('harvester.net.Client: Remote disconnected (' + code + ')');\n\t\t\t}\n\n\t\t}, this);\n\n\n\t\tthis.connect();\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Tunnel.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.Client';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsend: function(data, headers) {\n\n\t\t\t// XXX: data can be Object, Buffer or String\n\n\t\t\tdata    = data !== undefined        ? data    : null;\n\t\t\theaders = headers instanceof Object ? headers : {};\n\n\n\t\t\tif (data instanceof Object) {\n\n\t\t\t\tlet codec = this.codec;\n\t\t\t\tif (codec === _BENCODE) {\n\t\t\t\t\theaders['content-type'] = 'application/bencode; charset=utf-8';\n\t\t\t\t} else if (codec === _BITON) {\n\t\t\t\t\theaders['content-type'] = 'application/biton; charset=binary';\n\t\t\t\t} else if (codec === _JSON) {\n\t\t\t\t\theaders['content-type'] = 'application/json; charset=utf-8';\n\t\t\t\t}\n\n\n\t\t\t\tif (/@plug|@unplug/g.test(headers.method) === false) {\n\t\t\t\t\treturn _Tunnel.prototype.send.call(this, data, headers);\n\t\t\t\t}\n\n\t\t\t} else {\n\n\t\t\t\tlet payload = null;\n\n\t\t\t\tif (typeof data === 'string') {\n\t\t\t\t\tpayload = new Buffer(data, 'utf8');\n\t\t\t\t} else if (data instanceof Buffer) {\n\t\t\t\t\tpayload = data;\n\t\t\t\t}\n\n\n\t\t\t\tif (payload instanceof Buffer) {\n\n\t\t\t\t\tthis.trigger('send', [ payload, headers ]);\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.net.remote.Debugger":{"constructor":"lychee.Definition","arguments":["lychee.net.remote.Debugger"],"blob":{"attaches":{},"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\tconst _TUNNELS = [];\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _bind_console = function(event) {\n\n\t\tthis.bind(event, function(data) {\n\n\t\t\tif (this.tunnel !== null) {\n\n\t\t\t\tlet receiver = data.tid || null;\n\t\t\t\tif (receiver !== null) {\n\n\t\t\t\t\tlet tunnel = _TUNNELS.find(function(client) {\n\t\t\t\t\t\treturn (client.host + ':' + client.port) === receiver;\n\t\t\t\t\t}) || null;\n\n\t\t\t\t\tif (tunnel !== null) {\n\n\t\t\t\t\t\ttunnel.send(data, {\n\t\t\t\t\t\t\tid:    'debugger',\n\t\t\t\t\t\t\tevent: 'console'\n\t\t\t\t\t\t});\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, this);\n\n\t};\n\n\tconst _bind_relay = function(event) {\n\n\t\tthis.bind(event, function(data) {\n\n\t\t\tlet sender   = null;\n\t\t\tlet receiver = data.tid || null;\n\n\t\t\tif (this.tunnel !== null) {\n\t\t\t\tsender = this.tunnel.host + ':' + this.tunnel.port;\n\t\t\t}\n\n\n\t\t\tif (sender !== null && receiver !== null) {\n\n\t\t\t\tlet tunnel = _TUNNELS.find(function(client) {\n\t\t\t\t\treturn (client.host + ':' + client.port) === receiver;\n\t\t\t\t}) || null;\n\n\t\t\t\tif (tunnel !== null) {\n\n\t\t\t\t\tdata.receiver = sender;\n\n\t\t\t\t\ttunnel.send(data, {\n\t\t\t\t\t\tid:    'debugger',\n\t\t\t\t\t\tevent: event\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, this);\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(remote) {\n\n\t\t_Service.call(this, 'debugger', remote, _Service.TYPE.remote);\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('plug', function() {\n\n\t\t\t_TUNNELS.push(this.tunnel);\n\n\t\t}, this);\n\n\t\tthis.bind('unplug', function() {\n\n\t\t\tlet index = _TUNNELS.indexOf(this.tunnel);\n\t\t\tif (index !== -1) {\n\t\t\t\t_TUNNELS.splice(index, 1);\n\t\t\t}\n\n\t\t}, this);\n\n\n\t\t// Relay events to proper tunnel (data.tid)\n\t\t_bind_relay.call(this, 'define');\n\t\t_bind_relay.call(this, 'execute');\n\t\t_bind_relay.call(this, 'expose');\n\t\t_bind_relay.call(this, 'snapshot');\n\n\t\t// Relay events to proper tunnel (data.receiver > data.tid)\n\t\t_bind_console.call(this, 'define-value');\n\t\t_bind_console.call(this, 'execute-value');\n\t\t_bind_console.call(this, 'expose-value');\n\t\t_bind_console.call(this, 'snapshot-value');\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.remote.Debugger';\n\t\t\tdata['arguments']   = [];\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.net.remote.Stash":{"constructor":"lychee.Definition","arguments":["lychee.net.remote.Stash"],"blob":{"attaches":{},"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(remote) {\n\n\t\t_Service.call(this, 'stash', remote, _Service.TYPE.remote);\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('sync', function(data) {\n\n\t\t\tthis.broadcast(data, {\n\t\t\t\tid:    this.id,\n\t\t\t\tevent: 'sync'\n\t\t\t});\n\n\t\t}, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.remote.Stash';\n\t\t\tdata['arguments']   = [];\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsync: function(assets) {\n\n\t\t\tassets = assets instanceof Object ? assets : null;\n\n\n\t\t\tif (assets !== null && this.tunnel !== null) {\n\n\t\t\t\tlet data = {};\n\n\t\t\t\tfor (let id in assets) {\n\t\t\t\t\tdata[id] = lychee.serialize(assets[id]);\n\t\t\t\t}\n\n\n\t\t\t\tthis.tunnel.send({\n\t\t\t\t\ttimestamp: Date.now(),\n\t\t\t\t\tassets:    data\n\t\t\t\t}, {\n\t\t\t\t\tid:    'stash',\n\t\t\t\t\tevent: 'sync'\n\t\t\t\t});\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.net.remote.Storage":{"constructor":"lychee.Definition","arguments":["lychee.net.remote.Storage"],"blob":{"attaches":{},"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(remote) {\n\n\t\t_Service.call(this, 'storage', remote, _Service.TYPE.remote);\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('sync', function(data) {\n\n\t\t\tthis.broadcast(data, {\n\t\t\t\tid:    this.id,\n\t\t\t\tevent: 'sync'\n\t\t\t});\n\n\t\t}, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.remote.Storage';\n\t\t\tdata['arguments']   = [];\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsync: function(objects) {\n\n\t\t\tobjects = objects instanceof Array ? objects : null;\n\n\n\t\t\tif (objects !== null && this.tunnel !== null) {\n\n\t\t\t\tthis.tunnel.send({\n\t\t\t\t\ttimestamp: Date.now(),\n\t\t\t\t\tobjects:   objects\n\t\t\t\t}, {\n\t\t\t\t\tid:    'storage',\n\t\t\t\t\tevent: 'sync'\n\t\t\t\t});\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.net.socket.HTTP":{"constructor":"lychee.Definition","arguments":["lychee.net.socket.HTTP"],"blob":{"attaches":{},"tags":{"platform":"node"},"requires":["lychee.net.protocol.HTTP"],"includes":["lychee.event.Emitter"],"supports":"function (lychee, global) {\n\n\tif (typeof global.require === 'function') {\n\n\t\ttry {\n\n\t\t\tglobal.require('net');\n\n\t\t\treturn true;\n\n\t\t} catch (err) {\n\t\t}\n\n\t}\n\n\n\treturn false;\n\n}","exports":"function (lychee, global, attachments) {\n\n\tconst _net      = global.require('net');\n\tconst _Emitter  = lychee.import('lychee.event.Emitter');\n\tconst _Protocol = lychee.import('lychee.net.protocol.HTTP');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _connect_socket = function(socket, protocol) {\n\n\t\tlet that = this;\n\t\tif (that.__connection !== socket) {\n\n\t\t\tsocket.on('data', function(blob) {\n\n\t\t\t\tlet chunks = protocol.receive(blob);\n\t\t\t\tif (chunks.length > 0) {\n\n\t\t\t\t\tfor (let c = 0, cl = chunks.length; c < cl; c++) {\n\t\t\t\t\t\tthat.trigger('receive', [ chunks[c].payload, chunks[c].headers ]);\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t\tsocket.on('error', function(err) {\n\t\t\t\tthat.trigger('error');\n\t\t\t\tthat.disconnect();\n\t\t\t});\n\n\t\t\tsocket.on('timeout', function() {\n\t\t\t\tthat.trigger('error');\n\t\t\t\tthat.disconnect();\n\t\t\t});\n\n\t\t\tsocket.on('close', function() {\n\t\t\t\tthat.disconnect();\n\t\t\t});\n\n\t\t\tsocket.on('end', function() {\n\t\t\t\tthat.disconnect();\n\t\t\t});\n\n\n\t\t\tthat.__connection = socket;\n\t\t\tthat.__protocol   = protocol;\n\n\t\t\tthat.trigger('connect');\n\n\t\t}\n\n\t};\n\n\tconst _disconnect_socket = function(socket, protocol) {\n\n\t\tlet that = this;\n\t\tif (that.__connection === socket) {\n\n\t\t\tsocket.removeAllListeners('data');\n\t\t\tsocket.removeAllListeners('error');\n\t\t\tsocket.removeAllListeners('timeout');\n\t\t\tsocket.removeAllListeners('close');\n\t\t\tsocket.removeAllListeners('end');\n\n\t\t\tsocket.destroy();\n\t\t\tprotocol.close();\n\n\n\t\t\tthat.__connection = null;\n\t\t\tthat.__protocol   = null;\n\n\t\t\tthat.trigger('disconnect');\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function() {\n\n\t\tthis.__connection = null;\n\t\tthis.__protocol   = null;\n\n\n\t\t_Emitter.call(this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.socket.HTTP';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tconnect: function(host, port, connection) {\n\n\t\t\thost       = typeof host === 'string'       ? host       : null;\n\t\t\tport       = typeof port === 'number'       ? (port | 0) : null;\n\t\t\tconnection = typeof connection === 'object' ? connection : null;\n\n\n\t\t\tlet that     = this;\n\t\t\t// let url      = /:/g.test(host) ? ('http://[' + host + ']:' + port) : ('http://' + host + ':' + port);\n\t\t\tlet protocol = null;\n\n\n\t\t\tif (host !== null && port !== null) {\n\n\t\t\t\tif (connection !== null) {\n\n\t\t\t\t\tprotocol = new _Protocol({\n\t\t\t\t\t\ttype: _Protocol.TYPE.remote\n\t\t\t\t\t});\n\n\t\t\t\t\tconnection.allowHalfOpen = true;\n\t\t\t\t\tconnection.setTimeout(0);\n\t\t\t\t\tconnection.setNoDelay(true);\n\t\t\t\t\tconnection.setKeepAlive(true, 0);\n\t\t\t\t\tconnection.removeAllListeners('timeout');\n\n\n\t\t\t\t\t_connect_socket.call(that, connection, protocol);\n\n\t\t\t\t\tconnection.resume();\n\n\t\t\t\t} else {\n\n\t\t\t\t\tprotocol   = new _Protocol({\n\t\t\t\t\t\ttype: _Protocol.TYPE.client\n\t\t\t\t\t});\n\t\t\t\t\tconnection = new _net.Socket({\n\t\t\t\t\t\treadable: true,\n\t\t\t\t\t\twritable: true\n\t\t\t\t\t});\n\n\t\t\t\t\tconnection.allowHalfOpen = true;\n\t\t\t\t\tconnection.setTimeout(0);\n\t\t\t\t\tconnection.setNoDelay(true);\n\t\t\t\t\tconnection.setKeepAlive(true, 0);\n\t\t\t\t\tconnection.removeAllListeners('timeout');\n\n\n\t\t\t\t\t_connect_socket.call(that, connection, protocol);\n\n\t\t\t\t\tconnection.connect({\n\t\t\t\t\t\thost: host,\n\t\t\t\t\t\tport: port\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsend: function(payload, headers, binary) {\n\n\t\t\tpayload = payload instanceof Buffer ? payload : null;\n\t\t\theaders = headers instanceof Object ? headers : null;\n\t\t\tbinary  = binary === true;\n\n\n\t\t\tif (payload !== null) {\n\n\t\t\t\tlet connection = this.__connection;\n\t\t\t\tlet protocol   = this.__protocol;\n\n\t\t\t\tif (connection !== null && protocol !== null) {\n\n\t\t\t\t\tlet chunk = protocol.send(payload, headers, binary);\n\t\t\t\t\tlet enc   = binary === true ? 'binary' : 'utf8';\n\n\t\t\t\t\tif (chunk !== null) {\n\n\t\t\t\t\t\tconnection.write(chunk, enc);\n\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tdisconnect: function() {\n\n\t\t\tlet connection = this.__connection;\n\t\t\tlet protocol   = this.__protocol;\n\n\t\t\tif (connection !== null && protocol !== null) {\n\n\t\t\t\t_disconnect_socket.call(this, connection, protocol);\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.net.socket.WS":{"constructor":"lychee.Definition","arguments":["lychee.net.socket.WS"],"blob":{"attaches":{},"tags":{"platform":"node"},"requires":["lychee.crypto.SHA1","lychee.net.protocol.WS"],"includes":["lychee.event.Emitter"],"supports":"function (lychee, global) {\n\n\tif (\n\t\ttypeof global.require === 'function'\n\t\t&& typeof global.setInterval === 'function'\n\t) {\n\n\t\ttry {\n\n\t\t\tglobal.require('net');\n\n\t\t\treturn true;\n\n\t\t} catch (err) {\n\t\t}\n\n\t}\n\n\n\treturn false;\n\n}","exports":"function (lychee, global, attachments) {\n\n\tconst _net           = global.require('net');\n\tconst _clearInterval = global.clearInterval;\n\tconst _setInterval   = global.setInterval;\n\tconst _Emitter       = lychee.import('lychee.event.Emitter');\n\tconst _Protocol      = lychee.import('lychee.net.protocol.WS');\n\tconst _SHA1          = lychee.import('lychee.crypto.SHA1');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _connect_socket = function(socket, protocol) {\n\n\t\tlet that = this;\n\t\tif (that.__connection !== socket) {\n\n\t\t\tsocket.on('data', function(blob) {\n\n\t\t\t\tlet chunks = protocol.receive(blob);\n\t\t\t\tif (chunks.length > 0) {\n\n\t\t\t\t\tfor (let c = 0, cl = chunks.length; c < cl; c++) {\n\n\t\t\t\t\t\tlet chunk = chunks[c];\n\t\t\t\t\t\tif (chunk.payload[0] === 136) {\n\n\t\t\t\t\t\t\tthat.send(chunk.payload, chunk.headers, true);\n\t\t\t\t\t\t\tthat.disconnect();\n\n\t\t\t\t\t\t\treturn;\n\n\t\t\t\t\t\t} else {\n\n\t\t\t\t\t\t\tthat.trigger('receive', [ chunk.payload, chunk.headers ]);\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t});\n\n\t\t\tsocket.on('error', function(err) {\n\t\t\t\tthat.trigger('error');\n\t\t\t\tthat.disconnect();\n\t\t\t});\n\n\t\t\tsocket.on('timeout', function() {\n\t\t\t\tthat.trigger('error');\n\t\t\t\tthat.disconnect();\n\t\t\t});\n\n\t\t\tsocket.on('close', function() {\n\t\t\t\tthat.disconnect();\n\t\t\t});\n\n\t\t\tsocket.on('end', function() {\n\t\t\t\tthat.disconnect();\n\t\t\t});\n\n\n\t\t\tthat.__connection = socket;\n\t\t\tthat.__protocol   = protocol;\n\n\t\t\tthat.trigger('connect');\n\n\t\t}\n\n\t};\n\n\tconst _disconnect_socket = function(socket, protocol) {\n\n\t\tlet that = this;\n\t\tif (that.__connection === socket) {\n\n\t\t\tsocket.removeAllListeners('data');\n\t\t\tsocket.removeAllListeners('error');\n\t\t\tsocket.removeAllListeners('timeout');\n\t\t\tsocket.removeAllListeners('close');\n\t\t\tsocket.removeAllListeners('end');\n\n\t\t\tsocket.destroy();\n\t\t\tprotocol.close();\n\n\n\t\t\tthat.__connection = null;\n\t\t\tthat.__protocol   = null;\n\n\t\t\tthat.trigger('disconnect');\n\n\t\t}\n\n\t};\n\n\tconst _verify_client = function(headers, nonce) {\n\n\t\tlet connection = (headers['connection'] || '').toLowerCase();\n\t\tlet upgrade    = (headers['upgrade']    || '').toLowerCase();\n\t\tlet protocol   = (headers['sec-websocket-protocol'] || '').toLowerCase();\n\n\t\tif (connection === 'upgrade' && upgrade === 'websocket' && protocol === 'lycheejs') {\n\n\t\t\tlet accept = (headers['sec-websocket-accept'] || '');\n\t\t\tlet expect = (function(nonce) {\n\n\t\t\t\tlet sha1 = new _SHA1();\n\t\t\t\tsha1.update(nonce + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');\n\t\t\t\treturn sha1.digest().toString('base64');\n\n\t\t\t})(nonce.toString('base64'));\n\n\n\t\t\tif (accept === expect) {\n\t\t\t\treturn accept;\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\tconst _verify_remote = function(headers) {\n\n\t\tlet connection = (headers['connection'] || '').toLowerCase();\n\t\tlet upgrade    = (headers['upgrade']    || '').toLowerCase();\n\t\tlet protocol   = (headers['sec-websocket-protocol'] || '').toLowerCase();\n\n\t\tif (connection === 'upgrade' && upgrade === 'websocket' && protocol === 'lycheejs') {\n\n\t\t\tlet host   = headers['host']   || null;\n\t\t\tlet nonce  = headers['sec-websocket-key'] || null;\n\t\t\tlet origin = headers['origin'] || null;\n\n\t\t\tif (host !== null && nonce !== null && origin !== null) {\n\n\t\t\t\tlet handshake = '';\n\t\t\t\tlet accept    = (function(nonce) {\n\n\t\t\t\t\tlet sha1 = new _SHA1();\n\t\t\t\t\tsha1.update(nonce + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');\n\t\t\t\t\treturn sha1.digest().toString('base64');\n\n\t\t\t\t})(nonce);\n\n\n\t\t\t\t// HEAD\n\n\t\t\t\thandshake += 'HTTP/1.1 101 WebSocket Protocol Handshake\\r\\n';\n\t\t\t\thandshake += 'Upgrade: WebSocket\\r\\n';\n\t\t\t\thandshake += 'Connection: Upgrade\\r\\n';\n\n\t\t\t\thandshake += 'Sec-WebSocket-Version: '  + '13'       + '\\r\\n';\n\t\t\t\thandshake += 'Sec-WebSocket-Origin: '   + origin     + '\\r\\n';\n\t\t\t\thandshake += 'Sec-WebSocket-Protocol: ' + 'lycheejs' + '\\r\\n';\n\t\t\t\thandshake += 'Sec-WebSocket-Accept: '   + accept     + '\\r\\n';\n\n\n\t\t\t\t// BODY\n\t\t\t\thandshake += '\\r\\n';\n\n\n\t\t\t\treturn handshake;\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\tconst _upgrade_client = function(host, port, nonce) {\n\n\t\t// let that       = this;\n\t\tlet handshake  = '';\n\t\tlet identifier = lychee.ROOT.project;\n\n\n\t\tif (identifier.substr(0, lychee.ROOT.lychee.length) === lychee.ROOT.lychee) {\n\t\t\tidentifier = lychee.ROOT.project.substr(lychee.ROOT.lychee.length + 1);\n\t\t}\n\n\t\tfor (let n = 0; n < 16; n++) {\n\t\t\tnonce[n] = Math.round(Math.random() * 0xff);\n\t\t}\n\n\n\n\t\t// HEAD\n\n\t\thandshake += 'GET / HTTP/1.1\\r\\n';\n\t\thandshake += 'Host: ' + host + ':' + port + '\\r\\n';\n\t\thandshake += 'Upgrade: WebSocket\\r\\n';\n\t\thandshake += 'Connection: Upgrade\\r\\n';\n\t\thandshake += 'Origin: lycheejs://' + identifier + '\\r\\n';\n\t\thandshake += 'Sec-WebSocket-Key: ' + nonce.toString('base64') + '\\r\\n';\n\t\thandshake += 'Sec-WebSocket-Version: 13\\r\\n';\n\t\thandshake += 'Sec-WebSocket-Protocol: lycheejs\\r\\n';\n\n\n\t\t// BODY\n\t\thandshake += '\\r\\n';\n\n\n\t\tthis.once('data', function(data) {\n\n\t\t\tlet headers = {};\n\t\t\tlet lines   = data.toString('utf8').split('\\r\\n');\n\n\n\t\t\tlines.forEach(function(line) {\n\n\t\t\t\tlet index = line.indexOf(':');\n\t\t\t\tif (index !== -1) {\n\n\t\t\t\t\tlet key = line.substr(0, index).trim().toLowerCase();\n\t\t\t\t\tlet val = line.substr(index + 1, line.length - index - 1).trim();\n\t\t\t\t\tif (/connection|upgrade|sec-websocket-version|sec-websocket-origin|sec-websocket-protocol/g.test(key)) {\n\t\t\t\t\t\theaders[key] = val.toLowerCase();\n\t\t\t\t\t} else if (key === 'sec-websocket-accept') {\n\t\t\t\t\t\theaders[key] = val;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t});\n\n\n\t\t\tif (headers['connection'] === 'upgrade' && headers['upgrade'] === 'websocket') {\n\n\t\t\t\tthis.emit('upgrade', {\n\t\t\t\t\theaders: headers,\n\t\t\t\t\tsocket:  this\n\t\t\t\t});\n\n\t\t\t} else {\n\n\t\t\t\tlet err = new Error('connect ECONNREFUSED');\n\t\t\t\terr.code = 'ECONNREFUSED';\n\n\t\t\t\tthis.emit('error', err);\n\n\t\t\t}\n\n\t\t}.bind(this));\n\n\n\t\tthis.write(handshake, 'ascii');\n\n\t};\n\n\tconst _upgrade_remote = function(data) {\n\n\t\tlet lines   = data.toString('utf8').split('\\r\\n');\n\t\tlet headers = {};\n\n\n\t\tlines.forEach(function(line) {\n\n\t\t\tlet index = line.indexOf(':');\n\t\t\tif (index !== -1) {\n\n\t\t\t\tlet key = line.substr(0, index).trim().toLowerCase();\n\t\t\t\tlet val = line.substr(index + 1, line.length - index - 1).trim();\n\t\t\t\tif (/host|connection|upgrade|origin|sec-websocket-protocol/g.test(key)) {\n\t\t\t\t\theaders[key] = val.toLowerCase();\n\t\t\t\t} else if (key === 'sec-websocket-key') {\n\t\t\t\t\theaders[key] = val;\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t});\n\n\n\t\tif (headers['connection'] === 'upgrade' && headers['upgrade'] === 'websocket') {\n\n\t\t\tthis.emit('upgrade', {\n\t\t\t\theaders: headers,\n\t\t\t\tsocket:  this\n\t\t\t});\n\n\t\t} else {\n\n\t\t\tthis.destroy();\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function() {\n\n\t\tthis.__connection = null;\n\t\tthis.__protocol   = null;\n\n\n\t\t_Emitter.call(this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Emitter.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.socket.WS';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tconnect: function(host, port, connection) {\n\n\t\t\thost       = typeof host === 'string'       ? host       : null;\n\t\t\tport       = typeof port === 'number'       ? (port | 0) : null;\n\t\t\tconnection = typeof connection === 'object' ? connection : null;\n\n\n\t\t\tlet that = this;\n\t\t\t// let url  = /:/g.test(host) ? ('ws://[' + host + ']:' + port) : ('ws://' + host + ':' + port);\n\n\n\t\t\tif (host !== null && port !== null) {\n\n\t\t\t\tif (connection !== null) {\n\n\t\t\t\t\tconnection.once('data', _upgrade_remote.bind(connection));\n\t\t\t\t\tconnection.resume();\n\n\t\t\t\t\tconnection.once('error', function(err) {\n\n\t\t\t\t\t\tif (lychee.debug === true) {\n\n\t\t\t\t\t\t\tlet code = err.code || '';\n\t\t\t\t\t\t\tif (/ECONNABORTED|ECONNREFUSED|ECONNRESET/.test(code)) {\n\t\t\t\t\t\t\t\tconsole.warn('lychee.net.socket.WS: BAD CONNECTION to ' + host + ':' + port);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tthat.trigger('error');\n\t\t\t\t\t\tthat.disconnect();\n\n\t\t\t\t\t});\n\n\t\t\t\t\tconnection.on('upgrade', function(event) {\n\n\t\t\t\t\t\tlet protocol = new _Protocol({\n\t\t\t\t\t\t\ttype: _Protocol.TYPE.remote\n\t\t\t\t\t\t});\n\t\t\t\t\t\tlet socket   = event.socket || null;\n\n\n\t\t\t\t\t\tif (socket !== null) {\n\n\t\t\t\t\t\t\tlet verification = _verify_remote.call(socket, event.headers);\n\t\t\t\t\t\t\tif (verification !== null) {\n\n\t\t\t\t\t\t\t\tsocket.allowHalfOpen = true;\n\t\t\t\t\t\t\t\tsocket.setTimeout(0);\n\t\t\t\t\t\t\t\tsocket.setNoDelay(true);\n\t\t\t\t\t\t\t\tsocket.setKeepAlive(true, 0);\n\t\t\t\t\t\t\t\tsocket.removeAllListeners('timeout');\n\t\t\t\t\t\t\t\tsocket.write(verification, 'ascii');\n\n\n\t\t\t\t\t\t\t\t_connect_socket.call(that, socket, protocol);\n\n\t\t\t\t\t\t\t} else {\n\n\t\t\t\t\t\t\t\tif (lychee.debug === true) {\n\t\t\t\t\t\t\t\t\tconsole.warn('lychee.net.socket.WS: BAD HANDSHAKE to ' + host + ':' + port);\n\t\t\t\t\t\t\t\t}\n\n\n\t\t\t\t\t\t\t\tsocket.write('', 'ascii');\n\t\t\t\t\t\t\t\tsocket.end();\n\t\t\t\t\t\t\t\tsocket.destroy();\n\n\t\t\t\t\t\t\t\tthat.trigger('error');\n\t\t\t\t\t\t\t\tthat.disconnect();\n\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t});\n\n\t\t\t\t} else {\n\n\t\t\t\t\tlet nonce     = new Buffer(16);\n\t\t\t\t\tlet connector = new _net.Socket({\n\t\t\t\t\t\tfd:       null,\n\t\t\t\t\t\treadable: true,\n\t\t\t\t\t\twritable: true\n\t\t\t\t\t});\n\n\n\t\t\t\t\tconnector.once('connect', _upgrade_client.bind(connector, host, port, nonce));\n\n\t\t\t\t\tconnector.on('upgrade', function(event) {\n\n\t\t\t\t\t\tlet protocol = new _Protocol({\n\t\t\t\t\t\t\ttype: _Protocol.TYPE.client\n\t\t\t\t\t\t});\n\t\t\t\t\t\tlet socket   = event.socket || null;\n\n\n\t\t\t\t\t\tif (socket !== null) {\n\n\t\t\t\t\t\t\tlet verification = _verify_client(event.headers, nonce);\n\t\t\t\t\t\t\tif (verification !== null) {\n\n\t\t\t\t\t\t\t\tsocket.setTimeout(0);\n\t\t\t\t\t\t\t\tsocket.setNoDelay(true);\n\t\t\t\t\t\t\t\tsocket.setKeepAlive(true, 0);\n\t\t\t\t\t\t\t\tsocket.removeAllListeners('timeout');\n\n\n\t\t\t\t\t\t\t\tlet interval_id = _setInterval(function() {\n\n\t\t\t\t\t\t\t\t\tif (socket.writable) {\n\n\t\t\t\t\t\t\t\t\t\tlet chunk = protocol.ping();\n\t\t\t\t\t\t\t\t\t\tif (chunk !== null) {\n\t\t\t\t\t\t\t\t\t\t\tsocket.write(chunk);\n\t\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t} else {\n\n\t\t\t\t\t\t\t\t\t\t_clearInterval(interval_id);\n\t\t\t\t\t\t\t\t\t\tinterval_id = null;\n\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t}.bind(this), 60000);\n\n\n\t\t\t\t\t\t\t\t_connect_socket.call(that, socket, protocol);\n\n\t\t\t\t\t\t\t} else {\n\n\t\t\t\t\t\t\t\tif (lychee.debug === true) {\n\t\t\t\t\t\t\t\t\tconsole.warn('lychee.net.socket.WS: BAD HANDSHAKE to ' + host + ':' + port);\n\t\t\t\t\t\t\t\t}\n\n\n\t\t\t\t\t\t\t\tsocket.end();\n\t\t\t\t\t\t\t\tsocket.destroy();\n\n\t\t\t\t\t\t\t\tthat.trigger('error');\n\t\t\t\t\t\t\t\tthat.disconnect();\n\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t});\n\n\t\t\t\t\tconnector.once('error', function(err) {\n\n\t\t\t\t\t\tif (lychee.debug === true) {\n\n\t\t\t\t\t\t\tlet code = err.code || '';\n\t\t\t\t\t\t\tif (/ECONNABORTED|ECONNREFUSED|ECONNRESET/.test(code)) {\n\t\t\t\t\t\t\t\tconsole.warn('lychee.net.socket.WS: BAD CONNECTION to ' + host + ':' + port);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tthat.trigger('error');\n\t\t\t\t\t\tthat.disconnect();\n\n\t\t\t\t\t\tthis.end();\n\t\t\t\t\t\tthis.destroy();\n\n\t\t\t\t\t});\n\n\t\t\t\t\tconnector.connect({\n\t\t\t\t\t\thost: host,\n\t\t\t\t\t\tport: port\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsend: function(payload, headers, binary) {\n\n\t\t\tpayload = payload instanceof Buffer ? payload : null;\n\t\t\theaders = headers instanceof Object ? headers : null;\n\t\t\tbinary  = binary === true;\n\n\n\t\t\tif (payload !== null) {\n\n\t\t\t\tlet connection = this.__connection;\n\t\t\t\tlet protocol   = this.__protocol;\n\n\t\t\t\tif (connection !== null && protocol !== null) {\n\n\t\t\t\t\tlet chunk = protocol.send(payload, headers, binary);\n\t\t\t\t\tlet enc   = binary === true ? 'binary' : 'utf8';\n\n\t\t\t\t\tif (chunk !== null) {\n\n\t\t\t\t\t\tconnection.write(chunk, enc);\n\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tdisconnect: function() {\n\n\t\t\tlet connection = this.__connection;\n\t\t\tlet protocol   = this.__protocol;\n\n\t\t\tif (connection !== null && protocol !== null) {\n\n\t\t\t\t_disconnect_socket.call(this, connection, protocol);\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.net.client.Console":{"constructor":"lychee.Definition","arguments":["harvester.net.client.Console"],"blob":{"attaches":{},"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\tconst _CACHE   = {};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _on_sync = function(data) {\n\n\t\tif (data instanceof Object) {\n\n\t\t\tfor (let prop in data) {\n\t\t\t\t_CACHE[prop] = data[prop];\n\t\t\t}\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(client) {\n\n\t\t_Service.call(this, 'console', client, _Service.TYPE.client);\n\n\n\t\tthis.bind('sync', _on_sync, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.client.Console';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsync: function() {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null) {\n\n\t\t\t\tlet result = tunnel.send({}, {\n\t\t\t\t\tid:     this.id,\n\t\t\t\t\tmethod: 'index'\n\t\t\t\t});\n\n\t\t\t\tif (result === true) {\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.net.client.Harvester":{"constructor":"lychee.Definition","arguments":["harvester.net.client.Harvester"],"blob":{"attaches":{},"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\tlet   _ID      = null;\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _on_handshake = function(data) {\n\n\t\tif (typeof data.id === 'string') {\n\t\t\t_ID = data.id;\n\t\t}\n\n\t};\n\n\tconst _serialize = function(harvester) {\n\n\t\treturn {\n\t\t\tid:        _ID || null,\n\t\t\tnetworks:  harvester.getNetworks(),\n\t\t\tlibraries: Object.keys(harvester._libraries),\n\t\t\tprojects:  Object.keys(harvester._projects)\n\t\t};\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(client) {\n\n\t\t_Service.call(this, 'harvester', client, _Service.TYPE.client);\n\n\t\tthis.bind('handshake', _on_handshake, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.client.Harvester';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tconnect: function() {\n\n\t\t\tlet main   = global.MAIN || null;\n\t\t\tlet tunnel = this.tunnel;\n\n\t\t\tif (main !== null && tunnel !== null) {\n\n\t\t\t\tlet result = tunnel.send(_serialize(main), {\n\t\t\t\t\tid:    this.id,\n\t\t\t\t\tevent: 'connect'\n\t\t\t\t});\n\n\t\t\t\tif (result === true) {\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tdisconnect: function() {\n\n\t\t\tlet main   = global.MAIN || null;\n\t\t\tlet tunnel = this.tunnel;\n\n\t\t\tif (main !== null && tunnel !== null) {\n\n\t\t\t\tlet result = tunnel.send({\n\t\t\t\t\tid: _ID\n\t\t\t\t}, {\n\t\t\t\t\tid:    this.id,\n\t\t\t\t\tevent: 'disconnect'\n\t\t\t\t});\n\n\t\t\t\tif (result === true) {\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.net.client.Library":{"constructor":"lychee.Definition","arguments":["harvester.net.client.Library"],"blob":{"attaches":{},"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\tconst _CACHE   = {};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _on_sync = function(data) {\n\n\t\tif (data instanceof Array) {\n\n\t\t\tdata.forEach(function(object) {\n\t\t\t\t_CACHE[object.identifier] = object;\n\t\t\t});\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(client) {\n\n\t\t_Service.call(this, 'library', client, _Service.TYPE.client);\n\n\n\t\tthis.bind('sync', _on_sync, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.client.Library';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsync: function() {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null) {\n\n\t\t\t\tlet result = tunnel.send({}, {\n\t\t\t\t\tid:     this.id,\n\t\t\t\t\tmethod: 'index'\n\t\t\t\t});\n\n\t\t\t\tif (result === true) {\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.net.client.Profile":{"constructor":"lychee.Definition","arguments":["harvester.net.client.Profile"],"blob":{"attaches":{},"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\tconst _CACHE   = {};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _on_sync = function(data) {\n\n\t\tif (data instanceof Array) {\n\n\t\t\tdata.forEach(function(object) {\n\t\t\t\t_CACHE[object.identifier] = object;\n\t\t\t});\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(client) {\n\n\t\t_Service.call(this, 'profile', client, _Service.TYPE.client);\n\n\n\t\tthis.bind('sync', _on_sync, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.client.Profile';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsync: function() {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null) {\n\n\t\t\t\tlet result = tunnel.send({}, {\n\t\t\t\t\tid:     this.id,\n\t\t\t\t\tmethod: 'index'\n\t\t\t\t});\n\n\t\t\t\tif (result === true) {\n\t\t\t\t\treturn true;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsave: function(data) {\n\n\t\t\tdata = data instanceof Object ? data : null;\n\n\n\t\t\tif (data !== null) {\n\n\t\t\t\tlet profile = {\n\t\t\t\t\tidentifier: typeof data.identifier === 'string' ? data.identifier : null,\n\t\t\t\t\thost:       typeof data.host === 'string'       ? data.host       : null,\n\t\t\t\t\tport:       typeof data.port === 'string'       ? data.port       : null,\n\t\t\t\t\tdebug:      data.debug   === true,\n\t\t\t\t\tsandbox:    data.sandbox === true\n\t\t\t\t};\n\n\t\t\t\tlet tunnel = this.tunnel;\n\t\t\t\tif (tunnel !== null && profile.identifier !== null && profile.host !== null && profile.port !== null) {\n\n\t\t\t\t\tlet result = tunnel.send(profile, {\n\t\t\t\t\t\tid:    this.id,\n\t\t\t\t\t\tevent: 'save'\n\t\t\t\t\t});\n\n\t\t\t\t\tif (result === true) {\n\t\t\t\t\t\treturn true;\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"harvester.net.client.Project":{"constructor":"lychee.Definition","arguments":["harvester.net.client.Project"],"blob":{"attaches":{},"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\tconst _CACHE   = {};\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _on_sync = function(data) {\n\n\t\tif (data instanceof Array) {\n\n\t\t\tdata.forEach(function(object) {\n\t\t\t\t_CACHE[object.identifier] = object;\n\t\t\t});\n\n\t\t}\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(client) {\n\n\t\t_Service.call(this, 'project', client, _Service.TYPE.client);\n\n\n\t\tthis.bind('sync', _on_sync, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'harvester.net.client.Project';\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsync: function() {\n\n\t\t\tlet tunnel = this.tunnel;\n\t\t\tif (tunnel !== null) {\n\n\t\t\t\tlet result = tunnel.send({}, {\n\t\t\t\t\tid:     this.id,\n\t\t\t\t\tmethod: 'index'\n\t\t\t\t});\n\n\t\t\t\tif (result === true) {\n\t\t\t\t\treturn result;\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.net.Client":{"constructor":"lychee.Definition","arguments":["lychee.net.Client"],"blob":{"attaches":{},"requires":["lychee.net.client.Debugger","lychee.net.client.Stash","lychee.net.client.Storage"],"includes":["lychee.net.Tunnel"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Debugger = lychee.import('lychee.net.client.Debugger');\n\tconst _Stash    = lychee.import('lychee.net.client.Stash');\n\tconst _Storage  = lychee.import('lychee.net.client.Storage');\n\tconst _Tunnel   = lychee.import('lychee.net.Tunnel');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({}, data);\n\n\n\t\t_Tunnel.call(this, settings);\n\n\t\tsettings = null;\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tif (lychee.debug === true) {\n\n\t\t\tthis.bind('connect', function() {\n\t\t\t\tthis.addService(new _Debugger(this));\n\t\t\t}, this);\n\n\t\t}\n\n\n\t\tthis.bind('connect', function() {\n\n\t\t\tthis.addService(new _Stash(this));\n\t\t\tthis.addService(new _Storage(this));\n\n\t\t}, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Tunnel.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.Client';\n\n\n\t\t\treturn data;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.net.protocol.HTTP":{"constructor":"lychee.Definition","arguments":["lychee.net.protocol.HTTP"],"blob":{"attaches":{},"exports":"function (lychee, global, attachments) {\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _uppercase = function(str) {\n\n\t\tlet tmp = str.split('-');\n\n\t\tfor (let t = 0, tl = tmp.length; t < tl; t++) {\n\t\t\tlet ch = tmp[t];\n\t\t\ttmp[t] = ch.charAt(0).toUpperCase() + ch.substr(1);\n\t\t}\n\n\t\treturn tmp.join('-');\n\n\t};\n\n\tconst _encode_buffer = function(payload, headers, binary) {\n\n\t\tlet type           = this.type;\n\t\tlet buffer         = null;\n\n\t\tlet headers_data   = null;\n\t\tlet headers_length = 0;\n\t\tlet payload_data   = payload;\n\t\tlet payload_length = payload.length;\n\n\n\t\tif (type === Composite.TYPE.client) {\n\n\t\t\tlet url            = headers['url']             || null;\n\t\t\tlet method         = headers['method']          || null;\n\t\t\tlet service_id     = headers['@service-id']     || null;\n\t\t\tlet service_event  = headers['@service-event']  || null;\n\t\t\tlet service_method = headers['@service-method'] || null;\n\n\n\t\t\tif (service_id !== null) {\n\n\t\t\t\tif (service_method !== null) {\n\n\t\t\t\t\tmethod = 'GET';\n\t\t\t\t\turl    = '/api/' + service_id + '/' + service_method;\n\n\t\t\t\t} else if (service_event !== null) {\n\n\t\t\t\t\tmethod = 'POST';\n\t\t\t\t\turl    = '/api/' + service_id + '/' + service_event;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tif (url !== null && method !== null) {\n\t\t\t\theaders_data = method + ' ' + url + ' HTTP/1.1\\r\\n';\n\t\t\t} else {\n\t\t\t\theaders_data = 'GET * HTTP/1.1\\r\\n';\n\t\t\t}\n\n\n\t\t\theaders_data += 'Connection: keep-alive\\r\\n';\n\t\t\theaders_data += 'Content-Length: ' + payload_length + '\\r\\n';\n\n\t\t\tfor (let key in headers) {\n\n\t\t\t\tif (key.charAt(0) === '@') {\n\t\t\t\t\theaders_data += '' + _uppercase('x-' + key.substr(1)) + ': ' + headers[key] + '\\r\\n';\n\t\t\t\t} else if (/url|method/g.test(key) === false) {\n\t\t\t\t\theaders_data += '' + _uppercase(key) + ': ' + headers[key] + '\\r\\n';\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\theaders_data  += '\\r\\n';\n\t\t\theaders_length = headers_data.length;\n\n\t\t} else {\n\n\t\t\tlet status  = headers['status'] || Composite.STATUS.normal_okay;\n\t\t\tlet exposed = [ 'Content-Type' ];\n\n\n\t\t\theaders_data  = 'HTTP/1.1 ' + status + '\\r\\n';\n\t\t\theaders_data += 'Connection: keep-alive\\r\\n';\n\t\t\theaders_data += 'Content-Length: ' + payload_length + '\\r\\n';\n\n\t\t\tfor (let key in headers) {\n\n\t\t\t\tif (key.charAt(0) === '@') {\n\t\t\t\t\theaders_data += '' + _uppercase('x-' + key.substr(1)) + ': ' + headers[key] + '\\r\\n';\n\t\t\t\t\texposed.push(_uppercase('x-' + key.substr(1)));\n\t\t\t\t} else if (/status/g.test(key) === false) {\n\t\t\t\t\theaders_data += '' + _uppercase(key) + ': ' + headers[key] + '\\r\\n';\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\theaders_data  += 'Access-Control-Expose-Headers: ' + exposed.join(', ') + '\\r\\n';\n\t\t\theaders_data  += '\\r\\n';\n\t\t\theaders_length = headers_data.length;\n\n\t\t}\n\n\n\t\tlet content_type = headers['content-type'] || 'text/plain';\n\t\tif (/text\\//g.test(content_type) === true) {\n\n\t\t\tbuffer = new Buffer(headers_length + payload_length + 4);\n\t\t\tbuffer.write(headers_data, 0, headers_length, 'utf8');\n\t\t\tpayload_data.copy(buffer, headers_length, 0, payload_length);\n\t\t\tbuffer.write('\\r\\n\\r\\n', headers_length + payload_length, 4, 'utf8');\n\n\t\t} else {\n\n\t\t\tbuffer = new Buffer(headers_length + payload_length + 4);\n\t\t\tbuffer.write(headers_data, 0, headers_length, 'utf8');\n\t\t\tpayload_data.copy(buffer, headers_length, 0, payload_length);\n\t\t\tbuffer.write('\\r\\n\\r\\n', headers_length + payload_length, 4, 'utf8');\n\n\t\t}\n\n\n\t\treturn buffer;\n\n\t};\n\n\tconst _decode_buffer = function(buffer) {\n\n\t\tbuffer = buffer.toString('utf8');\n\n\n\t\tlet chunk = {\n\t\t\tbytes:   -1,\n\t\t\theaders: {},\n\t\t\tpayload: null\n\t\t};\n\n\n\t\tif (buffer.indexOf('\\r\\n\\r\\n') === -1) {\n\t\t\treturn chunk;\n\t\t}\n\n\n\t\tlet headers_length = buffer.indexOf('\\r\\n\\r\\n') + 4;\n\t\tlet headers_data   = buffer.substr(0, headers_length);\n\t\tlet payload_data   = buffer.substr(headers_length);\n\t\tlet payload_length = payload_data.length;\n\n\n\t\tlet i_end = payload_data.indexOf('\\r\\n\\r\\n');\n\t\tif (i_end !== -1) {\n\t\t\tpayload_data   = payload_data.substr(0, i_end);\n\t\t\tpayload_length = payload_data.length + 4;\n\t\t}\n\n\n\t\theaders_data.split('\\r\\n').forEach(function(line) {\n\n\t\t\tlet tmp = line.trim();\n\t\t\tif (/^(OPTIONS|GET|POST)/g.test(tmp) === true) {\n\n\t\t\t\tlet tmp2   = tmp.split(' ');\n\t\t\t\tlet method = (tmp2[0] || '').trim() || null;\n\t\t\t\tlet url    = (tmp2[1] || '').trim() || null;\n\n\t\t\t\tif (method !== null && url !== null) {\n\n\t\t\t\t\tchunk.headers['method'] = method;\n\t\t\t\t\tchunk.headers['url']    = url;\n\n\t\t\t\t}\n\n\n\t\t\t\tif (url.substr(0, 5) === '/api/') {\n\n\t\t\t\t\tlet tmp3 = [];\n\n\t\t\t\t\tif (url.indexOf('?') !== -1) {\n\t\t\t\t\t\ttmp3 = url.split('?')[0].split('/');\n\t\t\t\t\t} else {\n\t\t\t\t\t\ttmp3 = url.split('/');\n\t\t\t\t\t}\n\n\t\t\t\t\tif (tmp3.length === 4) {\n\n\t\t\t\t\t\tif (method === 'GET') {\n\n\t\t\t\t\t\t\tchunk.headers['@service-id']     = tmp3[2];\n\t\t\t\t\t\t\tchunk.headers['@service-method'] = tmp3[3];\n\n\t\t\t\t\t\t} else if (method === 'POST') {\n\n\t\t\t\t\t\t\tchunk.headers['@service-id']    = tmp3[2];\n\t\t\t\t\t\t\tchunk.headers['@service-event'] = tmp3[3];\n\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t}\n\n\t\t\t} else if (tmp.substr(0, 4) === 'HTTP') {\n\n\t\t\t\tif (/[0-9]{3}/g.test(tmp) === true) {\n\t\t\t\t\tchunk.headers['status'] = tmp.split(' ')[1];\n\t\t\t\t}\n\n\t\t\t} else if (/^[0-9]{3}/g.test(tmp) === true) {\n\n\t\t\t\tchunk.headers['status'] = tmp.split(' ')[0];\n\n\t\t\t} else if (/:/g.test(tmp)) {\n\n\t\t\t\tlet i_tmp = tmp.indexOf(':');\n\t\t\t\tlet key   = tmp.substr(0, i_tmp).trim().toLowerCase();\n\t\t\t\tlet val   = tmp.substr(i_tmp + 1).trim().toLowerCase();\n\n\t\t\t\tif (key === 'host') {\n\n\t\t\t\t\tif (/^\\[([a-f0-9\\:]+)\\](.*)$/g.test(val) === true) {\n\t\t\t\t\t\tchunk.headers[key] = val.split(/^\\[([a-f0-9\\:]+)\\](.*)$/g)[1];\n\t\t\t\t\t} else {\n\t\t\t\t\t\tchunk.headers[key] = val;\n\t\t\t\t\t}\n\n\t\t\t\t} else if (/origin|connection|upgrade|content-type|content-length|accept-encoding|accept-language|e-tag/g.test(key) === true) {\n\n\t\t\t\t\tchunk.headers[key] = val;\n\n\t\t\t\t} else if (/expires|if-modified-since|last-modified/g.test(key) === true) {\n\n\t\t\t\t\tval = tmp.split(':').slice(1).join(':').trim();\n\t\t\t\t\tchunk.headers[key] = val;\n\n\t\t\t\t} else if (/access-control/g.test(key) === true) {\n\n\t\t\t\t\tchunk.headers[key] = val;\n\n\t\t\t\t} else if (key.substr(0, 2) === 'x-') {\n\n\t\t\t\t\tchunk.headers['@' + key.substr(2)] = val;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t});\n\n\n\t\tlet check = chunk.headers['method'] || null;\n\t\tif (check === 'GET') {\n\n\t\t\tlet tmp4 = chunk.headers['url'] || '';\n\t\t\tif (tmp4.indexOf('?') !== -1) {\n\n\t\t\t\tlet tmp5 = tmp4.split('?')[1].split('&');\n\t\t\t\tlet tmp6 = {};\n\n\t\t\t\ttmp5.forEach(function(str) {\n\n\t\t\t\t\tlet key = str.split('=')[0] || '';\n\t\t\t\t\tlet val = str.split('=')[1] || '';\n\n\t\t\t\t\tif (key !== '' && val !== '') {\n\t\t\t\t\t\ttmp6[key] = val;\n\t\t\t\t\t}\n\n\t\t\t\t});\n\n\n\t\t\t\tchunk.bytes   = headers_length + payload_length;\n\t\t\t\tchunk.payload = new Buffer(JSON.stringify(tmp6), 'utf8');\n\n\t\t\t} else {\n\n\t\t\t\tchunk.bytes   = headers_length + payload_length;\n\t\t\t\tchunk.payload = new Buffer('', 'utf8');\n\n\t\t\t}\n\n\t\t} else if (check === 'OPTIONS') {\n\n\t\t\tchunk.bytes   = headers_length + payload_length;\n\t\t\tchunk.payload = new Buffer('', 'utf8');\n\n\t\t} else if (check === 'POST') {\n\n\t\t\tchunk.bytes   = headers_length + payload_length;\n\t\t\tchunk.payload = new Buffer(payload_data, 'utf8');\n\n\t\t} else {\n\n\t\t\tlet status = chunk.headers['status'] || null;\n\t\t\tif (status !== null) {\n\n\t\t\t\tchunk.bytes   = headers_length + payload_length;\n\t\t\t\tchunk.payload = new Buffer(payload_data, 'utf8');\n\n\t\t\t} else {\n\n\t\t\t\tchunk.bytes   = buffer.length;\n\t\t\t\tchunk.headers = null;\n\t\t\t\tchunk.payload = null;\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn chunk;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({}, data);\n\n\n\t\tthis.type = lychee.enumof(Composite.TYPE, settings.type) ? settings.type : null;\n\n\t\tthis.__buffer   = new Buffer(0);\n\t\tthis.__isClosed = false;\n\n\n\t\tif (lychee.debug === true) {\n\n\t\t\tif (this.type === null) {\n\t\t\t\tconsole.error('lychee.net.protocol.HTTP: Invalid (lychee.net.protocol.HTTP.TYPE) type.');\n\t\t\t}\n\n\t\t}\n\n\t\tsettings = null;\n\n\t};\n\n\n\t// Composite.FRAMESIZE = 32768; // 32kB\n\tComposite.FRAMESIZE = 0x800000; // 8MiB\n\n\n\tComposite.STATUS = {\n\n\t\t// RFC7231\n\t\tnormal_continue: '100 Continue',\n\t\tnormal_okay:     '200 OK',\n\t\tprotocol_error:  '400 Bad Request',\n\t\tmessage_too_big: '413 Payload Too Large',\n\t\tnot_found:       '404 Not Found',\n\t\tnot_allowed:     '405 Method Not Allowed',\n\t\tnot_implemented: '501 Not Implemented',\n\t\tbad_gateway:     '502 Bad Gateway',\n\n\t\t// RFC7233\n\t\tnormal_closure:  '204 No Content',\n\t\tnormal_partial:  '206 Partial Content'\n\n\t};\n\n\n\tComposite.TYPE = {\n\t\t// 'default': 0, (deactivated)\n\t\t'client': 1,\n\t\t'remote': 2\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'lychee.net.protocol.HTTP',\n\t\t\t\t'arguments':   [ this.type ],\n\t\t\t\t'blob':        null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * PROTOCOL API\n\t\t */\n\n\t\tsend: function(payload, headers, binary) {\n\n\t\t\tpayload = payload instanceof Buffer ? payload : null;\n\t\t\theaders = headers instanceof Object ? headers : null;\n\t\t\tbinary  = binary === true;\n\n\n\t\t\tif (payload !== null) {\n\n\t\t\t\tif (this.__isClosed === false) {\n\t\t\t\t\treturn _encode_buffer.call(this, payload, headers, binary);\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\t\treceive: function(blob) {\n\n\t\t\tblob = blob instanceof Buffer ? blob : null;\n\n\n\t\t\tlet chunks = [];\n\n\n\t\t\tif (blob !== null) {\n\n\t\t\t\tif (blob.length > Composite.FRAMESIZE) {\n\n\t\t\t\t\tchunks.push(this.close(Composite.STATUS.message_too_big));\n\n\t\t\t\t} else if (this.__isClosed === false) {\n\n\t\t\t\t\tlet buf = this.__buffer;\n\t\t\t\t\tlet tmp = new Buffer(buf.length + blob.length);\n\n\n\t\t\t\t\tbuf.copy(tmp);\n\t\t\t\t\tblob.copy(tmp, buf.length);\n\t\t\t\t\tbuf = tmp;\n\n\n\t\t\t\t\tlet chunk = _decode_buffer.call(this, buf);\n\n\t\t\t\t\twhile (chunk.bytes !== -1) {\n\n\t\t\t\t\t\tif (chunk.payload !== null) {\n\t\t\t\t\t\t\tchunks.push(chunk);\n\t\t\t\t\t\t}\n\n\n\t\t\t\t\t\ttmp = new Buffer(buf.length - chunk.bytes);\n\t\t\t\t\t\tbuf.copy(tmp, 0, chunk.bytes);\n\t\t\t\t\t\tbuf = tmp;\n\n\t\t\t\t\t\tchunk = null;\n\t\t\t\t\t\tchunk = _decode_buffer.call(this, buf);\n\n\t\t\t\t\t}\n\n\n\t\t\t\t\tthis.__buffer = buf;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn chunks;\n\n\t\t},\n\n\t\tclose: function(status) {\n\n\t\t\tstatus = typeof status === 'number' ? status : Composite.STATUS.no_content;\n\n\n\t\t\tif (this.__isClosed === false) {\n\n// TODO: Close method should create a close status buffer\n\t\t\t\t// let buffer = new Buffer(4);\n\n\t\t\t\t// buffer[0]  = 128 + 0x08;\n\t\t\t\t// buffer[1]  =   0 + 0x02;\n\n\t\t\t\t// buffer.write(String.fromCharCode((status >> 8) & 0xff) + String.fromCharCode((status >> 0) & 0xff), 2, 'binary');\n\n\t\t\t\t// this.__isClosed = true;\n\n\n\t\t\t\t// return buffer;\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.crypto.SHA1":{"constructor":"lychee.Definition","arguments":["lychee.crypto.SHA1"],"blob":{"attaches":{},"exports":"function (lychee, global, attachments) {\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _read_int32BE = function(buffer, offset) {\n\t\treturn (buffer[offset] << 24) | (buffer[offset + 1] << 16) | (buffer[offset + 2] << 8) | (buffer[offset + 3]);\n\t};\n\n\tconst _write_int32BE = function(buffer, value, offset) {\n\n\t\tvalue  = +value;\n\t\toffset = offset | 0;\n\n\n\t\tif (value < 0) {\n\t\t\tvalue = 0xffffffff + value + 1;\n\t\t}\n\n\t\tfor (let b = 0, bl = Math.min(buffer.length - offset, 4); b < bl; b++) {\n\t\t\tbuffer[offset + b] = (value >>> (3 - b) * 8) & 0xff;\n\t\t}\n\n\n\t\treturn offset + 4;\n\n\t};\n\n\tconst _write_zero = function(buffer, start, end) {\n\n\t\tstart = typeof start === 'number' ? (start | 0) : 0;\n\t\tend   = typeof end === 'number'   ? (end   | 0) : buffer.length;\n\n\n\t\tif (start === end) return;\n\n\n\t\tend = Math.min(end, buffer.length);\n\n\n\t\tlet diff = end - start;\n\t\tfor (let b = 0; b < diff; b++) {\n\t\t\tbuffer[b + start] = 0;\n\t\t}\n\n\t};\n\n\tconst _calculate_w = function(w, i) {\n\t\treturn _rotate(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);\n\t};\n\n\tconst _rotate = function(number, count) {\n\t\treturn (number << count) | (number >>> (32 - count));\n\t};\n\n\tconst _update_chunk = function(buffer) {\n\n\t\tlet a = this.__a;\n\t\tlet b = this.__b;\n\t\tlet c = this.__c;\n\t\tlet d = this.__d;\n\t\tlet e = this.__e;\n\t\tlet w = this.__w;\n\n\n\t\tlet j = 0;\n\t\tlet tmp1, tmp2;\n\n\t\twhile (j < 16) {\n\n\t\t\ttmp1 = _read_int32BE(buffer, j * 4);\n\t\t\ttmp2 = _rotate(a, 5) + ((b & c) | ((~b) & d)) + e + tmp1 + 1518500249;\n\t\t\tw[j] = tmp1;\n\n\t\t\te = d;\n\t\t\td = c;\n\t\t\tc = _rotate(b, 30);\n\t\t\tb = a;\n\t\t\ta = tmp2;\n\t\t\tj++;\n\n\t\t}\n\n\t\twhile (j < 20) {\n\n\t\t\ttmp1 = _calculate_w(w, j);\n\t\t\ttmp2 = _rotate(a, 5) + ((b & c) | ((~b) & d)) + e + tmp1 + 1518500249;\n\t\t\tw[j] = tmp1;\n\n\t\t\te = d;\n\t\t\td = c;\n\t\t\tc = _rotate(b, 30);\n\t\t\tb = a;\n\t\t\ta = tmp2;\n\t\t\tj++;\n\n\t\t}\n\n\t\twhile (j < 40) {\n\n\t\t\ttmp1 = _calculate_w(w, j);\n\t\t\ttmp2 = _rotate(a, 5) + (b ^ c ^ d) + e + tmp1 + 1859775393;\n\t\t\tw[j] = tmp1;\n\n\t\t\te = d;\n\t\t\td = c;\n\t\t\tc = _rotate(b, 30);\n\t\t\tb = a;\n\t\t\ta = tmp2;\n\t\t\tj++;\n\n\t\t}\n\n\t\twhile (j < 60) {\n\n\t\t\ttmp1 = _calculate_w(w, j);\n\t\t\ttmp2 = _rotate(a, 5) + ((b & c) | (b & d) | (c & d)) + e + tmp1 - 1894007588;\n\t\t\tw[j] = tmp1;\n\n\t\t\te = d;\n\t\t\td = c;\n\t\t\tc = _rotate(b, 30);\n\t\t\tb = a;\n\t\t\ta = tmp2;\n\t\t\tj++;\n\n\t\t}\n\n\t\twhile (j < 80) {\n\n\t\t\ttmp1 = _calculate_w(w, j);\n\t\t\ttmp2 = _rotate(a, 5) + (b ^ c ^ d) + e + tmp1 - 899497514;\n\t\t\tw[j] = tmp1;\n\n\t\t\te = d;\n\t\t\td = c;\n\t\t\tc = _rotate(b, 30);\n\t\t\tb = a;\n\t\t\ta = tmp2;\n\t\t\tj++;\n\n\t\t}\n\n\n\t\tthis.__a = (a + this.__a) | 0;\n\t\tthis.__b = (b + this.__b) | 0;\n\t\tthis.__c = (c + this.__c) | 0;\n\t\tthis.__d = (d + this.__d) | 0;\n\t\tthis.__e = (e + this.__e) | 0;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function() {\n\n\t\tthis.__a = 0x67452301 | 0;\n\t\tthis.__b = 0xefcdab89 | 0;\n\t\tthis.__c = 0x98badcfe | 0;\n\t\tthis.__d = 0x10325476 | 0;\n\t\tthis.__e = 0xc3d2e1f0 | 0;\n\t\tthis.__w = new Array(80);\n\n\t\tthis.__buffer  = new Buffer(64);\n\t\tthis.__length  = 0;\n\t\tthis.__pointer = 0;\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'lychee.crypto.SHA1',\n\t\t\t\t'arguments':   []\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CRYPTO API\n\t\t */\n\n\t\tupdate: function(data) {\n\n\t\t\tdata = data instanceof Buffer ? data : new Buffer(data, 'utf8');\n\n\n\t\t\tlet buffer  = this.__buffer;\n\t\t\tlet length  = this.__length + data.length;\n\t\t\tlet pointer = this.__pointer;\n\n\n\t\t\tlet p = 0;\n\n\t\t\twhile (pointer < length) {\n\n\t\t\t\tlet size = (Math.min(data.length, p + 64 - (pointer % 64)) - p);\n\n\t\t\t\tfor (let s = 0; s < size; s++) {\n\t\t\t\t\tbuffer[(pointer % 64) + s] = data[s + p];\n\t\t\t\t}\n\n\t\t\t\tpointer += size;\n\t\t\t\tp       += size;\n\n\t\t\t\tif (pointer % 64 === 0) {\n\t\t\t\t\t_update_chunk.call(this, buffer);\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\tthis.__length  = length;\n\t\t\tthis.__pointer = p;\n\n\t\t},\n\n\t\tdigest: function() {\n\n\t\t\tlet buffer = this.__buffer;\n\t\t\tlet length = this.__length;\n\n\n\t\t\tbuffer[length % 64] = 0x80;\n\t\t\t_write_zero(buffer, length % 64 + 1);\n\t\t\t// buffer.fill(0, length % 64 + 1);\n\n\n\t\t\tif ((length * 8) % (64 * 8) >= (56 * 8)) {\n\t\t\t\t_update_chunk.call(this, buffer);\n\t\t\t\t_write_zero(buffer);\n\t\t\t\t// buffer.fill(0);\n\t\t\t}\n\n\n\t\t\t_write_int32BE(buffer, length * 8, 64 - 4);\n\t\t\t_update_chunk.call(this, buffer);\n\n\n\t\t\tlet hash = new Buffer(20);\n\n\t\t\t_write_int32BE(hash, this.__a | 0,  0);\n\t\t\t_write_int32BE(hash, this.__b | 0,  4);\n\t\t\t_write_int32BE(hash, this.__c | 0,  8);\n\t\t\t_write_int32BE(hash, this.__d | 0, 12);\n\t\t\t_write_int32BE(hash, this.__e | 0, 16);\n\n\t\t\treturn hash;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.net.protocol.WS":{"constructor":"lychee.Definition","arguments":["lychee.net.protocol.WS"],"blob":{"attaches":{},"requires":["lychee.codec.JSON"],"exports":"function (lychee, global, attachments) {\n\n\tconst _JSON = lychee.import('lychee.codec.JSON');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\t/*\n\t * WebSocket Framing Protocol\n\t *\n\t * |0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|0 1 2 3 4 5 6 7|\n\t * +-+-+-+-+-------+-+-------------+-------------------------------+\n\t * |F|R|R|R| opcode|M| Payload len |    Extended payload length    |\n\t * |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |\n\t * |N|V|V|V|       |S|             |   (if payload len==126/127)   |\n\t * | |1|2|3|       |K|             |                               |\n\t * +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +\n\t * |     Extended payload length continued, if payload len == 127  |\n\t * + - - - - - - - - - - - - - - - +-------------------------------+\n\t * |                               |Masking-key, if MASK set to 1  |\n\t * +-------------------------------+-------------------------------+\n\t * | Masking-key (continued)       |          Payload Data         |\n\t * +-------------------------------- - - - - - - - - - - - - - - - +\n\t * :                     Payload Data continued ...                :\n\t * + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +\n\t * |                     Payload Data continued ...                |\n\t * +---------------------------------------------------------------+\n\t *\n\t */\n\n\tconst _on_ping_frame = function() {\n\n\t\tlet type = this.type;\n\t\tif (type === Composite.TYPE.remote) {\n\n\t\t\tlet buffer = new Buffer(2);\n\n\t\t\t// FIN, Pong\n\t\t\t// Unmasked, 0 payload\n\n\t\t\tbuffer[0] = 128 + 0x0a;\n\t\t\tbuffer[1] =   0 + 0x00;\n\n\n\t\t\treturn buffer;\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\tconst _on_pong_frame = function() {\n\n\t\tlet type = this.type;\n\t\tif (type === Composite.TYPE.client) {\n\n\t\t\tlet buffer = new Buffer(6);\n\n\t\t\t// FIN, Ping\n\t\t\t// Masked, 0 payload\n\n\t\t\tbuffer[0] = 128 + 0x09;\n\t\t\tbuffer[1] = 128 + 0x00;\n\n\t\t\tbuffer[2] = (Math.random() * 0xff) | 0;\n\t\t\tbuffer[3] = (Math.random() * 0xff) | 0;\n\t\t\tbuffer[4] = (Math.random() * 0xff) | 0;\n\t\t\tbuffer[5] = (Math.random() * 0xff) | 0;\n\n\n\t\t\treturn buffer;\n\n\t\t}\n\n\n\t\treturn null;\n\n\t};\n\n\tconst _encode_buffer = function(payload, headers, binary) {\n\n\t\tlet buffer         = null;\n\t\tlet data           = _JSON.encode({\n\t\t\theaders: headers,\n\t\t\tpayload: payload\n\t\t});\n\t\tlet mask           = false;\n\t\tlet mask_data      = null;\n\t\tlet payload_data   = null;\n\t\tlet payload_length = data.length;\n\t\tlet type           = this.type;\n\n\n\t\tif (type === Composite.TYPE.client) {\n\n\t\t\tmask      = true;\n\t\t\tmask_data = new Buffer(4);\n\n\t\t\tmask_data[0] = (Math.random() * 0xff) | 0;\n\t\t\tmask_data[1] = (Math.random() * 0xff) | 0;\n\t\t\tmask_data[2] = (Math.random() * 0xff) | 0;\n\t\t\tmask_data[3] = (Math.random() * 0xff) | 0;\n\n\t\t\tpayload_data = data.map(function(value, index) {\n\t\t\t\treturn value ^ mask_data[index % 4];\n\t\t\t});\n\n\t\t} else {\n\n\t\t\tmask         = false;\n\t\t\tmask_data    = new Buffer(4);\n\t\t\tpayload_data = data.map(function(value) {\n\t\t\t\treturn value;\n\t\t\t});\n\n\t\t}\n\n\n\t\t// 64 Bit Extended Payload Length\n\t\tif (payload_length > 0xffff) {\n\n\t\t\tlet lo = payload_length | 0;\n\t\t\tlet hi = (payload_length - lo) / 4294967296;\n\n\t\t\tbuffer = new Buffer((mask === true ? 14 : 10) + payload_length);\n\n\t\t\tbuffer[0] = 128 + (binary === true ? 0x02 : 0x01);\n\t\t\tbuffer[1] = (mask === true ? 128 : 0) + 127;\n\n\t\t\tbuffer[2] = (hi >> 24) & 0xff;\n\t\t\tbuffer[3] = (hi >> 16) & 0xff;\n\t\t\tbuffer[4] = (hi >>  8) & 0xff;\n\t\t\tbuffer[5] = (hi >>  0) & 0xff;\n\n\t\t\tbuffer[6] = (lo >> 24) & 0xff;\n\t\t\tbuffer[7] = (lo >> 16) & 0xff;\n\t\t\tbuffer[8] = (lo >>  8) & 0xff;\n\t\t\tbuffer[9] = (lo >>  0) & 0xff;\n\n\n\t\t\tif (mask === true) {\n\n\t\t\t\tmask_data.copy(buffer, 10);\n\t\t\t\tpayload_data.copy(buffer, 14);\n\n\t\t\t} else {\n\n\t\t\t\tpayload_data.copy(buffer, 10);\n\n\t\t\t}\n\n\n\t\t// 16 Bit Extended Payload Length\n\t\t} else if (payload_length > 125) {\n\n\t\t\tbuffer = new Buffer((mask === true ? 8 : 4) + payload_length);\n\n\t\t\tbuffer[0] = 128 + (binary === true ? 0x02 : 0x01);\n\t\t\tbuffer[1] = (mask === true ? 128 : 0) + 126;\n\n\t\t\tbuffer[2] = (payload_length >> 8) & 0xff;\n\t\t\tbuffer[3] = (payload_length >> 0) & 0xff;\n\n\n\t\t\tif (mask === true) {\n\n\t\t\t\tmask_data.copy(buffer, 4);\n\t\t\t\tpayload_data.copy(buffer, 8);\n\n\t\t\t} else {\n\n\t\t\t\tpayload_data.copy(buffer, 4);\n\n\t\t\t}\n\n\n\t\t// 7 Bit Payload Length\n\t\t} else {\n\n\t\t\tbuffer = new Buffer((mask === true ? 6 : 2) + payload_length);\n\n\t\t\tbuffer[0] = 128 + (binary === true ? 0x02 : 0x01);\n\t\t\tbuffer[1] = (mask === true ? 128 : 0) + payload_length;\n\n\n\t\t\tif (mask === true) {\n\n\t\t\t\tmask_data.copy(buffer, 2);\n\t\t\t\tpayload_data.copy(buffer, 6);\n\n\t\t\t} else {\n\n\t\t\t\tpayload_data.copy(buffer, 2);\n\n\t\t\t}\n\n\t\t}\n\n\n\t\treturn buffer;\n\n\t};\n\n\tconst _decode_buffer = function(buffer) {\n\n\t\tlet fragment = this.__fragment;\n\t\tlet chunk    = {\n\t\t\tbytes:   -1,\n\t\t\theaders: {},\n\t\t\tpayload: null\n\t\t};\n\n\n\t\tif (buffer.length <= 2) {\n\t\t\treturn chunk;\n\t\t}\n\n\n\t\tlet fin            = (buffer[0] & 128) === 128;\n\t\t// let rsv1        = (buffer[0] & 64) === 64;\n\t\t// let rsv2        = (buffer[0] & 32) === 32;\n\t\t// let rsv3        = (buffer[0] & 16) === 16;\n\t\tlet operator       = buffer[0] & 15;\n\t\tlet mask           = (buffer[1] & 128) === 128;\n\t\tlet mask_data      = new Buffer(4);\n\t\tlet payload_length = buffer[1] & 127;\n\t\tlet payload_data   = null;\n\n\t\tif (payload_length <= 125) {\n\n\t\t\tif (mask === true) {\n\t\t\t\tmask_data    = buffer.slice(2, 6);\n\t\t\t\tpayload_data = buffer.slice(6, 6 + payload_length);\n\t\t\t\tchunk.bytes  = 6 + payload_length;\n\t\t\t} else {\n\t\t\t\tmask_data    = null;\n\t\t\t\tpayload_data = buffer.slice(2, 2 + payload_length);\n\t\t\t\tchunk.bytes  = 2 + payload_length;\n\t\t\t}\n\n\t\t} else if (payload_length === 126) {\n\n\t\t\tpayload_length = (buffer[2] << 8) + buffer[3];\n\n\n\t\t\tif (payload_length > buffer.length) {\n\t\t\t\treturn chunk;\n\t\t\t}\n\n\n\t\t\tif (mask === true) {\n\t\t\t\tmask_data    = buffer.slice(4, 8);\n\t\t\t\tpayload_data = buffer.slice(8, 8 + payload_length);\n\t\t\t\tchunk.bytes  = 8 + payload_length;\n\t\t\t} else {\n\t\t\t\tmask_data    = null;\n\t\t\t\tpayload_data = buffer.slice(4, 4 + payload_length);\n\t\t\t\tchunk.bytes  = 4 + payload_length;\n\t\t\t}\n\n\t\t} else if (payload_length === 127) {\n\n\t\t\tlet hi = (buffer[2] * 0x1000000) + ((buffer[3] << 16) | (buffer[4] << 8) | buffer[5]);\n\t\t\tlet lo = (buffer[6] * 0x1000000) + ((buffer[7] << 16) | (buffer[8] << 8) | buffer[9]);\n\n\n\t\t\tpayload_length = (hi * 4294967296) + lo;\n\n\n\t\t\tif (payload_length > buffer.length) {\n\t\t\t\treturn chunk;\n\t\t\t}\n\n\n\t\t\tif (mask === true) {\n\t\t\t\tmask_data    = buffer.slice(10, 14);\n\t\t\t\tpayload_data = buffer.slice(14, 14 + payload_length);\n\t\t\t\tchunk.bytes  = 14 + payload_length;\n\t\t\t} else {\n\t\t\t\tmask_data    = null;\n\t\t\t\tpayload_data = buffer.slice(10, 10 + payload_length);\n\t\t\t\tchunk.bytes  = 10 + payload_length;\n\t\t\t}\n\n\t\t}\n\n\n\t\tif (mask_data !== null) {\n\n\t\t\tpayload_data = payload_data.map(function(value, index) {\n\t\t\t\treturn value ^ mask_data[index % 4];\n\t\t\t});\n\n\t\t}\n\n\n\t\t// 0: Continuation Frame (Fragmentation)\n\t\tif (operator === 0x00) {\n\n\t\t\tif (payload_data !== null) {\n\n\t\t\t\tlet payload = new Buffer(fragment.payload.length + payload_length);\n\n\t\t\t\tfragment.payload.copy(payload, 0);\n\t\t\t\tpayload_data.copy(payload, fragment.payload.length);\n\n\t\t\t\tfragment.payload = payload;\n\n\t\t\t}\n\n\n\t\t\tif (fin === true) {\n\n\t\t\t\tlet tmp0 = _JSON.decode(fragment.payload);\n\t\t\t\tif (tmp0 !== null) {\n\t\t\t\t\tchunk.headers = tmp0.headers || {};\n\t\t\t\t\tchunk.payload = tmp0.payload || null;\n\t\t\t\t}\n\n\t\t\t\tfragment.operator = 0x00;\n\t\t\t\tfragment.payload  = new Buffer(0);\n\n\t\t\t}\n\n\n\t\t// 1: Text Frame\n\t\t} else if (operator === 0x01) {\n\n\t\t\tif (fin === true) {\n\n\t\t\t\tlet tmp1 = _JSON.decode(payload_data);\n\t\t\t\tif (tmp1 !== null) {\n\t\t\t\t\tchunk.headers = tmp1.headers || {};\n\t\t\t\t\tchunk.payload = tmp1.payload || null;\n\t\t\t\t}\n\n\t\t\t} else if (payload_data !== null) {\n\n\t\t\t\tlet payload = new Buffer(fragment.payload.length + payload_length);\n\n\t\t\t\tfragment.payload.copy(payload, 0);\n\t\t\t\tpayload_data.copy(payload, fragment.payload.length);\n\n\t\t\t\tfragment.payload  = payload;\n\t\t\t\tfragment.operator = operator;\n\n\t\t\t}\n\n\n\t\t// 2: Binary Frame\n\t\t} else if (operator === 0x02) {\n\n\t\t\tif (fin === true) {\n\n\t\t\t\tlet tmp2 = _JSON.decode(payload_data);\n\t\t\t\tif (tmp2 !== null) {\n\t\t\t\t\tchunk.headers = tmp2.headers || {};\n\t\t\t\t\tchunk.payload = tmp2.payload || null;\n\t\t\t\t}\n\n\t\t\t} else if (payload_data !== null) {\n\n\t\t\t\tlet payload = new Buffer(fragment.payload.length + payload_length);\n\n\t\t\t\tfragment.payload.copy(payload, 0);\n\t\t\t\tpayload_data.copy(payload, fragment.payload.length);\n\n\t\t\t\tfragment.payload  = payload;\n\t\t\t\tfragment.operator = operator;\n\n\t\t\t}\n\n\n\t\t// 8: Connection Close\n\t\t} else if (operator === 0x08) {\n\n\t\t\tchunk.payload = this.close(Composite.STATUS.normal_closure);\n\n\n\t\t// 9: Ping Frame\n\t\t} else if (operator === 0x09) {\n\n\t\t\tchunk.payload = _on_ping_frame.call(this);\n\n\n\t\t// 10: Pong Frame\n\t\t} else if (operator === 0x0a) {\n\n\t\t\tchunk.payload = _on_pong_frame.call(this);\n\n\n\t\t// 3-7: Reserved Non-Control Frames, 11-15: Reserved Control Frames\n\t\t} else {\n\n\t\t\tchunk.payload = this.close(Composite.STATUS.protocol_error);\n\n\t\t}\n\n\n\t\treturn chunk;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(data) {\n\n\t\tlet settings = Object.assign({}, data);\n\n\n\t\tthis.type = lychee.enumof(Composite.TYPE, settings.type) ? settings.type : null;\n\n\t\tthis.__buffer   = new Buffer(0);\n\t\tthis.__fragment = { operator: 0x00, payload: new Buffer(0) };\n\t\tthis.__isClosed = false;\n\n\n\t\tif (lychee.debug === true) {\n\n\t\t\tif (this.type === null) {\n\t\t\t\tconsole.error('lychee.net.protocol.WS: Invalid (lychee.net.protocol.WS.TYPE) type.');\n\t\t\t}\n\n\t\t}\n\n\t\tsettings = null;\n\n\t};\n\n\n\t// Composite.FRAMESIZE = 32768; // 32kB\n\tComposite.FRAMESIZE = 0x800000; // 8MiB\n\n\n\tComposite.STATUS = {\n\n\t\t// IESG_HYBI\n\t\tnormal_closure:  1000,\n\t\tprotocol_error:  1002,\n\t\tmessage_too_big: 1009\n\n\t\t// IESG_HYBI\n\t\t// going_away:         1001,\n\t\t// unsupported_data:   1003,\n\t\t// no_status_received: 1005,\n\t\t// abnormal_closure:   1006,\n\t\t// invalid_payload:    1007,\n\t\t// policy_violation:   1008,\n\t\t// missing_extension:  1010,\n\t\t// internal_error:     1011,\n\n\t\t// IESG_HYBI Current\n\t\t// service_restart:    1012,\n\t\t// service_overload:   1013,\n\n\t\t// IESG_HYBI\n\t\t// tls_handshake:      1015\n\n\t};\n\n\n\tComposite.TYPE = {\n\t\t// 'default': 0, (deactivated)\n\t\t'client': 1,\n\t\t'remote': 2\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\treturn {\n\t\t\t\t'constructor': 'lychee.net.protocol.WS',\n\t\t\t\t'arguments':   [ this.type ],\n\t\t\t\t'blob':        null\n\t\t\t};\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * PROTOCOL API\n\t\t */\n\n\t\tsend: function(payload, headers, binary) {\n\n\t\t\tpayload = payload instanceof Buffer ? payload : null;\n\t\t\theaders = headers instanceof Object ? headers : null;\n\t\t\tbinary  = binary === true;\n\n\n\t\t\tif (payload !== null) {\n\n\t\t\t\tif (this.__isClosed === false) {\n\t\t\t\t\treturn _encode_buffer.call(this, payload, headers, binary);\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\t\treceive: function(blob) {\n\n\t\t\tblob = blob instanceof Buffer ? blob : null;\n\n\n\t\t\tlet chunks = [];\n\n\n\t\t\tif (blob !== null) {\n\n\t\t\t\tif (blob.length > Composite.FRAMESIZE) {\n\n\t\t\t\t\tchunks.push({\n\t\t\t\t\t\tpayload: this.close(Composite.STATUS.message_too_big)\n\t\t\t\t\t});\n\n\t\t\t\t} else if (this.__isClosed === false) {\n\n\t\t\t\t\tlet buf = this.__buffer;\n\t\t\t\t\tlet tmp = new Buffer(buf.length + blob.length);\n\n\n\t\t\t\t\tbuf.copy(tmp);\n\t\t\t\t\tblob.copy(tmp, buf.length);\n\t\t\t\t\tbuf = tmp;\n\n\n\t\t\t\t\tlet chunk = _decode_buffer.call(this, buf);\n\n\t\t\t\t\twhile (chunk.bytes !== -1) {\n\n\t\t\t\t\t\tif (chunk.payload !== null) {\n\t\t\t\t\t\t\tchunks.push(chunk);\n\t\t\t\t\t\t}\n\n\n\t\t\t\t\t\tif (buf.length - chunk.bytes > 0) {\n\n\t\t\t\t\t\t\ttmp = new Buffer(buf.length - chunk.bytes);\n\t\t\t\t\t\t\tbuf.copy(tmp, 0, chunk.bytes);\n\t\t\t\t\t\t\tbuf = tmp;\n\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tbuf = new Buffer(0);\n\t\t\t\t\t\t}\n\n\n\t\t\t\t\t\tchunk = null;\n\t\t\t\t\t\tchunk = _decode_buffer.call(this, buf);\n\n\t\t\t\t\t}\n\n\n\t\t\t\t\tthis.__buffer = buf;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn chunks;\n\n\t\t},\n\n\t\tclose: function(status) {\n\n\t\t\tstatus = typeof status === 'number' ? status : Composite.STATUS.normal_closure;\n\n\n\t\t\tif (this.__isClosed === false) {\n\n\t\t\t\tlet buffer = new Buffer(4);\n\n\t\t\t\tbuffer[0]  = 128 + 0x08;\n\t\t\t\tbuffer[1]  =   0 + 0x02;\n\n\t\t\t\tbuffer.write(String.fromCharCode((status >> 8) & 0xff) + String.fromCharCode((status >> 0) & 0xff), 2, 'binary');\n\n\t\t\t\tthis.__isClosed = true;\n\n\n\t\t\t\treturn buffer;\n\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tping: function() {\n\n\t\t\tlet buffer = _on_pong_frame.call(this);\n\t\t\tif (buffer !== null) {\n\t\t\t\treturn buffer;\n\t\t\t}\n\n\n\t\t\treturn null;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.net.client.Debugger":{"constructor":"lychee.Definition","arguments":["lychee.net.client.Debugger"],"blob":{"attaches":{},"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\n\n\n\t/*\n\t * HELPERS\n\t */\n\n\tconst _resolve_reference = function(identifier) {\n\n\t\tlet pointer = this;\n\n\t\tlet ns = identifier.split('.');\n\t\tfor (let n = 0, l = ns.length; n < l; n++) {\n\n\t\t\tlet name = ns[n];\n\n\t\t\tif (pointer[name] !== undefined) {\n\t\t\t\tpointer = pointer[name];\n\t\t\t} else {\n\t\t\t\tpointer = null;\n\t\t\t\tbreak;\n\t\t\t}\n\n\t\t}\n\n\t\treturn pointer;\n\n\t};\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(client) {\n\n\t\t_Service.call(this, 'debugger', client, _Service.TYPE.client);\n\n\n\n\t\t/*\n\t\t * INITIALIZATION\n\t\t */\n\n\t\tthis.bind('define', function(data) {\n\n\t\t\tif (typeof data.construtor === 'string' || typeof data.reference === 'string') {\n\n\t\t\t\tlet environment = (lychee.environment !== null ? lychee.environment        : null);\n\t\t\t\tlet value       = false;\n\t\t\t\tlet definition  = lychee.deserialize(data);\n\n\t\t\t\tif (environment !== null) {\n\t\t\t\t\tvalue = environment.define(definition);\n\t\t\t\t}\n\n\n\t\t\t\tif (this.tunnel !== null) {\n\n\t\t\t\t\tthis.tunnel.send({\n\t\t\t\t\t\ttid:   data.receiver,\n\t\t\t\t\t\tvalue: value === true\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid:    'debugger',\n\t\t\t\t\t\tevent: 'define-value'\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('execute', function(data) {\n\n\t\t\tif (typeof data.reference === 'string') {\n\n\t\t\t\tlet scope    = (lychee.environment !== null ? lychee.environment.global : global);\n\t\t\t\tlet value    = null;\n\t\t\t\tlet instance = _resolve_reference.call(scope, data.reference);\n\t\t\t\tlet bindargs = [].slice.call(data.arguments, 0).map(function(value) {\n\n\t\t\t\t\tif (typeof value === 'string' && value.charAt(0) === '#') {\n\n\t\t\t\t\t\tif (lychee.debug === true) {\n\t\t\t\t\t\t\tconsole.log('lychee.net.client.Debugger: Injecting \"' + value + '\" from global');\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tlet resolved_injection = _resolve_reference.call(scope, value.substr(1));\n\t\t\t\t\t\tif (resolved_injection !== null) {\n\t\t\t\t\t\t\tvalue = null;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t}\n\n\t\t\t\t\treturn value;\n\n\t\t\t\t});\n\n\n\t\t\t\tif (typeof instance === 'object') {\n\n\t\t\t\t\tvalue = lychee.serialize(instance);\n\n\t\t\t\t} else if (typeof resolved === 'function') {\n\n\t\t\t\t\tvalue = instance(bindargs);\n\n\t\t\t\t}\n\n\n\t\t\t\tif (value === undefined) {\n\t\t\t\t\tvalue = null;\n\t\t\t\t}\n\n\n\t\t\t\tif (this.tunnel !== null) {\n\n\t\t\t\t\tthis.tunnel.send({\n\t\t\t\t\t\ttid:   data.receiver,\n\t\t\t\t\t\tvalue: value\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid:    'debugger',\n\t\t\t\t\t\tevent: 'execute-value'\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('expose', function(data) {\n\n\t\t\tif (typeof data.reference === 'string') {\n\n\t\t\t\tlet scope       = (lychee.environment !== null ? lychee.environment.global : global);\n\t\t\t\tlet environment = _resolve_reference.call(scope, data.reference);\n\t\t\t\tlet value       = lychee.Debugger.expose(environment);\n\n\t\t\t\tif (this.tunnel !== null) {\n\n\t\t\t\t\tthis.tunnel.send({\n\t\t\t\t\t\ttid:   data.receiver,\n\t\t\t\t\t\tvalue: value\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid:    'debugger',\n\t\t\t\t\t\tevent: 'expose-value'\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, this);\n\n\t\tthis.bind('snapshot', function(data) {\n\n\t\t\tif (typeof data.reference === 'string') {\n\n\t\t\t\tlet scope    = (lychee.environment !== null ? lychee.environment.global : global);\n\t\t\t\tlet instance = _resolve_reference.call(scope, data.reference);\n\t\t\t\tlet value    = lychee.serialize(instance);\n\n\t\t\t\tif (this.tunnel !== null) {\n\n\t\t\t\t\tthis.tunnel.send({\n\t\t\t\t\t\ttid:   data.receiver,\n\t\t\t\t\t\tvalue: value\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid:    'debugger',\n\t\t\t\t\t\tevent: 'snapshot-value'\n\t\t\t\t\t});\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}, this);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.client.Debugger';\n\t\t\tdata['arguments']   = [ data['arguments'][1] ];\n\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * DEBUGGER API\n\t\t */\n\n\t\treport: function(message, blob) {\n\n\t\t\tmessage = typeof message === 'string' ? message : null;\n\t\t\tblob    = blob instanceof Object      ? blob    : null;\n\n\n\t\t\tif (message !== null) {\n\n\t\t\t\tlet tunnel = this.tunnel;\n\t\t\t\tif (tunnel !== null) {\n\n\t\t\t\t\ttunnel.send({\n\t\t\t\t\t\tmessage: message,\n\t\t\t\t\t\tblob:    blob\n\t\t\t\t\t}, {\n\t\t\t\t\t\tid:    this.id,\n\t\t\t\t\t\tevent: 'error'\n\t\t\t\t\t});\n\n\t\t\t\t\treturn true;\n\n\t\t\t\t}\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tdefine: function(tid, data) {\n\n\t\t\ttid  = typeof tid === 'string' ? tid  : null;\n\t\t\tdata = data instanceof Object  ? data : null;\n\n\n\t\t\tif (data !== null && this.tunnel !== null) {\n\n\t\t\t\tthis.tunnel.send({\n\t\t\t\t\ttid:         tid,\n\t\t\t\t\tconstructor: data.constructor || null,\n\t\t\t\t\treference:   data.reference   || null,\n\t\t\t\t\targuments:   data.arguments   || null\n\t\t\t\t}, {\n\t\t\t\t\tid:    'debugger',\n\t\t\t\t\tevent: 'define'\n\t\t\t\t});\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\texecute: function(tid, data) {\n\n\t\t\ttid  = typeof tid === 'string' ? tid  : null;\n\t\t\tdata = data instanceof Object  ? data : null;\n\n\n\t\t\tif (data !== null && this.tunnel !== null) {\n\n\t\t\t\tthis.tunnel.send({\n\t\t\t\t\ttid:       tid,\n\t\t\t\t\treference: data.reference || null,\n\t\t\t\t\targuments: data.arguments || null\n\t\t\t\t}, {\n\t\t\t\t\tid:    'debugger',\n\t\t\t\t\tevent: 'execute'\n\t\t\t\t});\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\texpose: function(tid, data) {\n\n\t\t\ttid  = typeof tid === 'string' ? tid  : null;\n\t\t\tdata = data instanceof Object  ? data : null;\n\n\n\t\t\tif (this.tunnel !== null) {\n\n\t\t\t\tthis.tunnel.send({\n\t\t\t\t\ttid:       tid,\n\t\t\t\t\treference: data.reference || null\n\t\t\t\t}, {\n\t\t\t\t\tid:    'debugger',\n\t\t\t\t\tevent: 'expose'\n\t\t\t\t});\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t},\n\n\t\tsnapshot: function(tid, data) {\n\n\t\t\ttid  = typeof tid === 'string' ? tid  : null;\n\t\t\tdata = data instanceof Object  ? data : null;\n\n\n\t\t\tif (this.tunnel !== null) {\n\n\t\t\t\tthis.tunnel.send({\n\t\t\t\t\ttid:       tid,\n\t\t\t\t\treference: data.reference || null\n\t\t\t\t}, {\n\t\t\t\t\tid:    'debugger',\n\t\t\t\t\tevent: 'snapshot'\n\t\t\t\t});\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.net.client.Stash":{"constructor":"lychee.Definition","arguments":["lychee.net.client.Stash"],"blob":{"attaches":{},"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(client) {\n\n\t\t_Service.call(this, 'stash', client, _Service.TYPE.client);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.client.Stash';\n\t\t\tdata['arguments']   = [ data['arguments'][1] ];\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsync: function(assets) {\n\n\t\t\tassets = assets instanceof Object ? assets : null;\n\n\n\t\t\tif (assets !== null && this.tunnel !== null) {\n\n\t\t\t\tlet data = {};\n\n\t\t\t\tfor (let id in assets) {\n\t\t\t\t\tdata[id] = lychee.serialize(assets[id]);\n\t\t\t\t}\n\n\n\t\t\t\tthis.tunnel.send({\n\t\t\t\t\ttimestamp: Date.now(),\n\t\t\t\t\tassets:    data\n\t\t\t\t}, {\n\t\t\t\t\tid:    'stash',\n\t\t\t\t\tevent: 'sync'\n\t\t\t\t});\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}},"lychee.net.client.Storage":{"constructor":"lychee.Definition","arguments":["lychee.net.client.Storage"],"blob":{"attaches":{},"includes":["lychee.net.Service"],"exports":"function (lychee, global, attachments) {\n\n\tconst _Service = lychee.import('lychee.net.Service');\n\n\n\n\t/*\n\t * IMPLEMENTATION\n\t */\n\n\tlet Composite = function(client) {\n\n\t\t_Service.call(this, 'storage', client, _Service.TYPE.client);\n\n\t};\n\n\n\tComposite.prototype = {\n\n\t\t/*\n\t\t * ENTITY API\n\t\t */\n\n\t\t// deserialize: function(blob) {},\n\n\t\tserialize: function() {\n\n\t\t\tlet data = _Service.prototype.serialize.call(this);\n\t\t\tdata['constructor'] = 'lychee.net.client.Storage';\n\t\t\tdata['arguments']   = [ data['arguments'][1] ];\n\n\n\t\t\treturn data;\n\n\t\t},\n\n\n\n\t\t/*\n\t\t * CUSTOM API\n\t\t */\n\n\t\tsync: function(objects) {\n\n\t\t\tobjects = objects instanceof Array ? objects : null;\n\n\n\t\t\tif (objects !== null && this.tunnel !== null) {\n\n\t\t\t\tthis.tunnel.send({\n\t\t\t\t\ttimestamp: Date.now(),\n\t\t\t\t\tobjects:   objects\n\t\t\t\t}, {\n\t\t\t\t\tid:    'storage',\n\t\t\t\t\tevent: 'sync'\n\t\t\t\t});\n\n\n\t\t\t\treturn true;\n\n\t\t\t}\n\n\n\t\t\treturn false;\n\n\t\t}\n\n\t};\n\n\n\treturn Composite;\n\n}"}}},"features":{"process":{"stdin":{"on":"function"}},"require":"function","setInterval":"function"}}});
	if (environment !== null) {
		environment.init();
	}

	lychee.ENVIRONMENTS['/libraries/harvester/dist'] = environment;

})(lychee, typeof global !== 'undefined' ? global : this);



lychee.inject(lychee.ENVIRONMENTS["/libraries/harvester/dist"]);



