import React, { useEffect, useState } from "react";
import { APIContext } from "../../context/api";
import APIImpl from "../../impl/Cloud";
import JiraCloudImpl from "../../impl/jira/Cloud";
import IssueLinksHierarchy from "../../IssueLinksHierarchy";

interface GadgetProps {
  issueKey: string;
}
// AP.define("lxp-tree-gadget", function () {
//   console.log("Gadget defined successfully!");

//   return {
//     onLoad: () => {
//       console.log("gadget loaded successfully");
//     },
//   };
// });

AP.define("lxp-tree-gadget-context", function(context) {
  // Use the context data to perform actions or display information
  console.log("Context of the dashboard item:", context);
});

// Get the key of the dashboard item you want to get the context of
const dashboardItemKey = "lxp-tree-gadget";

// Use AP.context.getContext to get the context of the dashboard item
AP.context.getContext("dashboard-item", {dashboardItemKey}).then(function(context) {
  console.log("GET CONTEXT CALLEDDDDDDDDDDD")
  // Load the module defined earlier with the context data
  console.log("next context", context);
  AP.require("lxp-tree-gadget-context", function(module) {
    module(context);
  });
});


export const Gadget: React.FC<GadgetProps> = ({ issueKey }) => {
  useEffect(() => {
    console.log("effect called");
    AP.define("lxp-tree-gadget", function () {
      return {
        // This function is called when the gadget is loaded
        onLoad: function () {
          // Get the current Jira context

          console.log("context", context);
        },
      };
    });
  }, []);
  console.log("issue id", issueKey);
  const jiraCloud = new JiraCloudImpl();
  const api = new APIImpl(jiraCloud);
  return (
    <APIContext.Provider value={api}>
      <IssueLinksHierarchy rootIssueKey={issueKey} />
    </APIContext.Provider>
  );
};
