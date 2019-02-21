const shell = require('shelljs');

shell.rm('-rf', '.nyc_output');
shell.rm('-rf', './lib/**/*.spec.js');
shell.rm('-rf', './lib/**/*.spec.js.map');
