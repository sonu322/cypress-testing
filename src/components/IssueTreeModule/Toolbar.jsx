import React from "react";
import { Dropdown } from "./Dropdown";
import { ButtonGroup } from "@atlaskit/button";
import styled from "styled-components";
import { IssueOptionsDropdown } from "./IssueOptionsDropdown";

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
}) => {
  const issueCardOptions = Array.from(issueCardOptionsMap.values());
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
      <Dropdown
        dropdownName={"Issue Card Fields"}
        options={issueCardOptions}
        selectedOptions={selectedIssueFieldIds}
        updateSelectedOptions={setSelectedIssueFieldIds}
      />
    </Container>
  );
};
