import React, { useEffect, useState } from "react";
import { IssueWithSortedLinks } from "../../types/api";
import { IssueCard } from "../common/issueCard/IssueCard";
import { EmptyCell } from "./EmptyCell";
import { IssueTd, MaxWidthContainer, Td } from "./IssueTypeRow";
import { CellLimit } from "./SettingDropdown";
import Button from "@atlaskit/button";

export interface Props {
  selectedTableFieldIds;
  issueFieldIds: string[];
  issue: IssueWithSortedLinks;
  issueInCell: CellLimit[];
  selectedIssueInCellIds: string[];
  rowSno: number;
}

export const LinkTypeRow = ({
  issueFieldIds,
  issue,
  rowSno,
  selectedTableFieldIds,
  selectedIssueInCellIds,
}: Props): JSX.Element[] => {
  const [areAllIssuesVisible, setAreAllIssuesVisible] = useState(false);
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
      useEffect(() => {
        if(selectedIssueInCellIds.length > 0){
          handleClick();
        }
      },[selectedIssueInCellIds]);

    let issueCardsToShow = [];
    if(allIssues.length > 3) {
      if(!areAllIssuesVisible) {
      issueCardsToShow = allIssues.slice(0, 3);
      }
      else {
        issueCardsToShow = allIssues;
      }
    }
    else {
      issueCardsToShow = allIssues;
    }

    const handleClick = () => {
      if(allIssues.length > 3) {
        setAreAllIssuesVisible(!areAllIssuesVisible);
      }
    };
  
      if (allIssues.length > 0) {
        issueCell = (
          <Td key={linkId}>
            <MaxWidthContainer>{issueCardsToShow}</MaxWidthContainer>
            {allIssues.length > 3 && 
            <Button onClick={handleClick} style={{cursor: 'pointer'}} isDisabled={areAllIssuesVisible} >
              More
            </Button>} 
          </Td>
        );
      }
    }

    // push cells into row
    cells.push(issueCell);
  });
  return cells;
};
