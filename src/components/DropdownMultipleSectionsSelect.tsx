import React from "react";
import DropdownMenu, {
  DropdownItemCheckboxGroup,
  DropdownItemCheckbox,
} from "@atlaskit/dropdown-menu";
export const DropdownMultipleSectionsSelect = ({
  selectedOptions,
  dropdownName,
  updateSelectedOptions,
  options,
}) => {
  console.log("from dropdown mutiple");
  console.log(options);
  console.log(selectedOptions);
  const handleOptionClick = (groupKey, id) => {
    const newMap = new Map(selectedOptions);
    let updatedList = [];
    if (newMap.get(groupKey).includes(id)) {
      updatedList = newMap.get(groupKey).filter((fieldId) => fieldId != id);
    } else {
      updatedList = [...newMap.get(groupKey), id];
    }
    newMap.set(groupKey, updatedList);
    updateSelectedOptions(newMap);
  };
  let checkboxGroups = [];
  for (const [key, value] of options.entries()) {
    console.log(selectedOptions.get(key));
    checkboxGroups.push(
      <DropdownItemCheckboxGroup key={key} id={key} title={value.name}>
        {value.values.map((option) => (
          <DropdownItemCheckbox
            key={option.id}
            id={option.id}
            onClick={() => handleOptionClick(key, option.id)}
            isSelected={
              selectedOptions.get(key) &&
              selectedOptions.get(key).includes(option.id)
            }
          >
            {option.name}
          </DropdownItemCheckbox>
        ))}
      </DropdownItemCheckboxGroup>
    );
  }
  return (
    <>
      <DropdownMenu
        triggerType="button"
        trigger={dropdownName}
        shouldFlip={false}
        position="bottom right"
        isCompact={true}
      >
        {checkboxGroups}
      </DropdownMenu>
    </>
  );
};
