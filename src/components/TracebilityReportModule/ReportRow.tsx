import React from "react";
import { Issue } from "../../types/api";
import { IssueCard } from "../IssueCard";

export const ReportRow = ({
  links,
  classified,
  issueFieldIds,
  issueCardOptionsMap,
}): JSX.Element[] => {
  console.log("links!!!");
  console.log(links);
  const issueCell = (
    <td>
      <IssueCard
        issueData={classified.issue}
        selectedIssueFieldIds={issueFieldIds}
        issueCardOptionsMap={issueCardOptionsMap}
      />
    </td>
  );
  const parentCell = (
    <td>
      {classified.parent ? (
        <IssueCard
          issueData={classified.parent}
          selectedIssueFieldIds={issueFieldIds}
          issueCardOptionsMap={issueCardOptionsMap}
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
            issueCardOptionsMap={issueCardOptionsMap}
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
