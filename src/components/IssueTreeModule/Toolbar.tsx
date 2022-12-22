import React, { useContext } from "react";
import { Dropdown } from "../common/Dropdown";
import Button, { ButtonGroup, LoadingButton } from "@atlaskit/button";
import styled from "styled-components";
import { IssueOptionsDropdown } from "./IssueOptionsDropdown";
import { ExportContent } from "../common/ExportContent";
import { HelpLink } from "../common/HelpLink";
import { useTranslation } from "react-i18next";
import { APIContext } from "../../context/api";
import ExpandIcon from "@atlaskit/icon/glyph/hipchat/chevron-double-down";
import CollapseIcon from "@atlaskit/icon/glyph/hipchat/chevron-double-up";
import { TooltipContainer } from "../common/TooltipContainer";

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
  collapseAll,
  expandAll,
  isExportDisabled,
  isExpandAllLoading
}) => {
  const { t } = useTranslation();
  const api = useContext(APIContext);
  const helpLinkUrl = api.getHelpLinks().issueTree;
  return (
    <Container>
      <ButtonGroup>
        {options &&
          filter &&
          filterDropdowns.map((fd) => (
            <IssueOptionsDropdown
              key={fd.key}
              keyName={fd.key}
              dropdownName={fd.label}
              options={options[fd.key]}
              selectedOptions={filter[fd.key]}
              updateSelectedOptions={updateFilteredKeyOptions}
            />
          ))}
        <TooltipContainer content={t("lxp.toolbar.expand-all.title")}>
          <LoadingButton
            appearance="default"
            iconBefore={<ExpandIcon label={""} />}
            onClick={expandAll}
            isLoading={isExpandAllLoading}
            isDisabled={isExpandAllLoading}
          />
        </TooltipContainer>
        <TooltipContainer content={t("lxp.toolbar.collapse-all.title")}>
          <Button
            appearance="default"
            iconBefore={<CollapseIcon label={""} />}
            onClick={collapseAll}
          />
        </TooltipContainer>

      </ButtonGroup>
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
