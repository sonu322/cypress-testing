import React from "react";
import { TooltipContainer } from "../TooltipContainer";
import Avatar from "@atlaskit/avatar";
export const AssigneeInfo = ({ content }) => {
  let message;
  let imgSrc;
  if (content) {
    message = "Assignee: " + content.displayName;
    imgSrc = content.avatarUrl;
  } else {
    message = "Unassigned";
    imgSrc = null;
  }

  return (
    <TooltipContainer content={message}>
      <Avatar src={imgSrc}></Avatar>
    </TooltipContainer>
  );
};
