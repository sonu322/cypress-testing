import React from "react";
import DropdownMenu, {
  DropdownItemCheckboxGroup,
  DropdownItemCheckbox,
} from "@atlaskit/dropdown-menu";
export const CardFieldsDropdown = ({
  issueFields,
  selectedIssueFields,
  setSelectedIssueFields,
}) => {
  const handleOptionClick = (e, key) => {
    if (selectedIssueFields) {
      let updated = [];
      if (selectedIssueFields.includes(key)) {
        updated = selectedIssueFields.filter((fieldKey) => fieldKey != key);
      } else {
        updated = [...selectedIssueFields, key];
      }
      setSelectedIssueFields(updated);
    }
  };
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
          {issueFields &&
            issueFields.map((option) => (
              <DropdownItemCheckbox
                key={option.key}
                id={option.key}
                isSelected={
                  selectedIssueFields
                    ? selectedIssueFields.includes(option.key)
                    : false
                }
                onClick={(e) => handleOptionClick(e, option.key)}
              >
                {option.name}
              </DropdownItemCheckbox>
            ))}
        </DropdownItemCheckboxGroup>
      </DropdownMenu>
    </>
  );
};
