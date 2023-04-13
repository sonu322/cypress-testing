import React from "react";
import IssueLinksHierarchy from "../../IssueLinksHierarchy";
import { TracebilityReportModule } from "../TracebilityReportModule/TracebilityReportModule";

interface GadgetProps {

}
export const Gadget: React.FC<GadgetProps> = () => {
  return (
    // <IssueLinksHierarchy rootIssueKey={issueKey} isFromDashboardGadget={true} />
    <TracebilityReportModule />
  );
};
