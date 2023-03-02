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
const DEFAULT_ROWS_PER_PAGE = 20;
const START_INDEX = 0;
const options = [
  { id: 10, name: "10" },
  { id: 20, name: "20" },
  { id: 50, name: "50" },
  { id: 100, name: "100" },
];
interface Props {
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
}

export const Main = ({
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
}: Props): JSX.Element => {
  const [totalNumberOfIssues, setTotalNumberOfIssues] = useState(0);
  const [areMoreIssuesLoading, setAreMoreIssuesLoading] = useState(false);
  const [selectedLimitOptionId, setSelectedLimitOptionId] = useState(
    DEFAULT_ROWS_PER_PAGE
  );
  const { t } = useTranslation();
  const api = useContext(APIContext);
  const addMoreIssues = (issues: IssueWithSortedLinks[]): void => {
    const newIssues = filteredIssues ?? [];
    if (issues?.length > 0) {
      const updatedIssues = newIssues.concat(issues);
      setFilteredIssues(updatedIssues);
    }
  };
  const updateIssues = (issues: IssueWithSortedLinks[]): void => {
    setFilteredIssues(issues);
  };
  const tracebilityReportUtils = new TracebilityReportUtils(api);
  useEffect(() => {
    if (selectedJqlString !== undefined && selectedJqlString !== null) {
      const selectedLimit = selectedLimitOptionId ?? DEFAULT_ROWS_PER_PAGE;
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
              selectedLimitOptionId={selectedLimitOptionId}
            />
          ) : (
            <Report
              filteredIssues={filteredIssues}
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
          <DropdownSingleSelect
            options={options}
            dropdownName={
              t("otpl.lxp.traceability-report.fetch-limit-dropdown.name") +
              ` (${selectedLimitOptionId})`
            }
            selectedOptionId={selectedLimitOptionId}
            setSelectedOptionId={setSelectedLimitOptionId}
          />
          &nbsp;
          <LoadingButton
            isLoading={areMoreIssuesLoading}
            isDisabled={filteredIssues.length >= totalNumberOfIssues}
            onClick={fetchMoreIssues}
          >
            {t("otpl.lxp.traceability-report.load-more-issues-button.name")}
          </LoadingButton>
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
