import React from "react";
import { Dropdown } from "./Dropdown";
import { ButtonGroup } from "@atlaskit/button";
import styled from "styled-components";
import { CardFieldsDropdown } from "./CardFieldsDropdown";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
const IssueOptionsDropdown = ({
  keyName,
  options,
  selectedOptions,
  updateSelectedOptions,
}) => {
  const updateSelectedFieldOptions = (updatedList) => {
    updateSelectedOptions(keyName, updatedList);
  };
  return (
    <Dropdown
      key={keyName}
      dropdownName={keyName}
      options={options}
      selectedOptions={selectedOptions}
      updateSelectedOptions={updateSelectedFieldOptions}
    />
  );
};
export const Toolbar = ({
  options,
  filter,
  updateFilteredKeyOptions,
  keyNames,
  issueFields,
  selectedIssueFields,
  setSelectedIssueFields,
}) => {
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
        options={issueFields}
        selectedOptions={selectedIssueFields}
        updateSelectedOptions={setSelectedIssueFields}
      />
    </Container>
  );
};
