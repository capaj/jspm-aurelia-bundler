var glob = require("glob");
var extend = require('util')._extend;

module.exports = function jspmAureliaBundler(passedOpts) {
	var options = {	//default
		glob: {ignore: ['jspm_packages/**', 'build.js', 'config.js'], root: './public/', cwd: './public/'}
	};
	extend(options, passedOpts);

	var jspm = new require('jspm');
	var builder = jspm.Builder();

	var ignorePackages = [
		'traceur',
		'traceur-runtime',
		'babel',
		'babel-runtime'
	];

	var packages = Object.keys(builder.loader.map).filter(function (pckgName){
		return ignorePackages.indexOf(pckgName) === -1;
	}).join(' + ');

	glob("**/*.js", options.glob, function (er, files) {
		if (files) {
			files.forEach(function (file){
				packages += ' + ' + file;
			});
		}

		console.log('bundling ', packages);

		jspm.bundle(packages, 'public/build.js', {minify: true, inject: true}).then(function() {
			console.log('done');
		});
	});
};

