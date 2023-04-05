import React from "react";
import ReactDOM from "react-dom";
import { GadgetConfigurationForm } from "./GadgetConfigForm";
const Configure = () => {
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
