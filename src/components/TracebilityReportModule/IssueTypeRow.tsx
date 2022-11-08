import { colors } from "@atlaskit/theme";
import React from "react";
import styled from "styled-components";
import {
  Issue,
  IssueLinkType,
  IssueType,
  IssueWithSortedLinks,
} from "../../types/api";
import { IssueCard } from "../common/issueCard/IssueCard";
import { EmptyCell } from "./EmptyCell";

const Td = styled.td`
  border: 1px solid ${colors.N40};
  padding: 8px !important;
`;
const MaxWidthContainer = styled.div`
  max-width: 540px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export interface Props {
  // linkIds: string[];
  // issueTypeIds: string[];
  tableFields: IssueType[] | IssueLinkType[];
  selectedTableFieldIds: string[];
  issueFieldIds: string[];
  issue: IssueWithSortedLinks;
  rowSno: number;
}

export const IssueTypeRow = ({
  // linkIds,
  // issueTypeIds,
  issueFieldIds,
  issue,
  rowSno,
  tableFields,
  selectedTableFieldIds,
}: Props): JSX.Element[] => {
  const cells = [];

  // push issue cell into row
  const issueCell = (
    <Td key="issue">
      <MaxWidthContainer>
        <IssueCard issueData={issue} selectedIssueFieldIds={issueFieldIds} />
      </MaxWidthContainer>
    </Td>
  );
  const snoCell = <Td key="sno">{rowSno}.</Td>;

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
        console.log(issue.type.id, typeId);
        return issue.type.id === typeId;
      });
      console.log(newIssues);
      issuesOfType = issuesOfType.concat(newIssues);
      console.log(issuesOfType);
    });
    if (issuesOfType.length > 0) {
      const issueCards = [];
      issuesOfType.forEach((issue) => {
        const issueCard = (
          <IssueCard
            key={`${issue.id}-${issue.type.id}`}
            issueData={issue}
            selectedIssueFieldIds={issueFieldIds}
          />
        );
        issueCards.push(issueCard);
      });
      console.log(issueCards);
      issueCell = (
        <Td key={typeId}>
          <MaxWidthContainer>{issueCards}</MaxWidthContainer>
        </Td>
      );
    }
    // push cells into row
    cells.push(issueCell);
  });
  return cells;
};
