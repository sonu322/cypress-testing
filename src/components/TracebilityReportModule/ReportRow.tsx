import React from "react";
import {IssueWithSortedLinks} from "../../types/api";
import {IssueCard} from "../common/issueCard/IssueCard";

export interface Props {
  linkIds: string[];
  issueTypeIds: string[];
  issueFieldIds: string[];
  issue: IssueWithSortedLinks;
}

export const ReportRow = ({
  linkIds,
  issueTypeIds,
  issueFieldIds,
  issue,
}: Props): JSX.Element[] => {
  const cells = [];

  // push issue cell into row
  const issueCell = (
    <td key="issue">
      <IssueCard issueData={issue} selectedIssueFieldIds={issueFieldIds} />
    </td>
  );
  cells.push(issueCell);

  // push links cells into row
  linkIds.forEach((linkId) => {
    // render -- by default
    let issueCell = <td key={linkId}>--</td>;

    if (issue.sortedLinks[linkId] !== undefined) {
      const allIssues = [];
      issue.sortedLinks[linkId].forEach((issue) => {
        const isSelected = issueTypeIds.includes(issue.type.id);
        if (isSelected) {
          const singleIssue = (
            <IssueCard
              key={`${issue.id}-${issue.type.id}`}
              issueData={issue}
              selectedIssueFieldIds={issueFieldIds}
            />
          );
          allIssues.push(singleIssue);
        }
      });
      if (allIssues.length > 0) {
        issueCell = <td key={linkId}>{allIssues}</td>;
      }
    }

    // push cells into row
    cells.push(issueCell);
  });
  return cells;
};