import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { APIContext } from "../../context/api";
import PageHeader from "@atlaskit/page-header";
import { SelectedType } from "@atlaskit/tabs/types";
import { Toolbar } from "./Toolbar";
import { useTranslation } from "react-i18next";
import {
  IssueField,
  IssueLinkType,
  IssueType,
  IssueWithSortedLinks,
} from "../../types/api";
import { Main } from "./Main";
import { ErrorsList } from "../common/ErrorsList";
import {
  exportReport,
  orderSelectedIds,
} from "../../util/tracebilityReportsUtils";
import { getKeyValues } from "../../util/common";
import {
  autoHideEmptyColumnsId,
  reportCellOptions,
  viewTabs,
} from "../../constants/traceabilityReport";
import { TreeReportToolbar } from "./TreeReportToolbar";
import { TreeFilterContext } from "../../context/treeFilterContext";
import TreeUtils from "../../util/TreeUtils";

const FullWidthContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: -16px;
`;
const GrowContainer = styled.div`
  flex-grow: 1;
  display: flex;
`;

interface Props {
  showCustomJQLEditor?: any;
}

export const TracebilityReportModule = ({
  showCustomJQLEditor,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const treeFilterContext = useContext(TreeFilterContext);
  const [isOrphansBranchPresent, setIsOrphansBranchPresent] = useState(false);
  const [areOptionsLoading, setAreOptionsLoading] = useState(true);
  const [selectedSettingsDropdownIds, setSelectedSettingsDropdownIds] =
    useState<string[]>([autoHideEmptyColumnsId]);
  const [filteredIssues, setFilteredIssues] = useState<
    IssueWithSortedLinks[] | null
  >(null);
  const [selectedJQLString, setSelectedJQLString] = useState<string | null>(
    null
  );
  const [issueFields, setIssueFields] = useState<IssueField[]>([]);
  const [selectedIssueFieldIds, setSelectedIssueFieldIds] = useState<string[]>(
    []
  );
  const [issueTypes, setIssueTypes] = useState<IssueType[]>([]);
  const [selectedIssueTypeIds, setSelectedIssueTypeIds] = useState<string[]>(
    []
  );
  const [linkTypes, setLinkTypes] = useState<IssueLinkType[]>([]);
  const [selectedLinkTypeIds, setSelectedLinkTypeIds] = useState<string[]>([]);
  const [areIssuesLoading, setAreIssuesLoading] = useState(false);
  const [errors, setErrors] = useState<unknown[]>([]);
  const [isToggleOrphansLoading, setIsToggleOrphansLoading] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState<SelectedType>(0);
  const api = useContext(APIContext);
  const treeUtils = new TreeUtils(api);
  const [tree, setTree] = useState(treeUtils.getRootTree());
  const updateIsOrphansBranchPresent = (
    isOrphansBranchPresent: boolean
  ): void => {
    setIsOrphansBranchPresent(isOrphansBranchPresent);
  };
  const updateFilteredKeyOptions = (
    key: string,
    keyOptions: string[]
  ): void => {
    treeFilterContext.updateFilter((prevFilter) => {
      const newFilter = { ...prevFilter };
      newFilter[key] = keyOptions;
      return newFilter;
    });
  };
  const handleTabOptionSelect = (tabIndex: SelectedType): void => {
    setSelectedTabIndex(tabIndex);
  };
  const handleNewError = (err: unknown): void => {
    console.error(err);
    setErrors((prevErrors) => [...prevErrors, err]);
  };
  const clearAllErrors = (): void => {
    setErrors([]);
  };
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const result = await Promise.all([
          api.getIssueTypes(),
          api.getIssueLinkTypes(),
          api.getIssueFields(),
        ]);

        const issueTypes = result[0];
        const linkTypes = result[1];
        const fields = result[2];
        setIssueFields(fields);
        // setting state - selected field ids
        const selectedFieldIds = getKeyValues(fields, "id");
        setSelectedIssueFieldIds(selectedFieldIds);

        // setting state - table field options

        setIssueTypes(issueTypes);
        setSelectedIssueTypeIds(getKeyValues(issueTypes, "id"));
        setLinkTypes(linkTypes);
        setSelectedLinkTypeIds(getKeyValues(linkTypes, "id"));

        // loading state
        setAreOptionsLoading(false);
      } catch (error) {
        setAreOptionsLoading(false);
        console.error(error);
        handleNewError(error);
      }
    };
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isExportDisabled =
    filteredIssues == null || filteredIssues.length === 0;

  if (areOptionsLoading) {
    return <div>{t("otpl.lxp.common.loading")}</div>;
  }
  const updateSelectedIssueTypeIds = (fieldIds: string[]): void => {
    const newSelectedIds = orderSelectedIds(fieldIds, issueTypes);
    setSelectedIssueTypeIds(newSelectedIds);
  };
  const updateSelectedLinkTypeIds = (fieldIds: string[]): void => {
    const newSelectedIds = orderSelectedIds(fieldIds, linkTypes);
    setSelectedLinkTypeIds(newSelectedIds);
  };
  let selectedTableFieldIds: string[];
  let isIssueTypeReport: boolean;
  let updateSelectedTableFieldIds: (fieldIds: string[]) => void;
  let tableFields: IssueType[] | IssueLinkType[];
  if (selectedTabIndex === 0) {
    selectedTableFieldIds = selectedIssueTypeIds;
    tableFields = issueTypes;
    updateSelectedTableFieldIds = updateSelectedIssueTypeIds;
    isIssueTypeReport = true;
  } else {
    selectedTableFieldIds = selectedLinkTypeIds;
    tableFields = linkTypes;
    updateSelectedTableFieldIds = updateSelectedLinkTypeIds;
    isIssueTypeReport = false;
  }
  const allTableFieldIds = tableFields.map((field) => field.id);

  const emptyEqualsAllTableIds =
    selectedTableFieldIds.length > 0 ? selectedTableFieldIds : allTableFieldIds;
  const title = t("otpl.lxp.traceability-report.name");
  const selectedViewTab = viewTabs.tabs[selectedTabIndex].id;
  const isTreeReport = selectedViewTab === "tree-view";
  const allErrors = errors.concat(treeFilterContext.errors);

  return (
    <FullWidthContainer>
      <PageHeader
        bottomBar={
          <>
            <Toolbar
              selectedSettingsDropdownIds={selectedSettingsDropdownIds}
              setSelectedSettingsDropdownIds={setSelectedSettingsDropdownIds}
              settingsDropdown={reportCellOptions}
              selectedJQLString={selectedJQLString}
              setSelectedJQLString={setSelectedJQLString}
              issueCardOptions={issueFields}
              selectedIssueFieldIds={selectedIssueFieldIds}
              setSelectedIssueFieldIds={setSelectedIssueFieldIds}
              selectedViewTab={selectedViewTab}
              selectedTableFieldIds={selectedTableFieldIds}
              updateSelectedTableFieldIds={updateSelectedTableFieldIds}
              tableFields={tableFields}
              exportReport={() => {
                if (isTreeReport) {
                  treeUtils.exportMultiTree(tree);
                } else {
                  exportReport(
                    tableFields,
                    emptyEqualsAllTableIds,
                    filteredIssues,
                    isIssueTypeReport
                  );
                }
              }}
              showCustomJQLEditor={showCustomJQLEditor}
              isExportDisabled={isExportDisabled}
              handleNewError={handleNewError}
              handleTabOptionSelect={handleTabOptionSelect}
              selectedTabIndex={selectedTabIndex}
            />
            {isTreeReport && (
              <TreeReportToolbar
                options={treeFilterContext.options}
                filter={treeFilterContext.filter}
                updateFilteredKeyOptions={updateFilteredKeyOptions}
                isOrphansBranchPresent={isOrphansBranchPresent}
                updateIsOrphansBranchPresent={updateIsOrphansBranchPresent}
                isToggleOrphansLoading={isToggleOrphansLoading}
              />
            )}
          </>
        }
      >
        {api.isJiraCloud() && title}
      </PageHeader>
      {allErrors.length > 0 && <ErrorsList errors={errors} />}
      <GrowContainer>
        <Main
          selectedJqlString={selectedJQLString}
          handleNewError={handleNewError}
          clearAllErrors={clearAllErrors}
          issueFields={issueFields}
          selectedIssueFieldIds={selectedIssueFieldIds}
          selectedSettingsDropdownIds={selectedSettingsDropdownIds}
          tableFields={tableFields}
          selectedTableFieldIds={emptyEqualsAllTableIds}
          filteredIssues={filteredIssues}
          setFilteredIssues={setFilteredIssues}
          areIssuesLoading={areIssuesLoading}
          setAreIssuesLoading={setAreIssuesLoading}
          selectedViewTab={viewTabs.tabs[selectedTabIndex].id}
          errors={errors}
          issueTreeFilter={treeFilterContext.filter}
          isOrphansBranchPresent={isOrphansBranchPresent}
          isToggleOrphansLoading={isToggleOrphansLoading}
          updateIsToggleOrphansLoading={(isToggleOrphansLoading: boolean) => {
            setIsToggleOrphansLoading(isToggleOrphansLoading);
          }}
          tree={tree}
          setTree={setTree}
        />
      </GrowContainer>
    </FullWidthContainer>
  );
};
