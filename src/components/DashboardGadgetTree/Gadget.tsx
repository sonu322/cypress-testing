import React, { useEffect, useState } from "react";
import { APIContext } from "../../context/api";
import APIImpl from "../../impl/Cloud";
import JiraCloudImpl from "../../impl/jira/Cloud";
import IssueLinksHierarchy from "../../IssueLinksHierarchy";

interface GadgetProps {
  issueKey: string;
}
export const Gadget: React.FC<GadgetProps> = ({ issueKey }) => {
  const jiraCloud = new JiraCloudImpl();
  const api = new APIImpl(jiraCloud);
  return (
    <APIContext.Provider value={api}>
      <IssueLinksHierarchy rootIssueKey={issueKey} />
    </APIContext.Provider>
  );
};
