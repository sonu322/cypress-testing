import React from "react";
import { TooltipContainer } from "./TooltipContainer";
import { Icon } from "./Icon";
export const IssueTypeInfo = ({content}) => {
  const { name, iconUrl } = content.value;
  return (
    <TooltipContainer position="bottom-end" content={name}>
      <Icon src={iconUrl} />
    </TooltipContainer>
  );
};
