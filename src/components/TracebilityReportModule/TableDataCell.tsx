import React from "react";
import { IssueCard } from "../IssueCard";
export const TableDataCell = ({
  issueData,
  issueFieldIds,
  issueCardOptionsMap,
}) => {
  return (
    <td>
      <IssueCard
        issueData={issueData}
        selectedIssueFieldIds={issueFieldIds}
        issueCardOptionsMap={issueCardOptionsMap}
      />
    </td>
  );
};
