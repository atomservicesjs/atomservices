const shell = require('shelljs');

shell.rm('-rf', '.nyc_output');
shell.rm('-rf', 'typings');

// REMOVE OUTPUT DIRECTORY
const outDir = require('../tsconfig.json').compilerOptions.outDir;
shell.rm('-rf', outDir);
