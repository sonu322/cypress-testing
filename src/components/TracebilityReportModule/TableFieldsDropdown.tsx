import React from "react";
import { IssueLinkType, IssueType } from "../../types/api";
import { Dropdown } from "../common/Dropdown";
import { DropdownMultipleSectionsSelect } from "../common/DropdownMultipleSectionsSelect";

interface Props {
  options: IssueType[] | IssueLinkType[];
  selectedTab: string;
  selectedOptions: string[];
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
    <Dropdown
      dropdownName="Table Fields"
      options={options}
      selectedOptions={selectedOptions}
      updateSelectedOptions={updateSelectedOptionIds}
    />
  );
};
