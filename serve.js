const ngrok = require("ngrok");
const shelljs = require("shelljs");

(async function() {
  const url = await ngrok.connect(1234);
  console.info(`${url}/atlassian-connect.json`);
  const commands = {
    "create-temporary-descriptor": `jq '.baseUrl = "${url}" | .links.self = "${url}/atlassian-connect.json"' assets/original-atlassian-connect.json > assets/atlassian-connect.json`,
    //"move-file": `mv temporary-atlassian-connect.json assets/atlassian-connect.json`
    //"open-ngrok-management": `/usr/bin/open http://127.0.0.1:4040`
  };

  Object.entries(commands).forEach(([name, command]) => {
    console.info(`Executing command to: ${name.replace(/-/g, " ")}`);
    shelljs.exec(command);
  });
})();
