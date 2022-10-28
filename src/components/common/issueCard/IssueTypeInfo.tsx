import React from "react";
import { TooltipContainer } from "../TooltipContainer";
import { Icon } from "../Icon";
import { IssueType } from "../../../types/api";

export interface Props {
  content: IssueType;
}

export const IssueTypeInfo = ({ content }: Props ) => {
  const { name, iconUrl, description } = content;
  const tooltipMesssage = `${name}: ${description}`;
  return (
    <TooltipContainer content={tooltipMesssage}>
      <Icon src={iconUrl} />
    </TooltipContainer>
  );
};
