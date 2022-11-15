import React from "react";
import { IssueWithSortedLinks } from "../../types/api";
import { IssueCard } from "../common/issueCard/IssueCard";
import { EmptyCell } from "./EmptyCell";
import { IssueTd, MaxWidthContainer, Td } from "./IssueTypeRow";

export interface Props {
  selectedTableFieldIds;
  issueFieldIds: string[];
  issue: IssueWithSortedLinks;
  rowSno: number;
}

export const LinkTypeRow = ({
  issueFieldIds,
  issue,
  rowSno,
  selectedTableFieldIds,
}: Props): JSX.Element[] => {
  const cells = [];

  // push issue cell into row
  const issueCell = (
    <IssueTd key="issue">
      <MaxWidthContainer>
        <IssueCard issueData={issue} selectedIssueFieldIds={issueFieldIds} />
      </MaxWidthContainer>
    </IssueTd>
  );
  const snoCell = <Td key="sno">{rowSno}.</Td>;

  cells.push(snoCell);
  cells.push(issueCell);

  // push links cells into row
  selectedTableFieldIds.forEach((linkId) => {
    // render -- by default
    let issueCell = (
      <Td key={`${issue.id}-${linkId}`}>
        <EmptyCell></EmptyCell>
      </Td>
    );

    if (issue.sortedLinks[linkId] !== undefined) {
      const allIssues = [];
      issue.sortedLinks[linkId].forEach((issue) => {
        const singleIssue = (
          <IssueCard
            key={`${issue.id}-${issue.type?.id}`}
            issueData={issue}
            selectedIssueFieldIds={issueFieldIds}
          />
        );
        allIssues.push(singleIssue);
      });
      if (allIssues.length > 0) {
        issueCell = (
          <Td key={linkId}>
            <MaxWidthContainer>{allIssues}</MaxWidthContainer>
          </Td>
        );
      }
    }

    // push cells into row
    cells.push(issueCell);
  });
  return cells;
};
