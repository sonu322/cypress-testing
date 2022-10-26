import React from "react";
import { DropdownMultipleSectionsSelect } from "../DropdownMultipleSectionsSelect";
export const TableFieldsDropdown = ({
  options,
  selectedOptions,
  updateSelectedOptionIds,
}) => {
  return (
    <DropdownMultipleSectionsSelect
      selectedOptions={selectedOptions}
      dropdownName={"Choose table fields"}
      updateSelectedOptions={updateSelectedOptionIds}
      options={options}
    />
  );
};
