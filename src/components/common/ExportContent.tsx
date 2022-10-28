import React from "react";
import { TooltipContainer } from "./TooltipContainer";
import ExportIcon from "@atlaskit/icon/glyph/export";
import Button from "@atlaskit/button";
export const ExportContent = ({ exportContent, description }) => {
  return (
    <TooltipContainer content={description ?? "export"}>
      <Button
        appearance="default"
        iconBefore={<ExportIcon label=""/>}
        onClick={exportContent}
      />
    </TooltipContainer>
  );
};
