var glob = require("glob");
var extend = require('util')._extend;
require('array-sugar');

module.exports = function jspmAureliaBundler(passedOpts) {
	var options = {	//default
		globJs: {ignore: ['jspm_packages/**', 'build.js', 'config.js'], root: './public/', cwd: './public/'},
		globHtml: {ignore: ['jspm_packages/**', 'index.html'], root: './public/', cwd: './public/'}
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

			jspm.bundle(packages, 'public/build.js', {minify: true, inject: true}).then(function() {
				console.log('done');
			});
		});


	});
};

