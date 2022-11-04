import IssueLinksHierarchy from "./IssueLinksHierarchy";
import ReactDOM from "react-dom";
import APIImpl from "./impl/Cloud";
import JiraServerImpl from "./impl/jira/Server";
import { APIContext } from "./context/api";
import React from "react";
let jiraServer = new JiraServerImpl();
let api = new APIImpl(jiraServer);

/**
 * JIRA function to initialize LXP - Links Explorer tab content
 */
// @ts-ignore
JIRA.ViewIssueTabs.onTabReady(function (event, eee) {
  // eslint-disable-next-line no-undef
  const App = document.getElementById("lxp-container-root");

  ReactDOM.render(
    <APIContext.Provider value={api}>
      <IssueLinksHierarchy />
    </APIContext.Provider>,
    App
  );
});
