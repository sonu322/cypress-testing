import React, { useContext, useEffect, useMemo, useState } from "react";
import { LoadingButton } from "@atlaskit/button";
import { TablePagination } from "./TablePagination";
import Spinner from "@atlaskit/spinner";
import { APIContext } from "../../context/api";
import styled from "styled-components";
import { Report } from "./Report";
import TracebilityReportUtils from "../../util/tracebilityReportsUtils";
import {
  IssueField,
  IssueLinkType,
  IssueTreeFilter,
  IssueType,
  IssueWithSortedLinks,
} from "../../types/api";
import { useTranslation } from "react-i18next";
import { DropdownSingleSelect } from "../common/DropdownSingleSelect";
import { TreeReport } from "./TreeReport";
import { AtlasTree } from "../../types/app";
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
const START_INDEX = 0;
const options = [
  { id: 10, name: "10" },
  { id: 20, name: "20" },
  { id: 50, name: "50" },
  { id: 100, name: "100" },
];
interface Props {
  DEFAULT_ROWS_PER_PAGE: number;
  selectedJqlString: string;
  handleNewError: (err: unknown) => void;
  clearAllErrors: () => void;
  issueFields: IssueField[];
  selectedIssueFieldIds: string[];
  selectedTableFieldIds: string[];
  tableFields: IssueType[] | IssueLinkType[];
  selectedSettingsDropdownIds: string[];
  filteredIssues: IssueWithSortedLinks[];
  areIssuesLoading: boolean;
  setAreIssuesLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFilteredIssues: React.Dispatch<
    React.SetStateAction<IssueWithSortedLinks[]>
  >;
  errors: any[];
  selectedViewTab: string;
  issueTreeFilter: IssueTreeFilter;
  isOrphansBranchPresent: boolean;
  tree: AtlasTree;
  setTree: React.Dispatch<React.SetStateAction<AtlasTree>>;
  isToggleOrphansLoading: boolean;
  updateIsToggleOrphansLoading: (isToggleOrphansLoading: boolean) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const Main = ({
  DEFAULT_ROWS_PER_PAGE,
  selectedJqlString,
  handleNewError,
  clearAllErrors,
  issueFields,
  selectedIssueFieldIds,
  selectedTableFieldIds,
  tableFields,
  selectedSettingsDropdownIds,
  filteredIssues,
  areIssuesLoading,
  setAreIssuesLoading,
  setFilteredIssues,
  issueTreeFilter,
  errors,
  selectedViewTab,
  isOrphansBranchPresent,
  tree,
  setTree,
  isToggleOrphansLoading,
  updateIsToggleOrphansLoading,
  currentPage,
  setCurrentPage,
}: Props): JSX.Element => {
  const [totalNumberOfIssues, setTotalNumberOfIssues] = useState(0);
  const [areMoreIssuesLoading, setAreMoreIssuesLoading] = useState(false);
  const [selectedLimitOptionId, setSelectedLimitOptionId] = useState(
    DEFAULT_ROWS_PER_PAGE
  );
  const [totalIssuesFetched, setTotalIssuesFetched] = useState(0);
  console.log(currentPage, "currentPage from main file");
  const updateCurrentPage = (page: number) => {
    areMoreIssuesLoading && setAreMoreIssuesLoading(true);
    setCurrentPage(page);
    setAreMoreIssuesLoading(false);
  };

  const { t } = useTranslation();
  const api = useContext(APIContext);
  const addMoreIssues = (issues: IssueWithSortedLinks[]): void => {
    const newIssues = filteredIssues ?? [];
    const updatedIssues = newIssues.concat(issues);
    setFilteredIssues(updatedIssues);
    setTotalIssuesFetched(updatedIssues.length);
  };
  const updateIssues = (issues: IssueWithSortedLinks[]): void => {
    setFilteredIssues(issues);
  };
  const serialNo = 20 * (currentPage - 1) + 1;
  const tracebilityReportUtils = new TracebilityReportUtils(api);
  useEffect(() => {
    if (selectedJqlString !== null) {
      const selectedLimit = selectedLimitOptionId ?? DEFAULT_ROWS_PER_PAGE;
      setCurrentPage(1);
      setTotalIssuesFetched(0);
      void tracebilityReportUtils.populateIssues(
        selectedJqlString,
        issueFields,
        START_INDEX,
        selectedLimit,
        updateIssues,
        setAreIssuesLoading,
        setTotalNumberOfIssues,
        handleNewError,
        clearAllErrors
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedJqlString]);
  useEffect(() => {
    if (filteredIssues != null) {
      const startIndex = (currentPage - 1) * DEFAULT_ROWS_PER_PAGE;
      const endIndex = startIndex + DEFAULT_ROWS_PER_PAGE;
      if (filteredIssues.length < endIndex) {
        fetchMoreIssues();
      }
    }
  }, [currentPage, totalIssuesFetched]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedViewTab, setCurrentPage]);

  const fetchMoreIssues = (): void => {
    const selectedLimit = selectedLimitOptionId ?? DEFAULT_ROWS_PER_PAGE;
    void tracebilityReportUtils.populateIssues(
      selectedJqlString,
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
  const isIssueTypeReport = selectedViewTab === "issuetype-view";
  const isTreeReport = selectedViewTab === "tree-view";
  if (areIssuesLoading) {
    return (
      <FullHeightContainer>
        <Spinner size="medium" />
      </FullHeightContainer>
    );
  } else if (selectedJqlString !== null && filteredIssues != null) {
    if (filteredIssues.length === 0) {
      return (
        <FullHeightContainer>
          <em>{t("otpl.lxp.common.no-issues-text")}</em>
        </FullHeightContainer>
      );
    }
    const currentIssues = filteredIssues.slice(
      (currentPage - 1) * DEFAULT_ROWS_PER_PAGE,
      currentPage * DEFAULT_ROWS_PER_PAGE
    );
    return (
      <Container>
        <TableContainer>
          {isTreeReport ? (
            <TreeReport
              selectedJqlString={selectedJqlString}
              filteredIssues={filteredIssues}
              selectedIssueFieldIds={selectedIssueFieldIds}
              errors={errors}
              issueFields={issueFields}
              handleError={handleNewError}
              clearAllErrors={clearAllErrors}
              issueTreeFilter={issueTreeFilter}
              isOrphansBranchPresent={isOrphansBranchPresent}
              tree={tree}
              setTree={setTree}
              isToggleOrphansLoading={isToggleOrphansLoading}
              updateIsToggleOrphansLoading={updateIsToggleOrphansLoading}
            />
          ) : (
            <Report
              serialNo={serialNo}
              filteredIssues={currentIssues}
              issueFieldIds={selectedIssueFieldIds}
              tableFields={tableFields}
              selectedTableFieldIds={selectedTableFieldIds}
              selectedSettingsDropdownIds={selectedSettingsDropdownIds}
              isIssueTypeReport={isIssueTypeReport}
              errors={errors}
            />
          )}
        </TableContainer>
        <MarginAddedContainer>
          <div style={{ display: "flex", alignItems: "center" }}>
            <DropdownSingleSelect
              options={options}
              dropdownName={
                t("otpl.lxp.traceability-report.fetch-limit-dropdown.name") +
                ` (${selectedLimitOptionId})`
              }
              selectedOptionId={selectedLimitOptionId}
              setSelectedOptionId={setSelectedLimitOptionId}
            />
            <div style={{ marginLeft: "auto" }}>
              &nbsp;
              <TablePagination
                currentPage={currentPage}
                updateCurrentPage={updateCurrentPage}
                totalNumberOfIssues={totalNumberOfIssues}
                issuePerPage={DEFAULT_ROWS_PER_PAGE}
              ></TablePagination>
            </div>
          </div>
        </MarginAddedContainer>
      </Container>
    );
  } else {
    return (
      <FullHeightContainer>
        <em>{t("otpl.lxp.traceability-report.select-filter.text")}</em>
      </FullHeightContainer>
    );
  }
};
