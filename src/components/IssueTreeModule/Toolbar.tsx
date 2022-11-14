import React from "react";
import { Dropdown } from "../common/Dropdown";
import { ButtonGroup } from "@atlaskit/button";
import styled from "styled-components";
import { IssueOptionsDropdown } from "./IssueOptionsDropdown";
import { helpLink } from "../../constants";
import { ExportContent } from "../common/ExportContent";
import { HelpLink } from "../common/HelpLink";
import { useTranslation } from "react-i18next";
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
}) => {
  const { t } = useTranslation();
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
            description={t("lxp.toolbar.export-csv.title")}
            exportContent={exportTree}
          />
          <HelpLink description={t("lxp.common.get-help")} href={helpLink} />
        </ButtonGroup>
      </div>
    </Container>
  );
};
