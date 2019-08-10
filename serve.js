const ngrok = require("ngrok");
const shelljs = require("shelljs");

(async function() {
  const url = await ngrok.connect(1234);
  console.info(`${url}/atlassian-connect.json`);
  const commands = {
    "replace-base-url": `/usr/local/bin/jq '.baseUrl = "${url}"' assets/atlassian-connect.json > temporary-atlassian-connect.json`,
    "move-file": `mv temporary-atlassian-connect.json assets/atlassian-connect.json`
    //"open-ngrok-management": `/usr/bin/open http://127.0.0.1:4040`
  };

  Object.entries(commands).forEach(([name, command]) => {
    console.info(`Executing command to: ${name.replace(/-/g, " ")}`);
    shelljs.exec(command);
  });
})();
