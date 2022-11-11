import React from "react";
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from "@atlaskit/dropdown-menu";
import { Filter } from "../../types/api";

interface Props {
  selectedOptionId: string;
  dropdownName: string;
  setSelectedOptionId: React.Dispatch<React.SetStateAction<string>>;
  options: Filter[];
}

export const DropdownSingleSelect = ({
  selectedOptionId,
  dropdownName,
  setSelectedOptionId: updateSelectedOptionId,
  options,
}: Props): JSX.Element => {
  return (
    <DropdownMenu
      triggerType="button"
      trigger={dropdownName}
      position="bottom right"
      isCompact={true}
    >
      <DropdownItemGroup>
        {options?.map((option) => (
          <DropdownItem
            key={option.id}
            id={option.id}
            isSelected={selectedOptionId == option.id}
            onClick={() => updateSelectedOptionId(option.id)}
          >
            {option.name}
          </DropdownItem>
        ))}
      </DropdownItemGroup>
    </DropdownMenu>
  );
};
