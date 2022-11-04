import TracebilityReport from "./TracebilityReport";
import APIImpl from "./impl/Cloud";
import JiraCloudImpl from "./impl/jira/Cloud";
import { APIContext } from "./context/api";
import React from "react";
window.React = React;
import ReactDOM from "react-dom";
let jiraCloud = new JiraCloudImpl();
let api = new APIImpl(jiraCloud);

// eslint-disable-next-line no-undef
const App = document.getElementById("app");

ReactDOM.render(
  <APIContext.Provider value={api}>
    <TracebilityReport />
  </APIContext.Provider>,
  App
);
