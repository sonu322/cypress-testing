import React from "react";
import { TooltipContainer } from "./TooltipContainer";
import ExportIcon from "@atlaskit/icon/glyph/export";
import Button from "@atlaskit/button";

interface Props {
  exportContent: () => void;
  description: string;
  isDisabled: boolean;
}

export const ExportContent = ({
  exportContent,
  description,
  isDisabled,
}: Props): JSX.Element => {
  return (
    <TooltipContainer content={description}>
      <Button
        appearance="default"
        iconBefore={<ExportIcon label={description} />}
        onClick={exportContent}
        isDisabled={isDisabled}
      />
    </TooltipContainer>
  );
};
