import React from "react";
import DropdownMenu, {
  DropdownItemCheckboxGroup,
  DropdownItemCheckbox,
} from "@atlaskit/dropdown-menu";
import { toTitleCase } from "../../util";
import { TooltipContainer } from "./TooltipContainer";
interface Props {
  selectedOptions: string[];
  dropdownName: any;
  dropdownNamePlacement?: string;
  updateSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
  options: Array<{
    id: string;
    name: string;
    description: string;
    [key: string]: any;
  }>;
  useTitleCaseOptions?: boolean;
}

export const Dropdown = ({
  selectedOptions,
  dropdownName,
  dropdownNamePlacement,
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
    <DropdownMenu
      trigger={dropdownName}
      placement={dropdownNamePlacement ?? "bottom-start"}
    >
      <DropdownItemCheckboxGroup id={dropdownName + "-options"}>
        {options?.map((option) => (
          <DropdownItemCheckbox
            key={option.id}
            id={option.id}
            isSelected={selectedOptions.includes(option.id)}
            onClick={() => handleOptionClick(option.id)}
          >
            <TooltipContainer content={option.description}>
              {useTitleCaseOptions ? toTitleCase(option.name) : option.name}
            </TooltipContainer>
          </DropdownItemCheckbox>
        ))}
      </DropdownItemCheckboxGroup>
    </DropdownMenu>
  );
};
