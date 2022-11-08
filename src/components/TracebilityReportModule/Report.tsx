import React from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import { LinkTypeRow } from "./LinkTypeRow";
import { ReportHeader } from "./ReportHeader";
import {
  IssueLinkType,
  IssueType,
  IssueWithSortedLinks,
} from "../../types/api";
import { IssueTypeRow } from "./IssueTypeRow";
const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  max-height: 400px;
  border: 1px solid ${colors.N40};
  border-radius: 10px;
`;
const BorderTr = styled.tr`
  border-bottom: 1px solid ${colors.N40};
`;
const Table = styled.table`
  border: 1px solid ${colors.N40};
`;
interface Props {
  filteredIssues: IssueWithSortedLinks[];
  tableFields: IssueType[] | IssueLinkType[];
  selectedTableFieldIds: string[];
  issueFieldIds: string[];
  selectedTab: string;
}
export const Report = ({
  filteredIssues,
  tableFields,
  selectedTableFieldIds,
  issueFieldIds,
  selectedTab,
}: Props): JSX.Element => {
  // const selectedLinkIds = selectedTableFieldIds.get("linkTypes");
  // const selectedIssueTypeIds = selectedTableFieldIds.get("issueTypes");
  // const allLinks = tableFields.get("linkTypes").values;
  const isIssueTypeReport = selectedTab === "issueType";
  return (
    <Container>
      <Table>
        <ReportHeader
          selectedFieldIds={selectedTableFieldIds}
          fields={tableFields}
        />
        <tbody>
          {filteredIssues.map((issue, index) => (
            <BorderTr key={`${issue.issueKey}`}>
              {isIssueTypeReport ? (
                <IssueTypeRow
                  tableFields={tableFields}
                  selectedTableFieldIds={selectedTableFieldIds}
                  issueFieldIds={issueFieldIds}
                  issue={issue}
                  rowSno={index + 1}
                />
              ) : (
                <LinkTypeRow
                  // issueTypeIds={selectedIssueTypeIds}
                  // linkIds={selectedLinkIds}
                  tableFields={tableFields}
                  selectedTableFieldIds={selectedTableFieldIds}
                  issueFieldIds={issueFieldIds}
                  issue={issue}
                  rowSno={index + 1}
                />
              )}
            </BorderTr>
          ))}
        </tbody>
      </Table>
      {selectedTab}
    </Container>
  );
};
