import React from "react";
import DropdownMenu, {
  DropdownItemCheckboxGroup,
  DropdownItemCheckbox,
} from "@atlaskit/dropdown-menu";

interface Props {
  options: Map<
    string,
    {
      name: string;
      values: any[];
    }
  >;
  selectedOptions: Map<string, string[]>;
  updateSelectedOptionIds: React.Dispatch<
    React.SetStateAction<Map<string, string[]>>
  >;
  dropdownName: string;
}

export const DropdownMultipleSectionsSelect = ({
  selectedOptions,
  dropdownName,
  updateSelectedOptionIds,
  options,
}: Props): JSX.Element => {
  // click handler
  const handleOptionClick = (groupKey: string, id: string): void => {
    const newMap = new Map(selectedOptions);
    let updatedList = [];
    if (newMap.get(groupKey).includes(id)) {
      updatedList = newMap.get(groupKey).filter((fieldId) => fieldId !== id);
    } else {
      updatedList = [...newMap.get(groupKey), id];
    }
    newMap.set(groupKey, updatedList);
    updateSelectedOptionIds(newMap);
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