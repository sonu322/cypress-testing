import { colors } from "@atlaskit/theme";
import React from "react";
import styled from "styled-components";
import {
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
  selectedTableFieldIds;
  issueFieldIds: string[];
  issue: IssueWithSortedLinks;
  rowSno: number;
}

export const LinkTypeRow = ({
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
        const isSelected = true;
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
