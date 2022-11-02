# Links Explorer - a plugin for Jira Cloud

- Requires ngrok, yarn, node.

#### For local plugin development

- First start the server to serve the plugin descriptor and other static files using the command below:
  - `yarn start`
- In another tab, run the below command to open the ngrok tunnel and update the plugin descriptor file:
  - `yarn serve`
  - The above command will display the app descriptor URL, copy this URL and open it in the browser first because `ngrok` display a warning before serving any content for the first time. In the warning page, click on `Visit Page` link to remove the warning from subsequent visits.
- Now copy the app descriptor URL from the above step and install the plugin in Jira UPM using that URL.
