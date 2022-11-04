import React from "react";
import { IssueWithSortedLinks } from "../../types/api";
import { IssueCard } from "../common/issueCard/IssueCard";
import { EmptyReportCell } from "./EmptyReportCell";

export interface Props {
  linkIds: string[];
  issueTypeIds: string[];
  issueFieldIds: string[];
  issue: IssueWithSortedLinks;
  rowSno: number;
}

export const ReportRow = ({
  linkIds,
  issueTypeIds,
  issueFieldIds,
  issue,
  rowSno,
}: Props): JSX.Element[] => {
  const cells = [];

  // push issue cell into row
  const issueCell = (
    <td key="issue">
      <IssueCard issueData={issue} selectedIssueFieldIds={issueFieldIds} />
    </td>
  );
  const snoCell = <td key="sno">{rowSno}.</td>;


  cells.push(snoCell);
  cells.push(issueCell);

  // push links cells into row
  linkIds.forEach((linkId) => {
    // render -- by default
    let issueCell = (
      <td key={`${issue.id}-${linkId}`}>
        <EmptyReportCell></EmptyReportCell>
      </td>
    );

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
