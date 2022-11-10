import React from "react";
import { IssueLinkType, IssueType } from "../../types/api";
import { Dropdown } from "../common/Dropdown";

interface Props {
  options: IssueType[] | IssueLinkType[];
  selectedOptions: string[];
  updateSelectedOptionIds: React.Dispatch<React.SetStateAction<string[]>>;
}
export const TableFieldsDropdown = ({
  options,
  selectedOptions,
  updateSelectedOptionIds,
}: Props): JSX.Element => {
  return (
    <Dropdown
      useTitleCaseOptions
      dropdownName="Table Fields"
      options={options}
      selectedOptions={selectedOptions}
      updateSelectedOptions={updateSelectedOptionIds}
    />
  );
};
