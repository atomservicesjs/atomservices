const shell = require('shelljs');

shell.rm('-rf', '.nyc_output');
shell.rm('-rf', './lib/**/*.spec.js');
shell.rm('-rf', './lib/**/*.spec.js.map');

shell.rm('-rf', './typings/**/*.spec.d.ts');
