const ngrok = require("ngrok");
const localtunnel = require("localtunnel")
const jq = require('node-jq');
const fs = require('fs');

(async function() {
  try {
    // const url = await ngrok.connect(1234);
    const tunnel = await localtunnel({ port: 1234 })
    let url = tunnel.url
    console.log("App Descriptor URL: ");
    console.info(`${url}/atlassian-connect.json`);
    let file = await jq.run(`.baseUrl = "${url}" | .links.self = "${url}/atlassian-connect.json"`, 'assets/original-atlassian-connect.json');
    fs.writeFileSync('assets/atlassian-connect.json', file);
  } catch(err){
    console.error(err);
  }
})();
