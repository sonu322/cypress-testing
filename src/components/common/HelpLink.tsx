import React from "react";
import { TooltipContainer } from "./TooltipContainer";
import QuestionIcon from "@atlaskit/icon/glyph/question";
import Button from "@atlaskit/button";
export const HelpLink = ({ href, description }) => {
  return (
    <TooltipContainer content={description ?? "get help"}>
      <Button
        appearance="default"
        target="_blank"
        href={href}
        iconBefore={<QuestionIcon label="" />}
      />
    </TooltipContainer>
  );
};
