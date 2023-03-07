import React from "react";
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from "@atlaskit/dropdown-menu";

export const DropdownActionMenu = ({
  dropdownName,
  options,
  selectedOptionId,
  actionHandler,
}) => {
  return (
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
              isSelected={selectedOptionId == option.id}
              onClick={() => actionHandler(option.id)}
            >
              {option.name}
            </DropdownItem>
          ))}
      </DropdownItemGroup>
    </DropdownMenu>
  );
};
