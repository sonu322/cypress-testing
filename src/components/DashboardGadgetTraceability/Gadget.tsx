import React from "react";
import IssueLinksHierarchy from "../../IssueLinksHierarchy";
import { TracebilityReportModule } from "../TracebilityReportModule/TracebilityReportModule";

interface GadgetProps {
  issueKey: string;
}
export const Gadget: React.FC<GadgetProps> = () => {
  return (
    // <IssueLinksHierarchy rootIssueKey={issueKey} isFromDashboardGadget={true} />
    <TracebilityReportModule />
  );
};
