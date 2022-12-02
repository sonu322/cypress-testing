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
  errors: any[];
}
export const Report = ({
  filteredIssues,
  tableFields,
  selectedTableFieldIds,
  issueFieldIds,
  isIssueTypeReport,
  errors
}: Props): JSX.Element => {
  
  // TODO: probably we may improve this calculation
  const calculateTableHeight = (errors) => {
    const headingHeight = 40 + 8; // 8: margin top
      const toolbarHeight = 94 + 8; // 8: table top margin
      const footerHeight = 32 + 8 + 8; const // more button 8: margin top and bottom
      errorsHeight = errors && errors.length ? ((52 + 8) * errors.length) : 0;
    const finalHeight = getScreenHeight() - headingHeight - toolbarHeight - footerHeight - errorsHeight - 2;
    return finalHeight < 200 ? 200 : finalHeight;
  };

  const [tableHeight, setTableHeight] = useState(calculateTableHeight(errors));
  
  useEffect(() => {
    const resizeHandler = () => {
      setTableHeight((prevHeight) => {
        // @ts-expect-error
        AP.sizeToParent();
        return calculateTableHeight(errors);
      });
    };
    window.addEventListener("resize", resizeHandler);
    resizeHandler();
    return () => window.removeEventListener("resize", resizeHandler);
  }, [errors]);

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
