import React from "react";
import IssueLinksHierarchy from "../../IssueLinksHierarchy";

interface GadgetProps {
  issueKey: string;
}
export const Gadget: React.FC<GadgetProps> = ({ issueKey }) => {
  return (
    <IssueLinksHierarchy rootIssueKey={issueKey} isFromDashboardGadget={true} />
  );
};
