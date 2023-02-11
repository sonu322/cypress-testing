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
  const autoHideEmptyColsSelected = selectedSettingsDropdownIds.includes(
    autoHideEmptyColumnsId
  );
  const columnsToDisplay = [];
  if (autoHideEmptyColsSelected) {
    filteredIssues.forEach((issue) => {
      Object.keys(issue.sortedLinks).forEach((key) => {
        if (isIssueTypeReport) {
          if (!columnsToDisplay.includes(issue.sortedLinks[key][0].type.id)) {
            if (
              selectedTableFieldIds.includes(issue.sortedLinks[key][0].type.id)
            ) {
              columnsToDisplay.push(issue.sortedLinks[key][0].type.id);
            }
          }
        } else {
          if (!columnsToDisplay.includes(key)) {
            if (selectedTableFieldIds.includes(key)) {
              columnsToDisplay.push(key);
            }
          }
        }
      });
    });
  } else {
    columnsToDisplay.push(...selectedTableFieldIds);
  }

  // TODO: probably we may improve this calculation
  const calculateTableHeight = (errors): number => {
    const headingHeight = 40 + 8; // 8: margin top
    const toolbarHeight = 94 + 8; // 8: table top margin
    const footerHeight = 32 + 8 + 8;
    const // more button 8: margin top and bottom
      errorsHeight = errors?.length > 0 ? (52 + 8) * errors.length : 0;
    const finalHeight =
      getScreenHeight() -
      headingHeight -
      toolbarHeight -
      footerHeight -
      errorsHeight -
      2;
    return finalHeight < 200 ? 200 : finalHeight;
  };

  const [tableHeight, setTableHeight] = useState(calculateTableHeight(errors));

  useEffect(() => {
    const resizeHandler = (): void => {
      setTableHeight(() => {
        if (_AP !== null) {
          _AP.sizeToParent();
        }

        return calculateTableHeight(errors);
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
                  // rowSno={index + 1}
                />
              ) : (
                <LinkTypeRow
                  selectedSettingsDropdownIds={selectedSettingsDropdownIds}
                  selectedTableFieldIds={columnsToDisplay}
                  issueFieldIds={issueFieldIds}
                  issue={issue}
                  rowSno={index + serialNo}
                  // rowSno={index + 1}
                />
              )}
            </BorderTr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
