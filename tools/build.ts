import * as child_process from 'child_process';
import path from 'path';
import * as fs from 'fs';

const projectRoot = path.join(__dirname, './..');

// build project
child_process.execSync(
  `tsc -b`, 
  {
    cwd: projectRoot, 
    stdio:[0,1,2]
  }
);

// copy required files
const filesToCopy = [
  'package.json',
  'readme.md'
];
const outDir = path.join(projectRoot, 'dist');

filesToCopy.forEach(file => {
  fs.copyFileSync(path.join(projectRoot, file), path.join(outDir, file));
});

