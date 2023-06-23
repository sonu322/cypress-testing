import React, { useEffect, useState } from "react";
import { IssueWithSortedLinks } from "../../types/api";
import { IssueCard } from "../common/issueCard/IssueCard";
import { EmptyCell } from "./EmptyCell";
import { IssueTd, MaxWidthContainer, Td, SNoTd } from "./IssueTypeRow";
import { IssueCell } from "./IssueCell";
export interface Props {
  selectedTableFieldIds;
  issueFieldIds: string[];
  issue: IssueWithSortedLinks;
  selectedSettingsDropdownIds: string[];
  rowSno: number;
}

export const LinkTypeRow = ({
  issueFieldIds,
  issue,
  rowSno,
  selectedTableFieldIds,
  selectedSettingsDropdownIds,
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
  const snoCell = <SNoTd key="sno">{rowSno}.</SNoTd>;

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
      issue.sortedLinks[linkId].forEach((linkedIssue) => {
        if (linkedIssue !== undefined) {
          const singleIssue = (
            <IssueCard
              key={`${linkedIssue.id}-${linkedIssue.type?.id}`}
              issueData={linkedIssue}
              selectedIssueFieldIds={issueFieldIds}
            />
          );
          allIssues.push(singleIssue);
        }
      });
      if (allIssues.length > 0) {
        issueCell = (
          <Td key={linkId}>
            <IssueCell
              selectedSettingsDropdownIds={selectedSettingsDropdownIds}
              issueCards={allIssues}
            ></IssueCell>
          </Td>
        );
      }
    }

    // push cells into row
    cells.push(issueCell);
  });
  return cells;
};
