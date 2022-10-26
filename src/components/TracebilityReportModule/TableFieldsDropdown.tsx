import React from "react";
import { DropdownMultipleSectionsSelect } from "../DropdownMultipleSectionsSelect";
export const TableFieldsDropdown = ({
  options,
  selectedOptions,
  updateSelectedOptionIds,
}) => {
  console.log("options");
  console.log(options);

  return (
    // <Dropdown
    // selectedOptions={selectedOptions}
    // dropdownName={"Choose table fields"}
    // updateSelectedOptions={updateSelectedOptionIds}
    // options={["asdf"]}
    // ></Dropdown>
    <DropdownMultipleSectionsSelect
      selectedOptions={selectedOptions}
      dropdownName={"Choose table fields"}
      updateSelectedOptions={updateSelectedOptionIds}
      options={options}
    />
  );
};
