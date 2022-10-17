import React from "react";
import { TooltipContainer } from "./TooltipContainer";
import { Icon } from "./Icon";
export const PriorityInfo = ({ content }) => {
  if (content.value) {
    const { name, iconUrl } = content.value;
    return (
      <TooltipContainer content={name}>
        <Icon src={iconUrl} />
      </TooltipContainer>
    );
  } else {
    return <div></div>;
  }
};
