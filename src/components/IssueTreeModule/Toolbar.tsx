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
  return (
    <Container>
      {options !== undefined && filter !== undefined && (
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
          dropdownName={t("lxp.toolbar.issue-card-fields")}
          options={issueCardOptions}
          selectedOptions={selectedIssueFieldIds}
          updateSelectedOptions={setSelectedIssueFieldIds}
        />
        <ExportContent
          isDisabled={isExportDisabled}
          description={t("lxp.toolbar.export-csv.title")}
          exportContent={exportTree}
        />
        <HelpLink description={t("lxp.common.get-help")} href={helpLinkUrl} />
      </ButtonGroup>
    </Container >
  );
};
