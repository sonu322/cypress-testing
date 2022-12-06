import IssueLinksHierarchy from "./IssueLinksHierarchy";
import ReactDOM from "react-dom";
import APIImpl from "./impl/Cloud";
import JiraServerImpl from "./impl/jira/Server";
import { APIContext } from "./context/api";
import React from "react";
let jiraServer = new JiraServerImpl();
let api = new APIImpl(jiraServer);

const getAppRoot = (): Promise<HTMLElement>  => {
  let root = document.getElementById("lxp-container-root");
  if(root) return Promise.resolve(root);
  else {
    return new Promise((resolve, reject) => {
      let counter = 0;
      const interval = setInterval(() => {
        counter++;
        root = document.getElementById("lxp-container-root");
        if(root){
          clearInterval(interval);
          resolve(root);
        } else if(counter > 20){
          clearInterval(interval);
          resolve(null);
        }
      }, 50);
    });
  }
};

const render = async () => {
  // eslint-disable-next-line no-undef
  const App = await getAppRoot();
  if(App){
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
// @ts-ignore
JIRA.ViewIssueTabs && JIRA.ViewIssueTabs.onTabReady(function (event, eee) {
  render();
});

//TODO: reload the tree on this event...
// @ts-ignore
JIRA.bind('GH.DetailView.updated', render);