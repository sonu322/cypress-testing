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
import { IssueField, IssueLinkType, IssueType } from "../../types/api";

import { TabGroup } from "./TabGroup";
import { SelectedType } from "@atlaskit/tabs/types";
import { useTranslation } from "react-i18next";
import { APIContext } from "../../context/api";

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
  exportReport: () => void;
  handleNewError: (err: unknown) => void;
  isExportDisabled: boolean;
  issueCardOptions: IssueField[];
  viewTabs: Array<{ name: string; description: string }>;
  viewTabsId: string;
  handleTabOptionSelect: (tabIndex: SelectedType) => void;
  selectedTabIndex: SelectedType;
  showCustomJQLEditor: any;
}

export const Toolbar = ({
  selectedIssueFieldIds,
  setSelectedIssueFieldIds,
  selectedJQLString,
  setSelectedJQLString,
  selectedTableFieldIds,
  updateSelectedTableFieldIds,
  tableFields,
  exportReport,
  handleNewError,
  isExportDisabled,
  issueCardOptions,
  viewTabs,
  viewTabsId,
  handleTabOptionSelect,
  selectedTabIndex,
  showCustomJQLEditor
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const api = useContext(APIContext);
  const helpLinkUrl = api.getHelpLinks().traceability;
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
            showCustomJQLEditor={showCustomJQLEditor}
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
