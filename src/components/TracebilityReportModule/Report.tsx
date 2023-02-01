import React, { useContext, useEffect, useState } from "react";
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
import TracebilityReportUtils from "../../util/tracebilityReportsUtils";
import { APIContext } from "../../context/api";

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
  border-collapse: collapse;
`;

// @ts-expect-error
const _AP: any = typeof AP !== "undefined" ? AP : null;

interface Props {
  filteredIssues: IssueWithSortedLinks[];
  tableFields: IssueType[] | IssueLinkType[];
  selectedTableFieldIds: string[];
  selectedIssueInCellIds: string[];
  issueFieldIds: string[];
  isIssueTypeReport: boolean;
  errors: any[];
}
export const Report = ({
  filteredIssues,
  tableFields,
  selectedTableFieldIds,
  selectedIssueInCellIds,
  issueFieldIds,
  isIssueTypeReport,
  errors,
}: Props): JSX.Element => {
  const api = useContext(APIContext);
  const traceabilityUtils = new TracebilityReportUtils(api);
  const initialHeight = traceabilityUtils.calculateTableHeight(errors);
  const [tableHeight, setTableHeight] = useState(initialHeight);

  useEffect(() => {
    const resizeHandler = (): void => {
      setTableHeight(() => {
        if (_AP !== null) {
          _AP.sizeToParent();
        }

        return traceabilityUtils.calculateTableHeight(errors);
      });
    };
    window.addEventListener("resize", resizeHandler);
    resizeHandler();
    return () => window.removeEventListener("resize", resizeHandler);
  }, [errors]);
  return (
    <Container style={{ maxHeight: tableHeight }}>
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
                  selectedIssueInCellIds={selectedIssueInCellIds}
                  selectedTableFieldIds={selectedTableFieldIds}
                  issueFieldIds={issueFieldIds}
                  issue={issue}
                  rowSno={index + 1}
                />
              ) : (
                <LinkTypeRow
                  selectedIssueInCellIds={selectedIssueInCellIds}
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
