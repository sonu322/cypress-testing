import IssueLinksHierarchy from "./IssueLinksHierarchy";
import ReactDOM from "react-dom";
import APIImpl from "./impl/Cloud";
import JiraServerImpl from "./impl/jira/Server";
import { APIContext } from "./context/api";
import React from "react";
const jiraServer = new JiraServerImpl();
const api = new APIImpl(jiraServer);

const getAppRoot = (): Promise<HTMLElement> => {
  let root = document.getElementById("lxp-container-root");
  if (root) return Promise.resolve(root);
  else {
    return new Promise((resolve, reject) => {
      let counter = 0;
      const interval = setInterval(() => {
        counter++;
        root = document.getElementById("lxp-container-root");
        if (root) {
          clearInterval(interval);
          resolve(root);
        } else if (counter > 20) {
          clearInterval(interval);
          resolve(null);
        }
      }, 50);
    });
  }
};

const render = async (): Promise<void> => {
  // eslint-disable-next-line no-undef
  const App = await getAppRoot();
  if (App !== null) {
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