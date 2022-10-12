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
            <Dropdown
              key={keyName}
              keyName={keyName}
              keyOptions={options[keyName]}
              filteredKeyOptions={filter[keyName]}
              updateFilteredKeyOptions={updateFilteredKeyOptions}
            />
          ))}
      </ButtonGroup>
      <CardFieldsDropdown
        issueFields={issueFields}
        selectedIssueFields={selectedIssueFields}
        setSelectedIssueFields={setSelectedIssueFields}
      />
    </Container>
  );
};
