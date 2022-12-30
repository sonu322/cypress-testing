const jsonToProps = require("json-to-properties/src/scripts/processor");
const native2ascii = require("node-native2ascii");
const fs = require("fs");
const path = require("path");

const baseDist = "../lxp-server/src/main/resources/com/otpl/jira/plugins/generated";
const nonAsciiDist = baseDist + "/non-ascii";

// remove the existing `generated` dir
fs.rmSync(baseDist, {recursive: true, force: true});

// create new generated dir
fs.mkdirSync(baseDist);
fs.mkdirSync(nonAsciiDist);

// convert json to properties file
jsonToProps.process({config: {
  src: "./assets/i18n/0.1",
  dist: nonAsciiDist
}}); // this method is not synchronous, so we used setTimeout below.

const files = [
  "de_DE",
  "en_US",
  "es_ES",
  "fr_FR",
  "zh_CN"
];
async function convert2ascii(){
  for(const file of files){
    const input = fs.readFileSync(path.resolve(nonAsciiDist + "/" + file + ".properties"), "utf8");
    const output = native2ascii(input);
    let outfile = baseDist + "/lxp_" + file + ".properties";
    if(file === "en_US"){
      outfile = baseDist + "/lxp.properties";
    }
    fs.writeFileSync(path.resolve(outfile), output);
  }
}

setTimeout(function(){
  convert2ascii();
}, 5000);
