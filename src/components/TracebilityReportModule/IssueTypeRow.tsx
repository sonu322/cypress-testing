import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Issue,
  IssueLinkType,
  IssueType,
  IssueWithSortedLinks,
} from "../../types/api";
import { getUniqueValues } from "../../util/common";
import { IssueCard } from "../common/issueCard/IssueCard";
import { EmptyCell } from "./EmptyCell";
import { IssueCell } from "./IssueCell";
import { token } from "@atlaskit/tokens";
export const Td = styled.td`
  border: 1px solid ${token("color.border")};
  padding: 8px !important;
`;
export const IssueTd = styled(Td)`
  background-color: ${token("elevation.surface.sunken")};
  position: sticky;
  position: -webkit-sticky;
  left: 30px;
  z-index: 2;
`;
export const SNoTd = styled(Td)`
  position: sticky;
  position: -webkit-sticky;
  left: 0;
  background-color: ${token("elevation.surface.sunken")};
  z-index: 2;
`;
export const MaxWidthContainer = styled.div`
  max-width: 540px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export interface Props {
  selectedTableFieldIds: string[];
  selectedSettingsDropdownIds: string[];
  issueFieldIds: string[];
  issue: IssueWithSortedLinks;
  rowSno: number;
}

export const IssueTypeRow = ({
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
  selectedTableFieldIds.forEach((typeId) => {
    // render -- by default
    let issueCell = (
      <Td key={`${issue.id}-${typeId}`}>
        <EmptyCell></EmptyCell>
      </Td>
    );
    let issuesOfType: Issue[] = [];
    Object.values(issue.sortedLinks).forEach((issues) => {
      const newIssues = issues.filter((issue) => {
        return issue?.type?.id === typeId;
      });
      issuesOfType = issuesOfType.concat(newIssues);
    });
    if (issuesOfType.length > 0) {
      issuesOfType = getUniqueValues(issuesOfType);
      const issueCards = [];
      issuesOfType.forEach((issue) => {
        const issueCard = (
          <IssueCard
            key={`${issue.id}-${issue.type?.id}`}
            issueData={issue}
            selectedIssueFieldIds={issueFieldIds}
          />
        );
        issueCards.push(issueCard);
      });
      issueCell = (
        <Td key={typeId}>
          <IssueCell
            selectedSettingsDropdownIds={selectedSettingsDropdownIds}
            issueCards={issueCards}
          ></IssueCell>
        </Td>
      );
    }
    //push cell into row
    cells.push(issueCell);
  });
  return cells;
};
