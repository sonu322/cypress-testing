import React from "react";
import { ButtonGroup } from "@atlaskit/button";
import { IssueOptionsDropdown } from "./IssueOptionsDropdown";
export const TreeFilterDropdowns = ({
  options,
  filter,
  filterDropdowns,
  updateFilteredKeyOptions,
}): JSX.Element => {
  return (
    <ButtonGroup>
      {filterDropdowns.map((fd) => (
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
  );
};
