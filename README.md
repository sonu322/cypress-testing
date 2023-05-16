# Links Explorer - a plugin for Jira Cloud

- Requires ngrok, yarn, node.

#### For local plugin development

- First start the server to serve the plugin descriptor and other static files using the command below:
  - `yarn start` or `npm run start`
- In another tab, run the below command to open the ngrok tunnel and update the plugin descriptor file:
  - `yarn serve` or `npm run serve`
  - The above command will display the app descriptor URL, copy this URL and open it in the browser first because `ngrok` display a warning before serving any content for the first time. In the warning page, click on `Visit Page` link to remove the warning from subsequent visits.
- Now copy the app descriptor URL from the above step and install the plugin in Jira UPM using that URL.

##### For Lxp-cdk development
1. install all dependence in lx-cdk derectory `npm install`
2. install jq in machine 
   for windows: https://stedolan.github.io/jq/download/
      or install from chocolatey: https://chocolatey.org/packages/jq
       cmd command to install chocalatey : `@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command " [System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"`
      make sure to run cmd as administrator
      cmd command to install jq using chocolatey : `choco install jq`
3. Run lxpbuild.sh script to build the all version of lxp from versions.json file `./lxpbuild.sh` 
   in lxp-cloud/lxp-cdk/lib/scripts directory
4. run cdk diff to see the changes `npx cdk diff`
5. run cdk synth to synthesize the changes `npx cdk synth`
6. run cdk deploy to deploy the changes `npx cdk deploy`

