import React from "react";
import DropdownMenu, {
  DropdownItemCheckboxGroup,
  DropdownItemCheckbox,
} from "@atlaskit/dropdown-menu";

export const Dropdown = ({
  selectedOptions,
  dropdownName,
  updateSelectedOptions,
  options,
}) => {
  const handleOptionClick = (id: any) => {
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
        {options &&
          options.map((option) => (
            <DropdownItemCheckbox
              key={option.id}
              id={option.id}
              isSelected={
                selectedOptions ? selectedOptions.includes(option.id) : false
              }
              onClick={() => handleOptionClick(option.id)}
            >
              {option.name}
            </DropdownItemCheckbox>
          ))}
      </DropdownItemCheckboxGroup>
    </DropdownMenu>
  );
};
