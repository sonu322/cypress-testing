import React from "react";
import { Config, getConfig } from "@atlaskit/util-service-support";
import ReactDOM from "react-dom";
import { GadgetConfigurationForm } from "../common/GadgetConfigForm";
const Configure = () => {
  const config = getConfig();
  console.log("config", config); // TODO: this does not work
  return (
    <div>
      <h1>My Gadget Configuration</h1>
      <GadgetConfigurationForm
        onSave={(config) => {
          console.log("saved config", config);
        }}
      />
    </div>
  );
};
const App = document.getElementById("app");
ReactDOM.render(<Configure />, App);
