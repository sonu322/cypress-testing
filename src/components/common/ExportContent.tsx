import React from "react";
import { TooltipContainer } from "./TooltipContainer";
import ExportIcon from "@atlaskit/icon/glyph/export";
import Button from "@atlaskit/button";
// import { Dropdown } from "./Dropdown";
// import { ExportOptions } from "../../types/api";

interface Props {
  exportContent: () => void;
  description: string;
  isDisabled: boolean;
  // options: ExportOptions[];
  // selectedExportOptions: string[];
  // updateSelectedExportOptions: (ids: string[]) => void;
}

export const ExportContent = ({
  exportContent,
  description,
  isDisabled,
}: // options,
// selectedExportOptions,
// updateSelectedExportOptions,
Props): JSX.Element => {
  return (
    <TooltipContainer content={description}>
      <Button
        appearance="default"
        iconBefore={<ExportIcon label={description} />}
        onClick={exportContent}
        isDisabled={isDisabled}
      />
      {/* <Dropdown
        dropdownName={<ExportIcon label={description} />}
        // isDisabled={isDisabled}
        // onClick={exportContent}
        options={options}
        selectedOptions={selectedExportOptions}
        updateSelectedOptions={updateSelectedExportOptions}
      /> */}
    </TooltipContainer>
  );
};
