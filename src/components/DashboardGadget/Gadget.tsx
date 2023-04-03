import React, { useEffect, useState } from "react";
import { APIContext } from "../../context/api";
import APIImpl from "../../impl/Cloud";
import JiraCloudImpl from "../../impl/jira/Cloud";
import IssueLinksHierarchy from "../../IssueLinksHierarchy";

interface GadgetProps {
  issueId: string;
}

export const Gadget: React.FC<GadgetProps> = ({ issueId }) => {
  console.log("issue id", issueId);
  const jiraCloud = new JiraCloudImpl();
  const api = new APIImpl(jiraCloud);
  return (
    <APIContext.Provider value={api}>
      <IssueLinksHierarchy rootIssueId={issueId} />
    </APIContext.Provider>
  );
};
