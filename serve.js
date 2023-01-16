/* eslint-disable no-undef */
const ngrok = require("ngrok");
const fs = require("fs");
const updater = require("./descriptorUpdater");

(async function () {
  try {
    // change later
    const url = await ngrok.connect(1234);
    await updater(url);
  } catch(err){
    console.error(err);
  }
})();
