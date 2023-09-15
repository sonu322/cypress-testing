import TracebilityReport from "./TracebilityReport";
import APIImpl from "./impl/Cloud";
import JiraCloudImpl from "./impl/jira/Cloud";
import { APIContext } from "./context/api";
import ReactDOM from "react-dom";
import React from "react";
window.React = React;

const render = async (): Promise<void> => {
  const jiraCloud = new JiraCloudImpl();
  const api = new APIImpl(jiraCloud);
  await api.init();
  // eslint-disable-next-line no-undef
  const App = document.getElementById("app");

  ReactDOM.render(
    <APIContext.Provider value={api}>
      <TracebilityReport />
    </APIContext.Provider>,
    App
  );
};

render();