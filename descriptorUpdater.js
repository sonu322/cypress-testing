const fs = require("fs");
const updater = function (baseURL) {
  try {
    let jsonData, jsonString;

    console.log("App Descriptor URL: ");
    console.info(`${baseURL}/atlassian-connect.json`);

    jsonString = fs.readFileSync("assets/original-atlassian-connect.json");
    jsonData = JSON.parse(jsonString);
    jsonData.baseUrl = baseURL;
    jsonData.links.self = `${baseURL}/atlassian-connect.json`;
    jsonString = JSON.stringify(jsonData, null, 2);

    fs.writeFileSync("assets/atlassian-connect.json", jsonString);
  } catch (err) {
    console.error(err);
  }
};

module.exports = updater;

if(process.argv.length > 2 && process.argv[2].startsWith("https")){
  updater(process.argv[2]);
}
