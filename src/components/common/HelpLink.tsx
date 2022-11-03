import React from "react";
import { TooltipContainer } from "./TooltipContainer";
import QuestionIcon from "@atlaskit/icon/glyph/question";
import Button from "@atlaskit/button";
interface Props {
  href: string;
  description: string;
}
export const HelpLink = ({href, description}: Props): JSX.Element => {
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
