import React from "react";
import { DropdownMultipleSectionsSelect } from "../common/DropdownMultipleSectionsSelect";

interface Props {
  options: Map<
    string,
    {
      name: string;
      values: any[];
    }
  >;
  selectedOptions: Map<string, string[]>;
  updateSelectedOptionIds: React.Dispatch<
    React.SetStateAction<Map<string, string[]>>
  >;
}
export const TableFieldsDropdown = ({
  options,
  selectedOptions,
  updateSelectedOptionIds,
}: Props): JSX.Element => {
  return (
    <DropdownMultipleSectionsSelect
      selectedOptions={selectedOptions}
      dropdownName={"Choose table fields"}
      updateSelectedOptionIds={updateSelectedOptionIds}
      options={options}
    />
  );
};
