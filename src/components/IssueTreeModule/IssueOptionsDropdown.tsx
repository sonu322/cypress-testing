import React from "react";
import { DropdownFields } from "../common/DropdownFields";
import { Icon } from "../common/Icon";
export const IssueOptionsDropdown = ({
  keyName,
  dropdownName,
  options,
  selectedOptions,
  updateSelectedOptions,
}) => {
  const updateSelectedFieldOptions = (updatedList) => {
    updateSelectedOptions(keyName, updatedList);
  };

  const renderOptionWithIcon = (option) => {
    const { iconUrl } = option;
    return (
      <div>
        {iconUrl && <Icon src={iconUrl} />}
        {option.name}
      </div>
    );
  };

  return (
    <DropdownFields
      useTitleCaseOptions
      key={keyName}
      dropdownName={dropdownName}
      options={options}
      selectedOptions={selectedOptions}
      updateSelectedOptions={updateSelectedFieldOptions}
      renderOptionWithIcon={renderOptionWithIcon}
    />
  );
};
