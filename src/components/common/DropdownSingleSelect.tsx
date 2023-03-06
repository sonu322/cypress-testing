import React from "react";
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from "@atlaskit/dropdown-menu";

interface Props {
  selectedOptionId: string | number;
  dropdownName: string;
  updateSelectedOptionId: (optionId: number | string) => void;
  options: Array<{ name: string | number; id: string | number }>;
}

export const DropdownSingleSelect = ({
  selectedOptionId,
  dropdownName,
  updateSelectedOptionId,
  options,
}: Props): JSX.Element => {
  return (
    <DropdownMenu
      triggerType="button"
      trigger={dropdownName}
      placement={"bottom-start"}
      isCompact={true}
    >
      <DropdownItemGroup>
        {options?.map((option) => (
          <DropdownItem
            key={option.id}
            id={option.id}
            isSelected={selectedOptionId === option.id}
            onClick={() => updateSelectedOptionId(option.id)}
          >
            {option.name}
          </DropdownItem>
        ))}
      </DropdownItemGroup>
    </DropdownMenu>
  );
};
