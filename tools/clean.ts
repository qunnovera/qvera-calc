import * as fs from 'fs';
import path from 'path';

const projectRoot = path.join(__dirname, './..');

// clean out dir and files
const folders = ['dist', 'npm-local'];
const files = ['tsconfig.tsbuildinfo', 'tsconfig.prod.tsbuildinfo'];

for(let f of folders){
    try{
        fs.rmSync(path.join(projectRoot, f), { recursive: true, force: true });
    }catch(err){}
}

for(let f of files){
    try{
        fs.rmSync(path.join(projectRoot, f));
    }catch(err){}
}

