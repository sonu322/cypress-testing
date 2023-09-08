import IssueLinksHierarchy from "./IssueLinksHierarchy";
import ReactDOM from "react-dom";
import APIImpl from "./impl/Cloud";
import JiraServerImpl from "./impl/jira/Server";
import { APIContext } from "./context/api";
import React from "react";
import { getAppRoot } from "./util/common";

const render = async (): Promise<void> => {
  // eslint-disable-next-line no-undef
  const App = await getAppRoot();
  if (App !== null) {
    const jiraServer = new JiraServerImpl(App);
    const api = new APIImpl(jiraServer);
    await api.init();

    ReactDOM.render(
      <APIContext.Provider value={api}>
        <IssueLinksHierarchy />
      </APIContext.Provider>,
      App
    );
  }
};

/**
 * JIRA function to initialize LXP - Links Explorer tab content
 */
// @ts-expect-error
JIRA.ViewIssueTabs?.onTabReady(function () {
  render();
});

// TODO: reload the tree on this event...
// @ts-expect-error
JIRA.bind("GH.DetailView.updated", render);