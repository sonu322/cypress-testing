import React from "react";
import { TooltipContainer } from "../TooltipContainer";
import { Icon } from "../Icon";
import { IssuePriority } from "../../../types/api";

interface Props {
  content: IssuePriority
}

export const PriorityInfo = ({ content }: Props) => {
  const { name, iconUrl } = content;
  return (
    <TooltipContainer content={name}>
      <Icon src={iconUrl} />
    </TooltipContainer>
  );
};
