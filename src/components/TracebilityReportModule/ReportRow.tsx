import React from "react";
import { IssueWithSortedLinks } from "../../types/api";
import { IssueCard } from "../common/issueCard/IssueCard";
import { EmptyCell } from "./EmptyCell";

const Td = styled.td`
  border: 1px solid ${colors.N40};
`;

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
    <Td key="issue">
      <IssueCard issueData={issue} selectedIssueFieldIds={issueFieldIds} />
    </Td>
  );
  const snoCell = <Td key="sno">{rowSno}.</Td>;

  cells.push(snoCell);
  cells.push(issueCell);

  // push links cells into row
  linkIds.forEach((linkId) => {
    // render -- by default
    let issueCell = (
      <Td key={`${issue.id}-${linkId}`}>
        <EmptyCell></EmptyCell>
      </Td>
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
        issueCell = <Td key={linkId}>{allIssues}</Td>;
      }
    }

    // push cells into row
    cells.push(issueCell);
  });
  return cells;
};
