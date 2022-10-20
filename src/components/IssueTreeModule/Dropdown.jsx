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
  console.log("from dropdown");
  console.log(options);
  console.log(selectedOptions);
  const handleOptionClick = (id) => {
    let updatedList = [];
    if (selectedOptions.includes(id)) {
      updatedList = selectedOptions.filter((fieldId) => fieldId != id);
    } else {
      updatedList = [...selectedOptions, id];
    }
    updateSelectedOptions(updatedList);
  };
  return (
    <>
      <DropdownMenu
        triggerType="button"
        trigger={dropdownName}
        shouldFlip={false}
        position="bottom right"
        isCompact={true}
      >
        <DropdownItemCheckboxGroup>
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
    </>
  );
};
