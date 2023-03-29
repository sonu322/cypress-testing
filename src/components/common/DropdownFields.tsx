import React, { useState } from "react";
import DropdownMenu, {
  DropdownItemCheckboxGroup,
  DropdownItemCheckbox,
} from "@atlaskit/dropdown-menu";
import { toTitleCase } from "../../util";
import { TooltipContainer } from "./TooltipContainer";
import { SearchOption } from "./SearchOption";
import { SelectClearOption } from "./SelectClearOption";
interface Props {
  selectedOptions: string[];
  dropdownName: any;
  dropdownNamePlacement?: string;
  updateSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
  options: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  useTitleCaseOptions?: boolean;
}

export const DropdownFields = ({
  selectedOptions,
  dropdownName,
  dropdownNamePlacement,
  updateSelectedOptions,
  options,
  useTitleCaseOptions,
}: Props): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleOptionClick = (id: string): void => {
    let updatedList: any[] = [];
    if (selectedOptions.includes(id)) {
      updatedList = selectedOptions.filter((fieldId) => fieldId !== id);
    } else {
      updatedList = [...selectedOptions, id];
    }
    updateSelectedOptions(updatedList);
  };

  const handleSearch = (searchTerm: string): void => {
    setSearchTerm(searchTerm);
  };

  const handleSelectAll = (): void => {
    const allOptionIds = options.map((option) => option.id);
    updateSelectedOptions(allOptionIds);
  };

  const handleClearAll = (): void => {
    updateSelectedOptions([]);
  };

  const filteredOptions = options.filter((options) =>
    options.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DropdownMenu
      trigger={dropdownName}
      placement={dropdownNamePlacement ?? "bottom-start"}
    >
      <SearchOption placeholder="Search" onSearch={handleSearch} />
      <DropdownItemCheckboxGroup id={dropdownName + "-options"}>
        {filteredOptions?.map((option) => (
          <DropdownItemCheckbox
            key={option.id}
            id={option.id}
            isSelected={selectedOptions.includes(option.id)}
            onClick={() => handleOptionClick(option.id)}
          >
            <TooltipContainer content={option.description}>
              {useTitleCaseOptions ? toTitleCase(option.name) : option.name}
            </TooltipContainer>
          </DropdownItemCheckbox>
        ))}
      </DropdownItemCheckboxGroup>
      <SelectClearOption
        onSelectAll={handleSelectAll}
        onClearAll={handleClearAll}
      />
    </DropdownMenu>
  );
};
