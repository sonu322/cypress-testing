import React from "react";
import { Config, getConfig } from "@atlaskit/util-service-support";
import ReactDOM from "react-dom";
const Configure = () => {
  // Define your configuration page here
  const config = getConfig();
  console.log("config", config);
  return (
    <div>
      <h1>My Gadget Configuration</h1>
      {/* Add your configuration UI here */}
    </div>
  );
};
console.log("config script called");
const App = document.getElementById("app");
ReactDOM.render(<Configure />, App);
