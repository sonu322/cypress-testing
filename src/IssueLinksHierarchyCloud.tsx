import React from "react";
import ReactDOM from "react-dom";
import IssueLinksHierarchy from "./IssueLinksHierarchy";
import APIImpl from "./impl/Cloud";
import JiraCloudImpl from "./impl/jira/Cloud";
import { APIContext } from "./context/api";
import JiraErrorContainer from "./components/common/JiraErrorContainer";
const jiraCloud = new JiraCloudImpl();
const api = new APIImpl(jiraCloud);

// eslint-disable-next-line no-undef
const App = document.getElementById("app");

ReactDOM.render(
  api.isJiraCloud() ? (
    <APIContext.Provider value={api}>
      <IssueLinksHierarchy />
    </APIContext.Provider>
  ) : (
    <JiraErrorContainer />
  ),
  App
);
