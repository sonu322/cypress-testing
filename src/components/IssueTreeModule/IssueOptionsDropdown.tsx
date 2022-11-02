import React from "react";
import { Dropdown } from "../common/Dropdown";
export const IssueOptionsDropdown = ({
  keyName,
  dropdownName,
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
      dropdownName={dropdownName}
      options={options}
      selectedOptions={selectedOptions}
      updateSelectedOptions={updateSelectedFieldOptions}
    />
  );
};
