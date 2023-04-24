import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import { JQLSelectDropdown } from "../JQLSelectDropdown";
import { ButtonGroup } from "@atlaskit/button";
import { RefreshButton } from "../common/RefreshButton";
import { Dropdown } from "../common/Dropdown";
import { DropdownFields } from "../common/DropdownFields";
import { HelpLink } from "../common/HelpLink";
import { ExportContent } from "../common/ExportContent";
import { JQLEditor } from "../JQLEditor";
import { TableFieldsDropdown } from "./TableFieldsDropdown";
import {
  CellLimit,
  IssueField,
  IssueLinkType,
  IssueType,
} from "../../types/api";

import { TabGroup } from "./TabGroup";
import { SelectedType } from "@atlaskit/tabs/types";
import { useTranslation } from "react-i18next";
import { APIContext } from "../../context/api";
import { viewTabs } from "../../constants/traceabilityReport";
import { SettingsDropdownTrigger } from "../common/SettingsDropdownTrigger";

interface MainBarProps {
  appWidth: number;
}
const MainBar = styled.div<MainBarProps>`
  padding: 8px;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid ${colors.N30};
  flex-wrap: wrap;
  gap: 8px;
  overflow-x: auto;
`;
const FlexContainer = styled.div`
  display: flex;
  gap: 8px;
  line-height: 32px;
`;

interface Props {
  selectedIssueFieldIds: string[];
  setSelectedIssueFieldIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedJQLString: string;
  updateSelectedJQLString: (filterId: string) => void;
  selectedTableFieldIds: string[];
  updateSelectedTableFieldIds: (fieldIds: string[]) => void;
  tableFields: IssueType[] | IssueLinkType[];
  settingsDropdown: CellLimit[];
  selectedSettingsDropdownIds: string[];
  setSelectedSettingsDropdownIds: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  exportReport: (exportTypeId: string) => Promise<void>;
  handleNewError: (err: unknown) => void;
  isExportDisabled: boolean;
  issueCardOptions: IssueField[];
  handleTabOptionSelect: (tabIndex: SelectedType) => void;
  selectedTabIndex: SelectedType;
  showCustomJQLEditor: any;
  selectedViewTab: string;
  exportDropdownOptions: any;
  handleRefresh: (refreshTypeId: string) => void;
}

export const Toolbar = ({
  selectedIssueFieldIds,
  setSelectedIssueFieldIds,
  selectedJQLString,
  updateSelectedJQLString,
  selectedTableFieldIds,
  updateSelectedTableFieldIds,
  tableFields,
  selectedSettingsDropdownIds,
  setSelectedSettingsDropdownIds,
  settingsDropdown,
  exportReport,
  handleNewError,
  isExportDisabled,
  issueCardOptions,
  handleTabOptionSelect,
  selectedTabIndex,
  showCustomJQLEditor,
  selectedViewTab,
  exportDropdownOptions,
  handleRefresh,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const api = useContext(APIContext);
  const helpLinkUrl = api.getHelpLinks().traceability;
  const isTreeReport = selectedViewTab === "tree-view";
  const marginTop = api.isJiraCloud() ? "-16px" : "-50px";
  const [appWidth, setAppWidth] = useState<number>();
  useEffect(() => {
    const app = document.getElementById("app");
    const handleResize = (): void => setAppWidth(app.offsetWidth);
    // Set initial appWidth state
    setAppWidth(app.offsetWidth);
    window.addEventListener("resize", handleResize); // set state each time window is resized

    return () => window.removeEventListener("resize", handleResize); // clean up
  }, []);
  return (
    <div style={{ marginTop, marginBottom: "-8px" }}>
      <TabGroup
        handleOptionSelect={handleTabOptionSelect}
        id={viewTabs.id}
        options={viewTabs.tabs}
        selectedTabIndex={selectedTabIndex}
      />
      <MainBar appWidth={appWidth}>
        <FlexContainer>
          <JQLSelectDropdown
            selectedFilterId={selectedJQLString}
            updateSelectedFilterId={updateSelectedJQLString}
            handleNewError={handleNewError}
          />
          <span>{t("otpl.lxp.traceability-report.toolbar.or")}</span>
          <JQLEditor
            selectedFilterId={selectedJQLString}
            updateSelectedFilterId={updateSelectedJQLString}
            showCustomJQLEditor={showCustomJQLEditor}
          />
          <RefreshButton refresh={handleRefresh} />
        </FlexContainer>

        <div>
          <ButtonGroup>
            {!isTreeReport && Boolean(tableFields) && (
              <TableFieldsDropdown
                selectedOptions={selectedTableFieldIds}
                updateSelectedOptionIds={updateSelectedTableFieldIds}
                options={tableFields}
              />
            )}
            <DropdownFields
              dropdownName={t("otpl.lxp.toolbar.issue-card-fields")}
              options={issueCardOptions}
              selectedOptions={selectedIssueFieldIds}
              updateSelectedOptions={setSelectedIssueFieldIds}
            />
            {!isTreeReport && (
              <Dropdown
                dropdownName={(props) => <SettingsDropdownTrigger {...props} />}
                options={settingsDropdown}
                selectedOptions={selectedSettingsDropdownIds}
                updateSelectedOptions={setSelectedSettingsDropdownIds}
              />
            )}
            <ExportContent
              description={t("otpl.lxp.toolbar.export-csv.title")}
              exportContent={exportReport}
              isDisabled={isExportDisabled}
              options={exportDropdownOptions}
            />
            <HelpLink
              description={t("otpl.lxp.common.get-help")}
              href={helpLinkUrl}
            />
          </ButtonGroup>
        </div>
      </MainBar>
    </div>
  );
};
