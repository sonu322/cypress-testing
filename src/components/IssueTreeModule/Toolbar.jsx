import React from "react";
import { Dropdown } from "./Dropdown";
import { ButtonGroup } from "@atlaskit/button";
import styled from "styled-components";
import { IssueOptionsDropdown } from "./IssueOptionsDropdown";
import { helpLink } from "../../constants";
import { ExportContent } from "../ExportContent";
import { HelpLink } from "../HelpLink";
export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const Toolbar = ({
  options,
  filter,
  updateFilteredKeyOptions,
  keyNames,
  selectedIssueFieldIds,
  setSelectedIssueFieldIds,
  issueCardOptionsMap,
  exportTree,
}) => {
  const issueCardOptions = Array.from(issueCardOptionsMap.values());
  console.log("options")
  console.log(options)
  return (
    <Container>
      <ButtonGroup>
        {options &&
          filter &&
          keyNames.map((keyName) => (
            <IssueOptionsDropdown
              key={keyName}
              keyName={keyName}
              options={options[keyName]}
              selectedOptions={filter[keyName]}
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
            description={"Export issue tree to csv"}
            exportContent={exportTree}
          />
          <HelpLink description={"Get help"} href={helpLink} />
        </ButtonGroup>
      </div>
    </Container>
  );
};
