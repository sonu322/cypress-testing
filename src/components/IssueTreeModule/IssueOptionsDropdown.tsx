import React from "react";
import { DropdownFields } from "../common/DropdownFields";
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
    <DropdownFields
      useTitleCaseOptions
      key={keyName}
      dropdownName={dropdownName}
      options={options}
      selectedOptions={selectedOptions}
      updateSelectedOptions={updateSelectedFieldOptions}
    />
  );
};
