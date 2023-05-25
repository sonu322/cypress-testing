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

1. Install all dependencies in the lxp-cdk directory:
   `npm install`
2. Install jq on your machine. Choose one of the following methods based on your operating system:
   For Windows:
   Download `jq` from the official website: https://stedolan.github.io/jq/download/
   Alternatively, install `jq` using Chocolatey package manager: https://chocolatey.org/packages/jq Or, run the following commands in an elevated PowerShell session:
   To install Chocolatey using PowerShell (run as administrator):
   `@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command " [System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"`
   To install jq using Chocolatey:
   `choco install jq`
3. Run the lxpbuild.sh script to build all versions of lxp from the versions.json file. Navigate to the lxp-cloud/ lxp-cdk/lib/scripts directory and execute the following command:  
   ./lxpbuild.sh
4. Run cdk diff to see the changes:
   `npx cdk diff`
5. Run cdk synth to synthesize the changes:
   `npx cdk synth`
6. Run cdk deploy to deploy the changes:
   `npx cdk deploy`
