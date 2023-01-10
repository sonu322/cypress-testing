import React from "react";
import { TooltipContainer } from "../TooltipContainer";
import Avatar from "@atlaskit/avatar";
import { useTranslation } from "react-i18next";
export const AssigneeInfo = ({ content }) => {
  const { t } = useTranslation();
  let message;
  let imgSrc;
  if (content) {
    message = `${t("otpl.lxp.common.issue.assignee")}: ${content.displayName}`;
    imgSrc = content.avatarUrl;
  } else {
    message = t("otpl.lxp.common.unassigned");
    imgSrc = null;
  }

  return (
    <TooltipContainer content={message}>
      <Avatar size="small" src={imgSrc}></Avatar>
    </TooltipContainer>
  );
};
