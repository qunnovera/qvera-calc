import * as fs from 'fs';
import path from 'path';

const projectRoot = path.join(__dirname, './..');

// clean out dir and files
fs.rmSync(path.join(projectRoot, 'dist'), { recursive: true, force: true });
fs.unlinkSync(path.join(projectRoot, 'tsconfig.tsbuildinfo'));
