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
import TracebilityReportUtils, {
  exportReport,
  handleSetItemInSavedReportConfig,
  orderSelectedIds,
} from "../../util/tracebilityReportsUtils";
import { getItemInLocalStorage, getKeyValues } from "../../util/common";
import {
  autoHideEmptyColumnsId,
  reportCellOptions,
  viewTabs,
  exportTabularReportOptions,
  exportAllRecordsId,
  exportCurrentPageId,
  exportTreeReportOptions,
  ISSUE_TYPE_VIEW_ID,
  LINK_TYPE_VIEW_ID,
} from "../../constants/traceabilityReport";
import { TreeReportToolbar } from "./TreeReportToolbar";
import { TreeFilterContext } from "../../context/treeFilterContext";
import TreeUtils from "../../util/TreeUtils";
import { lastSavedReportConfigKey } from "../../constants/common";
import { LastSavedReportConfig } from "../../types/app";
import { ExportRecordsLoadingModal } from "./ExportRecordsLoadingModal";
import { DashboardContext } from "../common/Dashboard/DashboardContext";
import {
  ISSUE_CARD_FIELDS_DROPDOWN_NAME,
  JQL_FIELD_NAME,
  SELECTED_ISSUE_TYPE_IDS_KEY,
  SELECTED_LINK_TYPE_IDS_KEY,
  VIEW_TYPE_FIELD_NAME,
} from "../../constants/gadgetTraceability";

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
  isFromDashboardGadget?: boolean;
}
const DEFAULT_ROWS_PER_PAGE = 20;

