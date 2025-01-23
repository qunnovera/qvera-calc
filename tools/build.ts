import * as child_process from 'child_process';
import path from 'path';
import * as fs from 'fs';

const projectRoot = path.join(__dirname, './..');

const isProd =  process.argv[2] && process.argv[2] == "prod";
let tsFile = '';
let outDir = path.join(projectRoot, 'npm-local/node_modules/@sharadt/numfy');
// prod build
if(isProd){
  outDir = path.join(projectRoot, 'dist');
  tsFile += ' -f tsconfig.prod.json';
}


// build project
child_process.execSync(
  `tsc -b ${tsFile}`, 
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

filesToCopy.forEach(file => {
  fs.copyFileSync(path.join(projectRoot, file), path.join(outDir, file));
});

