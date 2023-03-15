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
import { autoHideEmptyColumnsId } from "../../constants/traceabilityReport";
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
  selectedSettingsDropdownIds: string[];
  issueFieldIds: string[];
  isIssueTypeReport: boolean;
  errors: any[];
  serialNo: number;
}
export const Report = ({
  filteredIssues,
  tableFields,
  selectedTableFieldIds,
  selectedSettingsDropdownIds,
  issueFieldIds,
  isIssueTypeReport,
  errors,
  serialNo,
}: Props): JSX.Element => {
  const api = useContext(APIContext);
  const traceabilityUtils = new TracebilityReportUtils(api);
  const initialHeight = traceabilityUtils.calculateTableHeight(errors);
  const [tableHeight, setTableHeight] = useState(initialHeight);
  const autoHideEmptyColsSelected = selectedSettingsDropdownIds.includes(
    autoHideEmptyColumnsId
  );
  const columnsToDisplay = [];
  if (autoHideEmptyColsSelected) {
    filteredIssues.forEach((issue) => {
      Object.keys(issue.sortedLinks).forEach((key) => {
        const linkArray = issue.sortedLinks[key];
        console.log(linkArray, "linkArray");
        if (linkArray !== undefined && linkArray.length > 0) {
          if (isIssueTypeReport) {
            linkArray.forEach((link) => {
              const typeId = link.type.id;
              if (
                !columnsToDisplay.includes(typeId) &&
                selectedTableFieldIds.includes(typeId)
              ) {
                columnsToDisplay.push(typeId);
              }
            });
          } else {
            if (
              !columnsToDisplay.includes(key) &&
              selectedTableFieldIds.includes(key)
            ) {
              columnsToDisplay.push(key);
            }
          }
        }
      });
    });
  } else {
    columnsToDisplay.push(...selectedTableFieldIds);
  }

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
          selectedFieldIds={columnsToDisplay}
          fields={tableFields}
        />
        <tbody>
          {filteredIssues.map((issue, index) => (
            <BorderTr key={`${issue.issueKey}`}>
              {isIssueTypeReport ? (
                <IssueTypeRow
                  selectedSettingsDropdownIds={selectedSettingsDropdownIds}
                  selectedTableFieldIds={columnsToDisplay}
                  issueFieldIds={issueFieldIds}
                  issue={issue}
                  rowSno={index + serialNo}
                />
              ) : (
                <LinkTypeRow
                  selectedSettingsDropdownIds={selectedSettingsDropdownIds}
                  selectedTableFieldIds={columnsToDisplay}
                  issueFieldIds={issueFieldIds}
                  issue={issue}
                  rowSno={index + serialNo}
                />
              )}
            </BorderTr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
