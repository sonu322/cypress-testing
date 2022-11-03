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
    <TooltipContainer content={description ?? "export"}>
      <Button
        appearance="default"
        iconBefore={<ExportIcon label="" />}
        onClick={exportContent}
        isDisabled={isDisabled}
      />
    </TooltipContainer>
  );
};
