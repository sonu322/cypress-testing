import React from "react";
import { Dropdown } from "../common/Dropdown";
import { ButtonGroup } from "@atlaskit/button";
import styled from "styled-components";
import { IssueOptionsDropdown } from "./IssueOptionsDropdown";
import { helpLink } from "../../constants";
import { ExportContent } from "../common/ExportContent";
import { HelpLink } from "../common/HelpLink";

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
            dropdownName={"Issue Card Fields"}
            options={issueCardOptions}
            selectedOptions={selectedIssueFieldIds}
            updateSelectedOptions={setSelectedIssueFieldIds}
          />
          <ExportContent
              isDisabled={isExportDisabled}
            description={"Export issue tree to csv"}
            exportContent={exportTree}
          />
          <HelpLink description={"Get help"} href={helpLink} />
        </ButtonGroup>
      </div>
    </Container>
  );
};
