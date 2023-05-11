
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execSync } from 'child_process';

export function createTempDirAndBuildApp(gitUrl: string, branchName: string) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'my-app-'));
  console.log(`Created temporary directory: ${tempDir}`);

  try {
    // Change the current working directory to the temporary directory
    process.chdir(tempDir);

    // Clone the Git repository and checkout the specified branch
    execSync(`git clone ${gitUrl} .`);
    execSync(`git checkout ${branchName}`);

    // Build the application
    execSync('npm install');
    execSync('npm run build');
    console.log('Application built successfully!');
  } catch (err) {
    console.error(err);
  }
}




