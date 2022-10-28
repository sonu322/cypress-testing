import React from "react";
import { TooltipContainer } from "../TooltipContainer";

export interface Props {
  content: string;
}

export const IssueSummary = ({content}: Props ) => {
  return (
    <TooltipContainer content={content} position="bottom">
      <div>{content}</div>
    </TooltipContainer>
  );
};
