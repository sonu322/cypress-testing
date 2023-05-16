const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

function lxpbuilds() {
    
      const versionfile = fs.readFileSync('C:/Users/pulkit/repos/lxp-cloud/lxp-cdk/lib/resource/version.json', 'utf8');
      console.log(versionfile);
      const versionjson = JSON.parse(versionfile);
    
      const buildDirectory = path.resolve('C:/Users/pulkit/Desktop/lxp-c');
        
        for(const ver of versionjson){
         // if(ver.build_sync === false){
          const buildDirectory = path.resolve('C:/Users/pulkit/Desktop/lxp-c');
          process.chdir(buildDirectory);
    
    
          const verdirectory = path.join(buildDirectory, ver.hostname);
          console.log(verdirectory);
          childProcess.execSync(`mkdir ${verdirectory}`);
          console.log('directory created');
          // change to verdirectory
          process.chdir(verdirectory);
          childProcess.execSync(`git clone https://github.com/Optimizory/lxp-cloud.git`);
          console.log('cloned');
          //childProcess.execSync(`cd lxp-cloud`);
          process.chdir('lxp-cloud');
          console.log('changed directory');
          childProcess.execSync(`git checkout ${ver.git_tag_name}`);
    
    
          childProcess.execSync(`npm install && npm run build`);
          console.log('build done');
          // create a file hello.txt
          childProcess.execSync(`touch hello.txt`);
          childProcess.execSync(`cd dist`);
          childProcess.execSync(`touch hello.txt`);
          console.log('changed directory');
          // delete a file in dist folder
          childProcess.execSync(`rm -rf original-atlassian-connect.json`);
          console.log('deleted file');
         // }
        }
        console.log(buildDirectory);

}
lxpbuilds();



