import React, { useState, useEffect } from "react";
import DropdownMenu, {
  DropdownItemCheckboxGroup,
  DropdownItemCheckbox,
} from "@atlaskit/dropdown-menu";
import { toTitleCase } from "../../util";
import { TooltipContainer } from "./TooltipContainer";
import { SearchOption } from "./SearchOption";
import { SelectClearOption } from "./SelectClearOption";
import styled from "styled-components";
import { Icon } from "./Icon";
import { token } from "@atlaskit/tokens";

const FilterContainer = styled.sup`
  padding-left: 4px;
  vertical-align: top;
  font-size: 16px;
  color: ${token("color.text.accent.red", "#e1422c")};
`;

interface Props {
  id?: string;
  selectedOptions: string[];
  dropdownName: string;
  dropdownNamePlacement?: string;
  updateSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
  options: Array<{
    id: string;
    name: string;
    description: string;
    iconUrl?: string;
  }>;
  useTitleCaseOptions?: boolean;
  showFilterIndicatorOnClearAll?: boolean;
}

export const DropdownFields = ({
  id,
  selectedOptions,
  dropdownName,
  dropdownNamePlacement,
  updateSelectedOptions,
  options,
  useTitleCaseOptions,
  showFilterIndicatorOnClearAll = false,
}: Props): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [showFilterIndicator, setShowFilterIndicator] = useState(false);

  const isAllSelected = selectedOptions.length === options.length;

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
    if (showFilterIndicatorOnClearAll) {
      setShowFilterIndicator(true);
    }
    updateSelectedOptions([]);
  };

  const filteredOptions = options.filter((options) =>
    options.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setIsFiltered(!isAllSelected && selectedOptions.length > 0);
  }, [selectedOptions, options]);

  const renderOptionWithIcon = (option) => {
    const { iconUrl } = option;

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {iconUrl && (
          <div style={{ marginRight: "4px" }}>
            <Icon src={iconUrl} />
          </div>
        )}
        <span>
          {useTitleCaseOptions ? toTitleCase(option.name) : option.name}
        </span>
      </div>
    );
  };

  const getOptionId = (name: string) => {
    return name.toLowerCase().split(" ").join("-");
  };

  return (
    <div id={id} style={{ position: "relative" }}>
      <DropdownMenu
        trigger={
          <div>
            {dropdownName}
            {!isAllSelected &&
              (isFiltered || showFilterIndicator ? (
                <FilterContainer>*</FilterContainer>
              ) : null)}
          </div>
        }
        placement={dropdownNamePlacement ?? "bottom-start"}
      >
        <div id={id + "-container"}>
          <div style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <SearchOption
              placeholder="Search"
              onSearch={handleSearch}
              searchTerm={searchTerm}
            />
          </div>
          <DropdownItemCheckboxGroup id={id + "-options"}>
            {filteredOptions?.map((option) => (
              <DropdownItemCheckbox
                key={option.id}
                id={id + "-" + getOptionId(option.name)}
                isSelected={selectedOptions.includes(option.id)}
                onClick={() => handleOptionClick(option.id)}
              >
                <TooltipContainer content={option.description}>
                  {renderOptionWithIcon(option)}
                </TooltipContainer>
              </DropdownItemCheckbox>
            ))}
          </DropdownItemCheckboxGroup>
          <div className="dropdown-footer" style={{ position: "sticky", bottom: 0, zIndex: 1 }}>
            <SelectClearOption
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      </DropdownMenu>
    </div>
  );
};
