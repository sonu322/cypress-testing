import React from "react";
import { Dropdown } from "../common/Dropdown";
import { DropdownMultipleSectionsSelect } from "../common/DropdownMultipleSectionsSelect";

interface Props {
  options: Map<
    string,
    {
      name: string;
      values: any[];
    }
  >;
  selectedTab: string;
  selectedOptions: Map<string, string[]>;
  updateSelectedOptionIds: React.Dispatch<
    React.SetStateAction<Map<string, string[]>>
  >;
}
export const TableFieldsDropdown = ({
  options,
  selectedOptions,
  updateSelectedOptionIds,
  selectedTab,
}: Props): JSX.Element => {
  return (
    // <DropdownMultipleSectionsSelect
    //   selectedOptions={selectedOptions}
    //   dropdownName={"Choose table fields"}
    //   updateSelectedOptionIds={updateSelectedOptionIds}
    //   options={options}
    // />
    <>
      <span>{selectedTab}</span>
    </>
  );
};
