import React, { useContext } from "react";
import { Dropdown } from "../common/Dropdown";
import { ButtonGroup } from "@atlaskit/button";
import styled from "styled-components";
import { ExportContent } from "../common/ExportContent";
import { HelpLink } from "../common/HelpLink";
import { useTranslation } from "react-i18next";
import { APIContext } from "../../context/api";
import { TreeFilterDropdowns } from "./TreeFilterDropdowns";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const LeftContainer = styled.div`
  min-width: 450px;
`;

export const Toolbar = ({
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
  isExpandAllLoading
}): JSX.Element => {
  const { t } = useTranslation();
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
        <ExportContent
          isDisabled={isExportDisabled}
          description={t("otpl.lxp.toolbar.export-csv.title")}
          exportContent={exportTree}
        />
        <HelpLink
          description={t("otpl.lxp.common.get-help")}
          href={helpLinkUrl}
        />
      </ButtonGroup>
    </Container>
  );
};
