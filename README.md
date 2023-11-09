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

   
**How to Backup and Restore Jira XML Files in Another Jira Instance**
Jira is a popular issue and project tracking tool used by many organizations. It's essential to regularly back up your Jira data, including XML files, to ensure the safety and integrity of your project data. This document provides a step-by-step guide on how to take a backup of a Jira XML file and restore it in another Jira instance.
**Backup Procedure:**
**1.Log in to your Jira Instance**
Ensure you have administrative privileges to access the Jira instance you want to back up. Log in to your Jira instance with the necessary permissions.
**2. Navigate to the Jira Administration Page**
Click on the 'Cog' icon (settings) at the top right corner and select "Jira settings" or "System" from the dropdown menu.
**3. Backup Data**
In the left-hand navigation pane, under the 'Administration' section, click on "System."
Scroll down and find the "Backup System" option.
Or you can search for "Backup System" in the "search Jira admin" bar to quickly locate the "Backup System" option.
**4. File Name**
Now give some file name beside the file name text box and finally click on the “Backup” button. This may take some time, depending on the size of your Jira instance.
**5. Download Backup**
Once the backup process is complete, you will receive a message which displays the complete success of the backup file and also contains the path of the backup file, where your XML file is stored. 

**Restore Procedure in Another Jira Instance:
Install a Fresh Jira Instance
Log in to the New Jira Instance**

**Navigate to the Jira Administration Page**
Click on the 'Cog' icon (settings) at the top right corner and select "Jira settings" or "System" from the dropdown menu.

**Restore Data**
In the left-hand navigation pane, under the 'Administration' section, click on "System."
Scroll down and find the "Import and Export" section.

Next, access the new Jira instance. Navigate to Jira **settings > System**. You can also use the '**Jira search admin**' bar to find the 'Restore System' option.
Afterward, open the folder where you stored the backup file. Copy the backup zip file and paste it into the 'import' folder of the new Jira instance. 

Backup file location: Go to jira “**Export**” folder.
Restore file location: Go to the jira “**Import**” folder.

Ultimately, you will observe that all data from the original Jira instance is now visible in the new Jira instance.




