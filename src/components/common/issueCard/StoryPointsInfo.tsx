import React from "react";
import { TooltipContainer } from "../TooltipContainer";
import Badge from "@atlaskit/badge";

export interface Props {
  content: number;
}

export const StoryPointsInfo = ({ content }: Props) => {
  if (content) {
    return (
      <TooltipContainer content={"Story Points: " + content}>
        <Badge>{content}</Badge>
      </TooltipContainer>
    );
  }
};
