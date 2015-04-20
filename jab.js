var glob = require("glob");
var extend = require('util')._extend;
require('array-sugar');
var path = require('path');
var packageJSON = require('../../package.json');

module.exports = function jspmAureliaBundler(passedOpts) {
	var base = packageJSON.jspm.directories.baseURL;
	var packagesDir = packageJSON.jspm.directories.packages.split('/')[1];
	var configFile = path.relative(base, packageJSON.jspm.configFile);
	var target = 'build.js';
	var options = {	//default
		globJs: {ignore: [packagesDir + '/**', target, configFile], root: base, cwd: base},
		globHtml: {ignore: [packagesDir + '/**', 'index.html'], root: base, cwd: base},
		baseFolder: base,
		target: target
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

	var packages = Object.keys(builder.loader.map).filter(function(pckgName) {
		return ignorePackages.indexOf(pckgName) === -1;
	}).join(' + ');

	glob("**/*.js", options.globJs, function(er, jsFiles) {
		jsFiles.forEach(function(file) {
			packages += ' + ' + file.substr(0, file.length - 3);
		});

		glob('**/*.html', options.globHtml, function(err, htmlFiles) {
			htmlFiles.forEach(function(file) {
				packages += ' + ' + file + '!text';
			});

			console.log('bundling ', packages);

			jspm.bundle(packages, path.join(), {minify: true, inject: true}).then(function() {
				console.log('done');
			});
		});


	});
};

