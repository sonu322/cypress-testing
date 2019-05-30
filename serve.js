const ngrok = require("ngrok");
const shelljs = require("shelljs");

(async function() {
  const url = await ngrok.connect(1234);
  console.log(url)
  const replaceValueCommand = `/usr/local/bin/jq '.baseUrl = "${url}"' assets/atlassian-connect.json > temporary-atlassian-connect.json`;
  const replaceFileCommand = `mv temporary-atlassian-connect.json assets/atlassian-connect.json`;
  const openWebInterfaceCommand = `/usr/bin/open http://127.0.0.1:4040`;
  shelljs.exec(replaceValueCommand);
  shelljs.exec(replaceFileCommand);
  shelljs.exec(openWebInterfaceCommand);
})();
