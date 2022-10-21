import IssueLinksHierarchy from "./IssueLinksHierarchy";
import ReactDOM from "react-dom";
import ServerImpl from "./impl/Server";
import { APIContext } from "./context/api";
import React from "react";
let api = new ServerImpl();

/**
 * JIRA function to initialize LXP - Links Explorer tab content
 */
// @ts-ignore
JIRA.ViewIssueTabs.onTabReady(function (event, eee) {
  // eslint-disable-next-line no-undef
  const App = document.getElementById("lxp-container-root");

  ReactDOM.render(
    <APIContext.Provider value={api}>
      <IssueLinksHierarchy/>
    </APIContext.Provider>, App);
});
