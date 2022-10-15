import React from "react";
import { Dropdown } from "./Dropdown";
export const IssueOptionsDropdown = ({
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