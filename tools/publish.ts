import * as child_process from 'child_process';
import path from 'path';

const projectRoot = path.join(__dirname, './..');

// clean
child_process.execSync(
  `ts-node tools/clean.ts`, 
  {
    cwd: projectRoot, 
    stdio:[0,1,2]
  }
);

// build
child_process.execSync(
  `ts-node tools/build.ts`, 
  {
    cwd: projectRoot, 
    stdio:[0,1,2]
  }
);

// publish
child_process.execSync(
  `npm publish`, 
  {
    cwd: path.join(projectRoot, 'dist'), 
    stdio:[0,1,2]
  }
);