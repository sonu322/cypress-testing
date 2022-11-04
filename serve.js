/* eslint-disable no-undef */
const ngrok = require("ngrok");
const fs = require("fs");
(async function () {
  try {
    let jsonData;
    let jsonString;
    // change later
    const url = await ngrok.connect(1234);
    console.log("App Descriptor URL: ");
    console.info(`${url}/atlassian-connect.json`);
    try {
      jsonString = fs.readFileSync("assets/original-atlassian-connect.json");
      jsonData = JSON.parse(jsonString);
      jsonData.baseUrl = url;
      jsonData.links.self = `${url}/atlassian-connect.json`;
      jsonString = JSON.stringify(jsonData);
    } catch (err) {
      console.log(err);
      return;
    }
    fs.writeFileSync("assets/atlassian-connect.json", jsonString);
  } catch (err) {
    console.error(err);
  }
})();
