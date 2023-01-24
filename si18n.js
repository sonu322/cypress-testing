const jsonToProps = require("json-to-properties/src/scripts/processor");
const native2ascii = require("node-native2ascii");
const fs = require("fs");
const path = require("path");

const baseDist = "../lxp-server/src/main/resources/com/otpl/jira/plugins/i18n";
const nonAsciiDist = baseDist + "/non-ascii";

// remove the existing `i18n` dir
fs.rmSync(baseDist, {recursive: true, force: true});

// create new i18n dir
fs.mkdirSync(baseDist);
fs.mkdirSync(nonAsciiDist);

/* 
  TODO: This command will work only if we maintain all our translation files
  in a single directory.
*/
// convert json to properties file
jsonToProps.process({config: {
  src: "./assets/i18n/0.2", // change the version folder name when version is upgraded
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
