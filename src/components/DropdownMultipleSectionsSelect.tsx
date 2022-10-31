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
}): JSX.Element => {
  // click handler
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

  // groups of checkboxes
  const checkboxGroups = [];
  for (const [groupKey, groupData] of options.entries()) {
    checkboxGroups.push(
      <DropdownItemCheckboxGroup
        key={groupKey}
        id={groupKey}
        title={groupData.name}
      >
        {groupData.values.map((fieldData) => (
          <DropdownItemCheckbox
            key={fieldData.id}
            id={fieldData.id}
            onClick={() => handleOptionClick(groupKey, fieldData.id)}
            isSelected={selectedOptions.get(groupKey)?.includes(fieldData.id)}
          >
            {fieldData.name}
          </DropdownItemCheckbox>
        ))}
      </DropdownItemCheckboxGroup>
    );
  }

  // render
  return (
    <>
      <DropdownMenu
        triggerType="button"
        trigger={dropdownName}
        shouldFlip={false}
        position="top"
        isCompact={true}
      >
        {checkboxGroups}
      </DropdownMenu>
    </>
  );
};
