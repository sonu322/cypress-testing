import React, { useCallback } from "react";
import DropdownMenu, {
  DropdownItemCheckboxGroup,
  DropdownItemCheckbox,
} from "@atlaskit/dropdown-menu";
export const CardFieldsDropdown = ({
  options,
  selectedOptions,
  updateSelectedOptions,
}) => {
  const handleOptionClick = useCallback(
    (id) => {
      let updatedList = [];
      if (selectedOptions.includes(id)) {
        updatedList = selectedOptions.filter((fieldId) => fieldId != id);
      } else {
        updatedList = [...selectedOptions, id];
      }
      updateSelectedOptions(updatedList);
    },
    [selectedOptions, updateSelectedOptions]
  );
  return (
    <>
      <DropdownMenu
        triggerType="button"
        trigger={"Issue Card Fields"}
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
