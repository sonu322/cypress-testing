import React from "react";
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from "@atlaskit/dropdown-menu";

export const DropdownSingleSelect = ({
  selectedOptionId,
  dropdownName,
  updateSelectedOptionId,
  options,
}) => {
  return (
    <>
      <DropdownMenu
        triggerType="button"
        trigger={dropdownName}
        shouldFlip={false}
        position="bottom right"
        isCompact={true}
      >
        <DropdownItemGroup>
          {options &&
            options.map((option) => (
              <DropdownItem
                key={option.id}
                id={option.id}
                isSelected={
                  selectedOptionId == option.id
                }
                onClick={() => updateSelectedOptionId(option.id)}
              >
                {option.name}
              </DropdownItem>
            ))}
        </DropdownItemGroup>
      </DropdownMenu>
    </>
  );
};
