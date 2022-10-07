import React, { useState, useEffect } from "react";
import { CheckboxSelect } from "@atlaskit/select";
import DropdownMenu, {
  DropdownItemCheckboxGroup,
  DropdownItemCheckbox,
} from "@atlaskit/dropdown-menu";
import Spinner from "@atlaskit/spinner";
export const Dropdown = ({
  filteredKeyOptions,
  keyName,
  updateKeyOptions,
  updateFilteredKeyOptions,
  keyOptions,
}) => {
  const handleOptionClick = (e, id) => {
    if (filteredKeyOptions) {
      let updated = [];
      if (filteredKeyOptions.includes(id)) {
        updated = filteredKeyOptions.filter((item, index) => item != id);
      } else {
        updated = [...filteredKeyOptions, id];
      }
      updateFilteredKeyOptions(keyName, updated);
    }
  };
  return (
    <>
      <DropdownMenu
        triggerType="button"
        trigger={keyName}
        shouldFlip={false}
        position="bottom right"
        isCompact={true}
      >
        <DropdownItemCheckboxGroup>
          {keyOptions &&
            keyOptions.map((option) => (
              <DropdownItemCheckbox
                key={option.id}
                id={option.id}
                isSelected={
                  filteredKeyOptions
                    ? filteredKeyOptions.includes(option.id)
                    : false
                }
                onClick={(e) => handleOptionClick(e, option.id)}
              >
                {option.name}
              </DropdownItemCheckbox>
            ))}
        </DropdownItemCheckboxGroup>
      </DropdownMenu>
    </>
  );
};
