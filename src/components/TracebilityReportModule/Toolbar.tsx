import React from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import { JQLSelectDropdown } from "../JQLSelectDropdown";
import { ButtonGroup } from "@atlaskit/button";
import { Dropdown } from "../common/Dropdown";
import { helpLinkUrl } from "../../constants/common";
import { HelpLink } from "../common/HelpLink";
import { ExportContent } from "../common/ExportContent";
import { JQLEditor } from "../JQLEditor";
import { TableFieldsDropdown } from "./TableFieldsDropdown";
import { IssueField, IssueLinkType, IssueType } from "../../types/api";

import { TabGroup } from "./TabGroup";
import { SelectedType } from "@atlaskit/tabs/types";
import { useTranslation } from "react-i18next";
import { SettingsDropdown } from "./SettingDropdown";
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
  setSelectedJQLString: React.Dispatch<React.SetStateAction<string>>;
  selectedTableFieldIds: string[];
  updateSelectedTableFieldIds: (fieldIds: string[]) => void;
  tableFields: IssueType[] | IssueLinkType[];
  issueInCell: IssueType[];
  selectedIssueInCellIds: string[];
  updateSelectedIssueInCellIds: React.Dispatch<React.SetStateAction<string[]>>;
  exportReport: () => void;
  handleNewError: (err: unknown) => void;
  isExportDisabled: boolean;
  issueCardOptions: IssueField[];
  viewTabs: Array<{ name: string; description: string }>;
  viewTabsId: string;
  handleTabOptionSelect: (tabIndex: SelectedType) => void;
  selectedTabIndex: SelectedType;
}

export const Toolbar = ({
  selectedIssueFieldIds,
  setSelectedIssueFieldIds,
  selectedJQLString,
  setSelectedJQLString,
  selectedTableFieldIds,
  updateSelectedTableFieldIds,
  tableFields,
  selectedIssueInCellIds,
  updateSelectedIssueInCellIds,
  issueInCell,
  exportReport,
  handleNewError,
  isExportDisabled,
  issueCardOptions,
  viewTabs,
  viewTabsId,
  handleTabOptionSelect,
  selectedTabIndex,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div style={{ marginTop: "-16px", marginBottom: "-8px" }}>
      <TabGroup
        handleOptionSelect={handleTabOptionSelect}
        id={viewTabsId}
        options={viewTabs}
        selectedTabIndex={selectedTabIndex}
      />
      <MainBar>
        <FlexContainer>
          <JQLSelectDropdown
            selectedFilterId={selectedJQLString}
            setSelectedFilterId={setSelectedJQLString}
            handleNewError={handleNewError}
          />
          <span>{t("traceability-report.toolbar.or")}</span>
          <JQLEditor
            selectedFilterId={selectedJQLString}
            setSelectedFilterId={setSelectedJQLString}
          />
        </FlexContainer>

        <div>
          <ButtonGroup>
            {Boolean(tableFields) && (
              <TableFieldsDropdown
                selectedOptions={selectedTableFieldIds}
                updateSelectedOptionIds={updateSelectedTableFieldIds}
                options={tableFields}
              />
            )}
            <Dropdown
              dropdownName={t("lxp.toolbar.issue-card-fields")}
              options={issueCardOptions}
              selectedOptions={selectedIssueFieldIds}
              updateSelectedOptions={setSelectedIssueFieldIds}
            />
            <SettingsDropdown 
              selectedOptions={selectedIssueInCellIds}
              updateSelectedOptionIds={updateSelectedIssueInCellIds}
              options={issueInCell}
            />
            <ExportContent
              description={t("lxp.toolbar.export-csv.title")}
              exportContent={() => {
                exportReport();
              }}
              isDisabled={isExportDisabled}
            />
            <HelpLink
              description={t("lxp.common.get-help")}
              href={helpLinkUrl}
            />
          </ButtonGroup>
        </div>
      </MainBar>
    </div>
  );
};
