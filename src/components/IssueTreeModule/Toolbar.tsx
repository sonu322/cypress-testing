import React from "react";
import { Dropdown } from "../common/Dropdown";
import { ButtonGroup } from "@atlaskit/button";
import styled from "styled-components";
import { helpLinkUrl } from "../../constants/common";
import { ExportContent } from "../common/ExportContent";
import { HelpLink } from "../common/HelpLink";
import { useTranslation } from "react-i18next";
import { TreeFilterDropdowns } from "./TreeFilterDropdowns";
export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
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
  isExportDisabled,
}) => {
  const { t } = useTranslation();
  return (
    <Container>
      {options !== undefined && filter !== undefined && (
        <TreeFilterDropdowns
          filter={filter}
          options={options}
          filterDropdowns={filterDropdowns}
          updateFilteredKeyOptions={updateFilteredKeyOptions}
        />
      )}
      <div>
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
      </div>
    </Container>
  );
};
