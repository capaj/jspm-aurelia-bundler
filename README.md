#jspm-aurelia-bundler

early release, not configurable yet-works only with default JSPM config(jspm_packages folder and config.js and public folder not renamed).

Run with node by calling `node jab-run`, make sure you have got text plugin for systemJS installed via JSPM.

HTML files are not bundled yet, because Aurelia doesn't use systemjs text plugin to load the files, so I will need to investigate it further.