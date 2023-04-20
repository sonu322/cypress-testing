import React, { useContext } from "react";
import { Dropdown } from "../common/Dropdown";
import { ButtonGroup } from "@atlaskit/button";
import styled from "styled-components";
import { ExportButton } from "../common/ExportButton";
import { HelpLink } from "../common/HelpLink";
import { useTranslation } from "react-i18next";
import { APIContext } from "../../context/api";
import { TreeFilterDropdowns } from "./TreeFilterDropdowns";
import { DashboardContext } from "../common/Dashboard/DashboardContext";
import { ConfigureGadgetButton } from "../common/Dashboard/CofigureGadgetButton";

interface Props {
  options;
  filter;
  updateFilteredKeyOptions;
  filterDropdowns;
  selectedIssueFieldIds;
  setSelectedIssueFieldIds;
  issueCardOptions;
  exportTree;
  collapseAll;
  expandAll;
  isExportDisabled: boolean;
  isExpandAllLoading: boolean;
  isFromDashboardGadget: boolean;
}
export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  gap: 4px;
`;

export const LeftContainer = styled.div`
  min-width: 450px;
`;

export const Toolbar: React.FC<Props> = ({
  options,
  filter,
  updateFilteredKeyOptions,
  filterDropdowns,
  selectedIssueFieldIds,
  setSelectedIssueFieldIds,
  issueCardOptions,
  exportTree,
  collapseAll,
  expandAll,
  isExportDisabled,
  isExpandAllLoading,
  isFromDashboardGadget,
}) => {
  const { t } = useTranslation();
  const dashboardContext = useContext(DashboardContext);
  const api = useContext(APIContext);
  const helpLinkUrl = api.getHelpLinks().issueTree;
  let areTreeNecessitiesPresent = false;
  if (options !== undefined && options !== null) {
    if (filter !== undefined && filter !== null) {
      if (issueCardOptions !== undefined && issueCardOptions !== null) {
        if (
          selectedIssueFieldIds !== undefined &&
          selectedIssueFieldIds !== null
        ) {
          areTreeNecessitiesPresent = true;
        }
      }
    }
  }
  return (
    <Container>
      {areTreeNecessitiesPresent && (
        <LeftContainer>
          <TreeFilterDropdowns
            filter={filter}
            options={options}
            filterDropdowns={filterDropdowns}
            updateFilteredKeyOptions={updateFilteredKeyOptions}
            collapseAll={collapseAll}
            expandAll={expandAll}
            isExpandAllLoading={isExpandAllLoading}
          />
        </LeftContainer>
      )}
      <ButtonGroup>
        <Dropdown
          dropdownName={t("otpl.lxp.toolbar.issue-card-fields")}
          options={issueCardOptions}
          selectedOptions={selectedIssueFieldIds}
          updateSelectedOptions={setSelectedIssueFieldIds}
        />
        <ExportButton
          isDisabled={isExportDisabled}
          description={t("otpl.lxp.toolbar.export-csv.title")}
          exportContent={exportTree}
        />
        <HelpLink
          description={t("otpl.lxp.common.get-help")}
          href={helpLinkUrl}
        />
        {isFromDashboardGadget && (
          <ConfigureGadgetButton
            handleClick={() => {
              dashboardContext.updateIsConfiguring(true);
            }}
          />
        )}
      </ButtonGroup>
    </Container>
  );
};
