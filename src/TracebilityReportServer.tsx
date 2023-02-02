import TracebilityReport from "./TracebilityReportServerWithEditor";
import APIImpl from "./impl/Cloud";
import JiraServerImpl from "./impl/jira/Server";
import { APIContext } from "./context/api";
import ReactDOM from "react-dom";
import { getAppRoot } from "./util/common";
import React from "react";
window.React = React;

const render = async (): Promise<void> => {
  // eslint-disable-next-line no-undef
  const App = await getAppRoot();

  if (App) {
    const jiraServer = new JiraServerImpl(App);
    const api = new APIImpl(jiraServer, true);
    ReactDOM.render(
      <APIContext.Provider value={api}>
        <TracebilityReport />
      </APIContext.Provider>,
      App
    );
  }
};

render();