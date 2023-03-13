import React from "react";
import { TooltipContainer } from "./TooltipContainer";
import Button from "@atlaskit/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";

interface Props {
  exportContent: () => void;
  description: string;
  isDisabled: boolean;
}

export const ExportButton = ({
  exportContent,
  description,
  isDisabled,
}: Props): JSX.Element => {
  return (
    <TooltipContainer content={description}>
      <Button
        appearance="default"
        onClick={exportContent}
        isDisabled={isDisabled}
      >
        <FontAwesomeIcon icon={faFileExport} />
      </Button>
    </TooltipContainer>
  );
};
