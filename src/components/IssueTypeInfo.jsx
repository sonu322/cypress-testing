import React from "react";
import { TooltipContainer } from "./TooltipContainer";
import { Icon } from "./Icon";
export const IssueTypeInfo = ({ content }) => {
  console.log("from issue type");
  console.log(content);
  const { name, iconUrl, description } = content.value;
  const tooltipMesssage = `${name} - ${description}`;
  return (
    <TooltipContainer content={tooltipMesssage}>
      <Icon src={iconUrl} />
    </TooltipContainer>
  );
};
