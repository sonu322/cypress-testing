const fs = require("fs");
const { execSync } = require('child_process');
const path = require('path');

export function buildFromGitBranch(string branchName) {
    const folder = path.dirname(path.dirname(__dirname));
    console.log(folder);
    const branch = "master";
    const name  = `${folder}\\lxp-${branch}`;
    // const tempDir = fs.mkdtempSync('./test');
    // process.chdir(tempDir);
    // fs.mkdirSync
    // create a new directory with the name of the branch
    if (fs.existsSync(name)) {
      console.log("deleting directory");
      fs.rmSync(name, { recursive: true });
    }
    fs.mkdirSync(name);
    // change directory to the new directory
    process.chdir(name);
  
    // clone the repository
    execSync(`git clone https://github.com/Optimizory/lxp-cloud.git .`);
    console.log("git clone done");
    // checkout the specified branch
    execSync(`git checkout ${branch}`);
    console.log("git checkout done");
    execSync(`npm install`);
    console.log("npm install done");
    // build the app using the specified command
    
    execSync('npm run build');
    // change to dir folder
    process.chdir('dist');
    // delete file
    fs.unlinkSync('original-atlassian-connect.json');
    console.log("original-atlassian-connect.json deleted");
    console.log(`Built app from branch in directory ${name}`);
   // console.log(`Built app from branch ${branchName} in directory ${tempDir}`);
  }