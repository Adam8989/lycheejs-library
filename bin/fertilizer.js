#!/usr/bin/env node


const _child_process = require('child_process');
const _fs            = require('fs');
const _path          = require('path');
const _CHILDREN      = [];
const _ROOT          = _path.resolve(__dirname, '../');





const lychee = require(_ROOT + '/build/node/fertilizer.js')(_ROOT);



/*
 * USAGE
 */

const _print_help = function() {

	let targets = _fs.readdirSync(_ROOT + '/build').sort();

	let libraries = [].sort().filter(function(value) {
		return _fs.existsSync(_ROOT + '/libraries/' + value + '/lychee.pkg');
	}).map(function(value) {
		return '/libraries/' + value;
	});

	let projects = [].sort().filter(function(value) {
		return _fs.existsSync(_ROOT + '/projects/' + value + '/lychee.pkg');
	}).map(function(value) {
		return '/projects/' + value;
	});


	console.log('                                                              ');
	console.info('lychee.js ' + lychee.VERSION + ' Fertilizer');
	console.log('                                                              ');
	console.log('Usage: lycheejs-fertilizer [Target] [Library/Project] [Flag]  ');
	console.log('                                                              ');
	console.log('                                                              ');
	console.log('Available Fertilizers:                                        ');
	console.log('                                                              ');
	targets.forEach(function(target) {
		let diff = ('                                                          ').substr(target.length);
		console.log('    ' + target + diff);
	});
	console.log('                                                              ');
	console.log('Available Libraries:                                          ');
	console.log('                                                              ');
	libraries.forEach(function(library) {
		let diff = ('                                                          ').substr(library.length);
		console.log('    ' + library + diff);
	});
	console.log('                                                              ');
	console.log('Available Projects:                                           ');
	console.log('                                                              ');
	projects.forEach(function(project) {
		let diff = ('                                                          ').substr(project.length);
		console.log('    ' + project + diff);
	});
	console.log('                                                              ');
	console.log('Available Flags:                                              ');
	console.log('                                                              ');
	console.log('   --debug          Debug Mode with debug messages            ');
	console.log('   --sandbox        Sandbox Mode without software bots        ');
	console.log('                                                              ');
	console.log('Examples:                                                     ');
	console.log('                                                              ');
	console.log('    lycheejs-fertilizer html-nwjs/main /projects/boilerplate; ');
	console.log('    lycheejs-fertilizer node/main /projects/boilerplate;      ');
	console.log('    lycheejs-fertilizer auto /libraries/lychee;               ');
	console.log('                                                              ');

};

const _bootup = function(settings) {

	console.info('BOOTUP (' + process.pid + ')');

	let environment = new lychee.Environment({
		id:       'fertilizer',
		debug:    settings.debug === true,
		sandbox:  settings.debug === true ? false : settings.sandbox === true,
		build:    'fertilizer.Main',
		timeout:  3000,
		packages: [
			new lychee.Package('lychee',     '/libraries/lychee/lychee.pkg'),
			new lychee.Package('fertilizer', '/libraries/fertilizer/lychee.pkg')
		],
		tags:     {
			platform: [ 'node' ]
		}
	});


	lychee.setEnvironment(environment);


	environment.init(function(sandbox) {

		if (sandbox !== null) {

			let lychee     = sandbox.lychee;
			let fertilizer = sandbox.fertilizer;


			// Show more debug messages
			lychee.debug = true;


			// This allows using #MAIN in JSON files
			sandbox.MAIN = new fertilizer.Main(settings);
			sandbox.MAIN.bind('destroy', function(code) {
				process.exit(code);
			});

			sandbox.MAIN.init();


			const _on_process_error = function() {
				sandbox.MAIN.destroy();
				process.exit(1);
			};

			process.on('SIGHUP',  _on_process_error);
			process.on('SIGINT',  _on_process_error);
			process.on('SIGQUIT', _on_process_error);
			process.on('SIGABRT', _on_process_error);
			process.on('SIGTERM', _on_process_error);
			process.on('error',   _on_process_error);
			process.on('exit',    function() {});


			new lychee.Input({
				key:         true,
				keymodifier: true
			}).bind('escape', function() {

				console.warn('fertilizer: [ESC] pressed, exiting ...');
				sandbox.MAIN.destroy();

			}, this);

		} else {

			console.error('BOOTUP FAILURE');

			process.exit(1);

		}

	});

};

