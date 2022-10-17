import React from "react";
import { TooltipContainer } from "./TooltipContainer";

export const IssueSummary = ({content}) => {
  return (
    <TooltipContainer content={content} position="bottom">
      <div>{content}</div>
    </TooltipContainer>
  );
};
