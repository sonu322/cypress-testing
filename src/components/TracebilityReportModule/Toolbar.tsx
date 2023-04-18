import React, { useContext } from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import { JQLSelectDropdown } from "../JQLSelectDropdown";
import { ButtonGroup } from "@atlaskit/button";
import { Dropdown } from "../common/Dropdown";
import { HelpLink } from "../common/HelpLink";
import { ExportContent } from "../common/ExportContent";
import { JQLEditor } from "../JQLEditor";
import { TableFieldsDropdown } from "./TableFieldsDropdown";
import { DashboardContext } from "../common/Dashboard/DashboardContext";
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
import { ConfigureGadgetButton } from "../common/Dashboard/CofigureGadgetButton";
const MainBar = styled.div`
  padding: 8px;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid ${colors.N30};
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
  isFromDashboardGadget?: boolean;
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
  isFromDashboardGadget,
}: Props): JSX.Element => {
  const dashboardContext = useContext(DashboardContext);
  const { t } = useTranslation();
  const api = useContext(APIContext);
  const helpLinkUrl = api.getHelpLinks().traceability;
  const isTreeReport = selectedViewTab === "tree-view";
  const marginTop = api.isJiraCloud() ? "-16px" : "-50px";
  return (
    <div style={{ marginTop, marginBottom: "-8px" }}>
      <TabGroup
        handleOptionSelect={handleTabOptionSelect}
        id={viewTabs.id}
        options={viewTabs.tabs}
        selectedTabIndex={selectedTabIndex}
      />
      <MainBar>
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
            <Dropdown
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