const _spawn = function(program, args) {

	let stdout = _fs.openSync('/dev/null', 'a');
	let stderr = _fs.openSync('/dev/null', 'a');
	let child  = _child_process.spawn(program, args, {
		detached: true,
		stdio: [ 'ignore', stdout, stderr ]
	});

	_CHILDREN.push(child.pid);

	child.unref();
	child.on('exit', function(code) {

		let pid = this.pid;


		if (code === 0) {
			console.info('SUCCESS (' + pid + ') ("' + args[2] + '" | "' + args[1] + '")');
		} else {
			console.error('FAILURE (' + pid + ') ("' + args[2] + '" | "' + args[1] + '")');
		}


		let index = _CHILDREN.indexOf(pid);
		if (index !== -1) {
			_CHILDREN.splice(index, 1);
		}


		if (_CHILDREN.length === 0) {
			process.exit(0);
		}

	});

};



const _SETTINGS = (function() {

	let args     = process.argv.slice(2).filter(val => val !== '');
	let prog     = process.argv[0];
	let settings = {
		project:     null,
		identifier:  null,
		environment: null,
		debug:       false,
		sandbox:     false,
		auto:        false
	};


	let identifier   = args.find(val => /^([a-z-]+)\/([a-z]+)$/g.test(val)) || args.find(val => val === 'auto');
	let project      = args.find(val => /^\/(libraries|projects)\/([A-Za-z0-9-_\/]+)$/g.test(val));
	let debug_flag   = args.find(val => /--([debug]{5})/g.test(val));
	let sandbox_flag = args.find(val => /--([sandbox]{7})/g.test(val));


	if (identifier === 'auto' && project !== undefined && _fs.existsSync(_ROOT + project) === true) {

		settings.auto = true;


		let json = null;

		try {
			json = JSON.parse(_fs.readFileSync(_ROOT + project + '/lychee.pkg', 'utf8'));
		} catch (err) {
			json = null;
		}


		if (json !== null) {

			if (json.build instanceof Object && json.build.environments instanceof Object) {

				Object.keys(json.build.environments).forEach(function(identifier) {

					if (identifier !== 'auto') {
						_spawn(prog, [ process.argv[1], identifier, project ]);
					}

				});

			}

		} else {

			settings.auto       = false;
			settings.project    = project;
			settings.identifier = 'auto';

		}

	} else if (identifier !== undefined && project !== undefined && _fs.existsSync(_ROOT + project) === true) {

		settings.project = project;


		let json = null;

		try {
			json = JSON.parse(_fs.readFileSync(_ROOT + project + '/lychee.pkg', 'utf8'));
		} catch (err) {
			json = null;
		}


		if (json !== null) {

			if (json.build instanceof Object && json.build.environments instanceof Object) {

				if (json.build.environments[identifier] instanceof Object) {
					settings.identifier  = identifier;
					settings.environment = json.build.environments[identifier];
				}

			}

		}

	}


	if (debug_flag !== undefined) {
		settings.debug = true;
	}

	if (sandbox_flag !== undefined) {
		settings.sandbox = true;
	}


	return settings;

})();

(function(settings) {

	if (settings.auto === true) return;



	/*
	 * IMPLEMENTATION
	 */

	let has_project     = settings.project !== null;
	let has_identifier  = settings.identifier !== null;
	let has_environment = settings.environment !== null;


	if (has_project && has_identifier && has_environment) {

		_bootup({
			debug:      settings.debug   === true,
			sandbox:    settings.sandbox === true,
			project:    settings.project,
			identifier: settings.identifier,
			settings:   settings.environment
		});

	} else if (has_project) {

		_bootup({
			debug:      settings.debug   === true,
			sandbox:    settings.sandbox === true,
			project:    settings.project,
			identifier: null,
			settings:   null
		});

	} else {

		console.error('PARAMETERS FAILURE');

		_print_help();

		process.exit(1);

	}

})(_SETTINGS);
