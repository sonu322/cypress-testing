import React, { useEffect, useState } from "react";
import DropdownMenu, {
  DropdownItemCheckboxGroup,
  DropdownItemCheckbox,
} from "@atlaskit/dropdown-menu";
import { toTitleCase } from "../../util";
import { TooltipContainer } from "./TooltipContainer";
import { SearchOption } from "./SearchOption";
import { SelectClearOption } from "./SelectClearOption";
import styled from "styled-components";

const FilterContainer = styled.sup`
  padding-left: 4px;
  vertical-align: top;
  font-size: 16px;
  color: #e1422c;
`;

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
  const [isFiltered, setIsFiltered] = useState(false);
  const isAllSelected = selectedOptions.length === options.length;

  const handleOptionClick = (id: string): void => {
    let updatedList: any[] = [];
    if (selectedOptions.includes(id)) {
      updatedList = selectedOptions.filter((fieldId) => fieldId !== id);
    } else {
      updatedList = [...selectedOptions, id];
    }
    updateSelectedOptions(updatedList);
    setIsFiltered(updatedList.length !== options.length);
  };

  const handleSearch = (searchTerm: string): void => {
    setSearchTerm(searchTerm);
  };

  const handleSelectAll = (): void => {
    const allOptionIds = options.map((option) => option.id);
    updateSelectedOptions(allOptionIds);
    setIsFiltered(false);
  };

  const handleClearAll = (): void => {
    updateSelectedOptions([]);
    setIsFiltered(true);
  };

  const filteredOptions = options.filter((options) =>
    options.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div style={{ position: "relative" }}>
      <DropdownMenu
        trigger={
          <div>
            {dropdownName}
            {!isAllSelected &&
              (isFiltered ? <FilterContainer>*</FilterContainer> : null)}
          </div>
        }
        placement={dropdownNamePlacement ?? "bottom-start"}
      >
        <div style={{ position: "sticky", top: 0, zIndex: 1 }}>
          <SearchOption
            placeholder="Search"
            onSearch={handleSearch}
            searchTerm={searchTerm}
          />
        </div>
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
        <div style={{ position: "sticky", bottom: 0, zIndex: 1 }}>
          <SelectClearOption
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
          />
        </div>
      </DropdownMenu>
    </div>
  );
};
