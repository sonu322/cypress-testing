import React from "react";
import { TooltipContainer } from "./TooltipContainer";
import Avatar from "@atlaskit/avatar";
export const AssigneeInfo = ({ content }) => {
  let message;
  let imgSrc;
  if (content.value) {
    message = "Assignee:" + content.value.displayName;
    imgSrc = content.value.avatarUrls["16x16"];
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
