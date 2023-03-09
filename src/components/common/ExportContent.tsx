import React from "react";
import { TooltipContainer } from "./TooltipContainer";
import { DropdownActionMenu } from "./DropdownActionMenu";
import { ExportOptions } from "../../types/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";

interface Props {
  exportContent: (exportTypeId: string) => Promise<void>;
  description: string;
  isDisabled: boolean;
  options: ExportOptions[];
  actionHandler: (id: string) => void;
}

export const ExportContent = ({
  exportContent,
  description,
  isDisabled,
  options,
  actionHandler,
}: Props): JSX.Element => {
  return (
    <TooltipContainer content={description}>
      <DropdownActionMenu
        dropdownName={<FontAwesomeIcon icon={faFileExport} />}
        actionHandler={exportContent}
        options={options}
      />
    </TooltipContainer>
  );
};
