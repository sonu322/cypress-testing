import React, { useEffect, useState } from "react";
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
import { getScreenHeight } from "../../util/common";
const Container = styled.div`
  width: 100%;
  // height: 100%;
  overflow: scroll;
  border: 1px solid ${colors.N40};
  border-radius: 10px;
`;
const BorderTr = styled.tr`
  border-bottom: 1px solid ${colors.N40};
  &:hover {
    background-color: #091e420a;
  }
`;
const Table = styled.table`
  border: 1px solid ${colors.N40};
`;
interface Props {
  filteredIssues: IssueWithSortedLinks[];
  tableFields: IssueType[] | IssueLinkType[];
  selectedTableFieldIds: string[];
  issueFieldIds: string[];
  isIssueTypeReport: boolean;
}
export const Report = ({
  filteredIssues,
  tableFields,
  selectedTableFieldIds,
  issueFieldIds,
  isIssueTypeReport,
}: Props): JSX.Element => {
  
  //TODO: probably we may improve this calculation
  const calculateTableHeight = () => {
    const headingHeight = 40 + 8, //8: margin top
      toolbarHeight = 94 + 8, //8: table top margin
      footerHeight = 32 + 8 + 8;//more button 8: margin top and bottom
    return getScreenHeight() - headingHeight - toolbarHeight - footerHeight - 2;
  };

  const [tableHeight, setTableHeight] = useState(calculateTableHeight());
  
  //TODO: on window resize, we need to recalculate the table height, but somehow it is not working
  // useEffect(() => {
  //   window.onresize = function(event) {
  //     const height = calculateTableHeight();
  //     setTableHeight(height);
  //   };
  // }, []);

  return (
    <Container style={{maxHeight: tableHeight}}>
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
                  selectedTableFieldIds={selectedTableFieldIds}
                  issueFieldIds={issueFieldIds}
                  issue={issue}
                  rowSno={index + 1}
                />
              ) : (
                <LinkTypeRow
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
    </Container>
  );
};
