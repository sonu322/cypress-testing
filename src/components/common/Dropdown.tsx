import React from "react";
import DropdownMenu, {
  DropdownItemCheckboxGroup,
  DropdownItemCheckbox,
} from "@atlaskit/dropdown-menu";
import {IssueField} from "../../types/api";

interface Props {
  selectedOptions: string[];
  dropdownName: string;
  updateSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
  options: IssueField[];
}

export const Dropdown = ({
  selectedOptions,
  dropdownName,
  updateSelectedOptions,
  options,
}: Props): JSX.Element => {
  const handleOptionClick = (id: string): void => {
    let updatedList: any[] = [];
    if (selectedOptions.includes(id)) {
      updatedList = selectedOptions.filter((fieldId) => fieldId != id);
    } else {
      updatedList = [...selectedOptions, id];
    }
    updateSelectedOptions(updatedList);
  };
  return (
    <DropdownMenu trigger={dropdownName} shouldFlip={false} placement="bottom">
      <DropdownItemCheckboxGroup id={dropdownName + "-options"}>
        {options?.map((option) => (
          <DropdownItemCheckbox
            key={option.id}
            id={option.id}
            isSelected={selectedOptions.includes(option.id)}
            onClick={() => handleOptionClick(option.id)}
          >
            {option.name}
          </DropdownItemCheckbox>
        ))}
      </DropdownItemCheckboxGroup>
    </DropdownMenu>
  );
};
