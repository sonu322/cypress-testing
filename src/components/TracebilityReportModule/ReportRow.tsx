import React from "react";
import {Issue, IssueWithPopulatedLinks} from "../../types/api";
import {IssueCard} from "../common/issueCard/IssueCard";

export interface Props {
  links: string[];
  issueFieldIds: string[];
  issue: IssueWithPopulatedLinks;
}

export const ReportRow = ({links, issueFieldIds, issue}: Props): JSX.Element[] => {
  const issueCell = (
    <td key="issue">
      <IssueCard issueData={issue} selectedIssueFieldIds={issueFieldIds} />
    </td>
  );
  const parentCell = (
    <td key="parent">
      {classified.parent ? (
        <IssueCard
          issueData={classified.parent}
          selectedIssueFieldIds={issueFieldIds}
        />
      ) : (
        <span>--</span>
      )}
    </td>
  );
  const linkCells = links.map((link: string) => (
    <td key={classified.issue.key + link}>
      {classified[link] != null && classified[link].length > 0 ? (
        classified[link].map((issue: Issue) => (
          <IssueCard
            key={issue.id}
            issueData={issue}
            selectedIssueFieldIds={issueFieldIds}
          />
        ))
      ) : (
        <span>--</span>
      )}
    </td>
  ));
  const cells = [];
  cells.push(issueCell, parentCell, linkCells);

  return cells;
};
