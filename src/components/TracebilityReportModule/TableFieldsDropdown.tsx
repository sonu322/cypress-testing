import React from "react";
import {DropdownMultipleSectionsSelect} from "../common/DropdownMultipleSectionsSelect";
export const TableFieldsDropdown = ({
  options,
  selectedOptions,
  updateSelectedOptionIds,
}): JSX.Element => {
  return (
    <DropdownMultipleSectionsSelect
      selectedOptions={selectedOptions}
      dropdownName={"Choose table fields"}
      updateSelectedOptions={updateSelectedOptionIds}
      options={options}
    />
  );
};