export const TracebilityReportModule = ({
  showCustomJQLEditor,
  isFromDashboardGadget,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const treeFilterContext = useContext(TreeFilterContext);
  const [isOrphansBranchPresent, setIsOrphansBranchPresent] =
    useState<Boolean>();
  const [areOptionsLoading, setAreOptionsLoading] = useState(true);
  const [selectedSettingsDropdownIds, setSelectedSettingsDropdownIds] =
    useState<string[]>([autoHideEmptyColumnsId]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredIssues, setFilteredIssues] = useState<
    IssueWithSortedLinks[] | null
  >(null);
  const [selectedJQLString, setSelectedJQLString] = useState<string | null>();
  const [issueFields, setIssueFields] = useState<IssueField[]>([]);
  const [selectedIssueFieldIds, setSelectedIssueFieldIds] =
    useState<string[]>();
  const [issueTypes, setIssueTypes] = useState<IssueType[]>([]);
  const [selectedIssueTypeIds, setSelectedIssueTypeIds] = useState<string[]>();
  const [linkTypes, setLinkTypes] = useState<IssueLinkType[]>([]);
  const [selectedLinkTypeIds, setSelectedLinkTypeIds] = useState<string[]>();
  const [areIssuesLoading, setAreIssuesLoading] = useState(false);
  const [errors, setErrors] = useState<unknown[]>([]);
  const [isToggleOrphansLoading, setIsToggleOrphansLoading] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState<SelectedType>();
  const [totalNumberOfIssues, setTotalNumberOfIssues] = useState(0);
  const [isExportReportLoading, setIsExportReportLoading] = useState(false);
  const dashboardContext = useContext(DashboardContext);
  console.log("DASHBOARD CONTEXT", dashboardContext);

  useEffect(() => {
    if (selectedTabIndex !== undefined) {
      handleSetItemInSavedReportConfig("selectedTabIndex", selectedTabIndex);
    }
  }, [selectedTabIndex]);
  useEffect(() => {
    if (selectedJQLString !== undefined) {
      handleSetItemInSavedReportConfig("selectedJQLString", selectedJQLString);
    }
  }, [selectedJQLString]);
  useEffect(() => {
    if (
      selectedIssueTypeIds !== undefined &&
      selectedIssueTypeIds.length >= 0
    ) {
      handleSetItemInSavedReportConfig(
        "selectedIssueTypeIds",
        selectedIssueTypeIds
      );
    }
    if (selectedLinkTypeIds !== undefined && selectedLinkTypeIds.length >= 0) {
      handleSetItemInSavedReportConfig(
        "selectedLinkTypeIds",
        selectedLinkTypeIds
      );
    }
  }, [selectedIssueTypeIds, selectedLinkTypeIds]);

  useEffect(() => {
    if (selectedIssueFieldIds !== undefined && selectedIssueFieldIds !== null) {
      handleSetItemInSavedReportConfig(
        "selectedIssueFieldIds",
        selectedIssueFieldIds
      );
    }
  }, [selectedIssueFieldIds]);

  useEffect(() => {
    const lastSavedReportConfig: LastSavedReportConfig = getItemInLocalStorage(
      lastSavedReportConfigKey
    );
    if (
      lastSavedReportConfig !== undefined &&
      lastSavedReportConfig !== null &&
      !isFromDashboardGadget
    ) {
      if (
        lastSavedReportConfig.selectedTabIndex !== undefined &&
        lastSavedReportConfig.selectedTabIndex !== null
      ) {
        setSelectedTabIndex(lastSavedReportConfig.selectedTabIndex);
      }
      setSelectedJQLString(lastSavedReportConfig.selectedJQLString);
      if (lastSavedReportConfig.isOrphansBranchPresent !== undefined) {
        setIsOrphansBranchPresent(lastSavedReportConfig.isOrphansBranchPresent);
      } else {
        setIsOrphansBranchPresent(false);
      }
    } else {
      setSelectedTabIndex(0);
      setIsOrphansBranchPresent(false);
    }
  }, []);

  useEffect(() => {
    if (
      isFromDashboardGadget &&
      Boolean(dashboardContext.config[VIEW_TYPE_FIELD_NAME])
    ) {
      const tabIndex = viewTabs.tabs.findIndex(
        (tab) => tab.id === dashboardContext.config[VIEW_TYPE_FIELD_NAME]
      );

      setSelectedTabIndex(tabIndex);
      setSelectedJQLString(dashboardContext.config[JQL_FIELD_NAME]);
    }
  }, [dashboardContext, isFromDashboardGadget]);

  const api = useContext(APIContext);
  const treeUtils = new TreeUtils(api);
  const tracebilityReportUtils = new TracebilityReportUtils(api);
  const [tree, setTree] = useState(treeUtils.getRootTree());
  const updateSelectedJQLString = (jqlString: string): void => {
    setSelectedJQLString(jqlString);
  };
  const updateIsOrphansBranchPresent = (
    newIsOrphansBranchPresent: boolean
  ): void => {
    setIsOrphansBranchPresent(newIsOrphansBranchPresent);
    if (newIsOrphansBranchPresent) {
      setIsToggleOrphansLoading(true);
      setTree((tree) => treeUtils.addOrphansBranch(tree));
      setIsToggleOrphansLoading(false);
    }
    if (newIsOrphansBranchPresent !== undefined) {
      handleSetItemInSavedReportConfig(
        "isOrphansBranchPresent",
        newIsOrphansBranchPresent
      );
    }
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
    setErrors((prevErrors) => [...prevErrors, err]);
  };
  const clearAllErrors = (): void => {
    setErrors([]);
  };
  useEffect(() => {
    console.log("DAASHBOARD CONTEXT!!!!!!!!!!!!!!!!");
    console.log(dashboardContext);
    const loadData = async (): Promise<void> => {
      console.log("loaddata called");
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

        // setting state - table field options
        console.log("is form dashboard", isFromDashboardGadget);
        setIssueTypes(issueTypes);
        const lastSavedReportConfig: LastSavedReportConfig =
          getItemInLocalStorage(lastSavedReportConfigKey);
        setLinkTypes(linkTypes);
        if (!isFromDashboardGadget) {
          if (
            lastSavedReportConfig?.selectedIssueTypeIds !== undefined &&
            lastSavedReportConfig?.selectedIssueTypeIds !== null
          ) {
            setSelectedIssueFieldIds(
              lastSavedReportConfig.selectedIssueFieldIds
            );
          } else {
            const selectedFieldIds = getKeyValues(fields, "id");
            setSelectedIssueFieldIds(selectedFieldIds);
          }

          if (
            lastSavedReportConfig.selectedIssueTypeIds !== undefined &&
            lastSavedReportConfig.selectedIssueTypeIds !== null
          ) {
            setSelectedIssueTypeIds(lastSavedReportConfig.selectedIssueTypeIds);
          } else {
            setSelectedIssueTypeIds(getKeyValues(issueTypes, "id"));
          }
          if (
            lastSavedReportConfig?.selectedLinkTypeIds !== undefined &&
            lastSavedReportConfig?.selectedLinkTypeIds !== null
          ) {
            setSelectedLinkTypeIds(lastSavedReportConfig.selectedLinkTypeIds);
          } else {
            setSelectedLinkTypeIds(getKeyValues(linkTypes, "id"));
          }
        } else {
          console.log("code from isdashboard");
          if (
            dashboardContext.config[ISSUE_CARD_FIELDS_DROPDOWN_NAME] !==
            undefined
          ) {
            console.log(
              dashboardContext.config[ISSUE_CARD_FIELDS_DROPDOWN_NAME]
            );
            setSelectedIssueFieldIds(
              dashboardContext.config[ISSUE_CARD_FIELDS_DROPDOWN_NAME]
            );
          } else {
            const selectedFieldIds = getKeyValues(fields, "id");
            setSelectedIssueFieldIds(selectedFieldIds);
          }
          if (Boolean(dashboardContext.config[VIEW_TYPE_FIELD_NAME])) {
            console.log("setting from config");
            console.log(dashboardContext.config);
            console.log(
              SELECTED_LINK_TYPE_IDS_KEY,
              dashboardContext.config[SELECTED_LINK_TYPE_IDS_KEY]
            );
            console.log(
              SELECTED_ISSUE_TYPE_IDS_KEY,
              dashboardContext.config[SELECTED_ISSUE_TYPE_IDS_KEY]
            );
            setSelectedLinkTypeIds(
              dashboardContext.config[SELECTED_LINK_TYPE_IDS_KEY]
            );
            setSelectedIssueTypeIds(
              dashboardContext.config[SELECTED_ISSUE_TYPE_IDS_KEY]
            );
          } else {
            console.log("setting from else");
            console.log(dashboardContext.config);
            setSelectedLinkTypeIds(getKeyValues(linkTypes, "id"));
            setSelectedIssueTypeIds(getKeyValues(issueTypes, "id"));
          }
        }

        // loading state
        setAreOptionsLoading(false);
      } catch (error) {
        setAreOptionsLoading(false);
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
    selectedTableFieldIds?.length > 0
      ? selectedTableFieldIds
      : allTableFieldIds;
  const title = t("otpl.lxp.traceability-report.name");
  const selectedViewTab = viewTabs.tabs[selectedTabIndex].id;
  const isTreeReport = selectedViewTab === "tree-view";
  let areTreeNecessitiesPresent = false;
  if (treeFilterContext !== undefined && treeFilterContext !== null) {
    if (
      treeFilterContext.options !== undefined &&
      treeFilterContext.options !== null
    ) {
      if (
        treeFilterContext.filter !== undefined &&
        treeFilterContext.filter !== null
      ) {
        areTreeNecessitiesPresent = true;
      }
    }
  }

  const allErrors = errors.concat(treeFilterContext.errors);
  const updateTotalNumberOfIssues = (totalNumberOfIssues: number): void => {
    setTotalNumberOfIssues(totalNumberOfIssues);
  };
  const updateIsExportReportLoading = (
    isExportReportLoading: boolean
  ): void => {
    setIsExportReportLoading(isExportReportLoading);
  };
  const exportAction = async (exportTypeId: string): Promise<void> => {
    // TODO: use enum for exportTypeId
    if (exportTypeId === exportCurrentPageId) {
      if (isTreeReport) {
        treeUtils.exportTree(tree, issueFields, selectedIssueFieldIds);
      } else {
        exportReport(
          selectedTableFieldIds,
          linkTypes,
          issueFields,
          selectedIssueFieldIds,
          filteredIssues,
          isIssueTypeReport
        );
      }
    } else if (exportTypeId === exportAllRecordsId) {
      const allFilteredIssues = await tracebilityReportUtils.getFilteredIssues(
        selectedJQLString,
        issueFields,
        0,
        totalNumberOfIssues,
        updateIsExportReportLoading,
        handleNewError
      );
      exportReport(
        selectedTableFieldIds,
        linkTypes,
        issueFields,
        selectedIssueFieldIds,
        allFilteredIssues,
        isIssueTypeReport
      );
    }
  };
  return (
    <FullWidthContainer>
      <ExportRecordsLoadingModal
        isExportReportLoading={isExportReportLoading}
      />
      <PageHeader
        bottomBar={
          <>
            {console.log(
              selectedIssueFieldIds,
              selectedLinkTypeIds,
              selectedIssueTypeIds
            )}
            {selectedIssueFieldIds !== undefined &&
              selectedIssueTypeIds !== undefined &&
              selectedLinkTypeIds !== undefined && (
                <Toolbar
                  selectedSettingsDropdownIds={selectedSettingsDropdownIds}
                  setSelectedSettingsDropdownIds={
                    setSelectedSettingsDropdownIds
                  }
                  settingsDropdown={reportCellOptions}
                  updateSelectedJQLString={updateSelectedJQLString}
                  exportReport={exportAction}
                  exportDropdownOptions={
                    isTreeReport
                      ? exportTreeReportOptions
                      : exportTabularReportOptions
                  }
                  isFromDashboardGadget={isFromDashboardGadget}
                  selectedJQLString={selectedJQLString}
                  issueCardOptions={issueFields}
                  selectedIssueFieldIds={selectedIssueFieldIds}
                  setSelectedIssueFieldIds={setSelectedIssueFieldIds}
                  selectedViewTab={selectedViewTab}
                  selectedTableFieldIds={selectedTableFieldIds}
                  updateSelectedTableFieldIds={updateSelectedTableFieldIds}
                  tableFields={tableFields}
                  showCustomJQLEditor={showCustomJQLEditor}
                  isExportDisabled={isExportDisabled}
                  handleNewError={handleNewError}
                  handleTabOptionSelect={handleTabOptionSelect}
                  selectedTabIndex={selectedTabIndex}
                />
              )}
            {isTreeReport && areTreeNecessitiesPresent && (
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
          totalNumberOfIssues={totalNumberOfIssues}
          updateTotalNumberOfIssues={updateTotalNumberOfIssues}
          selectedJqlString={selectedJQLString}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          DEFAULT_ROWS_PER_PAGE={DEFAULT_ROWS_PER_PAGE}
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
          isFromDashboardGadget={isFromDashboardGadget}
        />
      </GrowContainer>
    </FullWidthContainer>
  );
};
