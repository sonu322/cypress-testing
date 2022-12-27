import React, { useContext, useEffect, useState } from "react";
import { LoadingButton } from "@atlaskit/button";
import Spinner from "@atlaskit/spinner";
import { APIContext } from "../../context/api";
import styled from "styled-components";
import { Report } from "./Report";
import TracebilityReportUtils from "../../util/tracebilityReportsUtils";
import {
  IssueField,
  IssueLinkType,
  IssueType,
  IssueWithSortedLinks,
} from "../../types/api";
import { useTranslation } from "react-i18next";
import { DropdownSingleSelect } from "../common/DropdownSingleSelect";
import { TreeReport } from "./TreeReport";
const Container = styled.div`
  width: 100%;
`;
const FullHeightContainer = styled.div``;
const TableContainer = styled.div`
  display: flex;
`;
const MarginAddedContainer = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
`;
const DEFAULT_ROWS_PER_PAGE = 20;
const START_INDEX = 0;
const options = [
  { id: 10, name: "10" },
  { id: 20, name: "20" },
  { id: 50, name: "50" },
  { id: 100, name: "100" },
];
interface Props {
  jqlString: string;
  handleNewError: (err: unknown) => void;
  clearAllErrors: () => void;
  issueFields: IssueField[];
  selectedIssueFieldIds: string[];
  selectedTableFieldIds: string[];
  tableFields: IssueType[] | IssueLinkType[];
  filteredIssues: IssueWithSortedLinks[];
  areIssuesLoading: boolean;
  setAreIssuesLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFilteredIssues: React.Dispatch<
    React.SetStateAction<IssueWithSortedLinks[]>
  >;
  // isIssueTypeReport: boolean;
  errors: any[];
  selectedViewTab: string;
}

export const Main = ({
  jqlString,
  handleNewError,
  clearAllErrors,
  issueFields,
  selectedIssueFieldIds,
  selectedTableFieldIds,
  tableFields,
  filteredIssues,
  areIssuesLoading,
  setAreIssuesLoading,
  setFilteredIssues,
  // isIssueTypeReport,
  errors,
  selectedViewTab,
}: Props): JSX.Element => {
  const [totalNumberOfIssues, setTotalNumberOfIssues] = useState(0);
  const [areMoreIssuesLoading, setAreMoreIssuesLoading] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(0);
  const { t } = useTranslation();
  const api = useContext(APIContext);
  const addMoreIssues = (issues: IssueWithSortedLinks[]): void => {
    const newIssues = filteredIssues ?? [];
    const updatedIssues = newIssues.concat(issues);
    setFilteredIssues(updatedIssues);
  };
  const updateIssues = (issues: IssueWithSortedLinks[]): void => {
    setFilteredIssues(issues);
  };
  const tracebilityReportUtils = new TracebilityReportUtils(api);
  useEffect(() => {
    if (jqlString !== null) {
      void tracebilityReportUtils.populateIssues(
        jqlString,
        issueFields,
        START_INDEX,
        DEFAULT_ROWS_PER_PAGE,
        updateIssues,
        setAreIssuesLoading,
        setTotalNumberOfIssues,
        handleNewError,
        clearAllErrors
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jqlString]);

  useEffect(() => {
    if (selectedOptionId !== 0) {
      fetchMoreIssues();
    }
  }, [selectedOptionId]);

  const fetchMoreIssues = (): void => {
    const selectedLimit = selectedOptionId ?? DEFAULT_ROWS_PER_PAGE;
    void tracebilityReportUtils.populateIssues(
      jqlString,
      issueFields,
      filteredIssues.length,
      selectedLimit,
      addMoreIssues,
      setAreMoreIssuesLoading,
      null,
      handleNewError,
      undefined
    );
  };
  console.log(selectedViewTab);
  const isIssueTypeReport = selectedViewTab === "issuetype-view";
  const isTreeReport = selectedViewTab === "tree-view";
  if (areIssuesLoading) {
    return (
      <FullHeightContainer>
        <Spinner size="medium" />
      </FullHeightContainer>
    );
  } else if (jqlString !== null && filteredIssues != null) {
    if (filteredIssues.length === 0) {
      return (
        <FullHeightContainer>
          <em>{t("lxp.common.no-issues-text")}</em>
        </FullHeightContainer>
      );
    }
    return (
      <Container>
        <TableContainer>
          {isTreeReport ? (
            <TreeReport
              filteredIssues={filteredIssues}
              issueFieldIds={selectedIssueFieldIds}
              tableFields={tableFields}
              selectedTableFieldIds={selectedTableFieldIds}
              isIssueTypeReport={isIssueTypeReport}
              errors={errors}
            />
          ) : (
            <Report
              filteredIssues={filteredIssues}
              issueFieldIds={selectedIssueFieldIds}
              tableFields={tableFields}
              selectedTableFieldIds={selectedTableFieldIds}
              isIssueTypeReport={isIssueTypeReport}
              errors={errors}
            />
          )}
        </TableContainer>
        <MarginAddedContainer>
          <DropdownSingleSelect
            options={options}
            dropdownName="Issue Limit"
            selectedOptionId={selectedOptionId}
            setSelectedOptionId={setSelectedOptionId}
          />
          <LoadingButton
            isLoading={areMoreIssuesLoading}
            isDisabled={filteredIssues.length >= totalNumberOfIssues}
            onClick={fetchMoreIssues}
          >
            {t("traceability-report.load-more-issues-button.name")}
          </LoadingButton>
        </MarginAddedContainer>
      </Container>
    );
  } else {
    return (
      <FullHeightContainer>
        <em>{t("traceability-report.select-filter.text")}</em>
      </FullHeightContainer>
    );
  }
};
