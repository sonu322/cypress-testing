import React from "react";
import DropdownMenu, {
  DropdownItemCheckboxGroup,
  DropdownItemCheckbox,
} from "@atlaskit/dropdown-menu";
import { IssueField } from "../../types/api";
import { toTitleCase } from "../../util";
import styled from "styled-components";
interface Props {
  selectedOptions: string[];
  dropdownName: string;
  updateSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
  options: Array<{
    id: string;
    name: string;
  }>;
  useTitleCaseOptions?: boolean;
}

const StyledDropdownItemCheckboxGroup = styled(DropdownItemCheckboxGroup)`
  // padding-bottom: 16px;
  // padding-top: 16px;
`;
const StyledDropdownMenu = styled(DropdownMenu)`
  // max-height: 2rem;
`;

export const Dropdown = ({
  selectedOptions,
  dropdownName,
  updateSelectedOptions,
  options,
  useTitleCaseOptions,
}: Props): JSX.Element => {
  const handleOptionClick = (id: string): void => {
    let updatedList: any[] = [];
    if (selectedOptions.includes(id)) {
      updatedList = selectedOptions.filter((fieldId) => fieldId !== id);
    } else {
      updatedList = [...selectedOptions, id];
    }
    updateSelectedOptions(updatedList);
  };

  return (
    <DropdownMenu trigger={dropdownName}>
      <StyledDropdownItemCheckboxGroup id={dropdownName + "-options"}>
        {options?.map((option) => (
          <DropdownItemCheckbox
            key={option.id}
            id={option.id}
            isSelected={selectedOptions.includes(option.id)}
            onClick={() => handleOptionClick(option.id)}
          >
            {useTitleCaseOptions ? toTitleCase(option.name) : option.name}
          </DropdownItemCheckbox>
        ))}
      </StyledDropdownItemCheckboxGroup>
    </DropdownMenu>
  );
};
