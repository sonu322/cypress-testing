import React from "react";
import { TooltipContainer } from "./TooltipContainer";
import  Badge from "@atlaskit/badge";
export const StoryPointsInfo = ({ content }) => {
  if (content.value) {
    let {value, name} = content;
    return (
      <TooltipContainer content={value + " " + name}>
        <Badge>{value}</Badge>
      </TooltipContainer>
    );
  } else {
    return <div></div>;
  }
};
