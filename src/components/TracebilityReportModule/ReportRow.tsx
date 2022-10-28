import React from "react";
import { IssueCard } from "../IssueCard";

export const ReportRow = ({
  links,
  classified,
  issueFieldIds,
  issueCardOptionsMap,
}): JSX.Element[] => {
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

  const linkCells = links.map((link) => (
    <td key={classified.issue.key}>
      {classified[link] != null && classified[link].length > 0 ? (
        classified[link].map((issue) => (
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
