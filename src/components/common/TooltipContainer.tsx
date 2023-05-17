import React from "react";

export const TooltipContainer = ({
  content,
  position = "bottom-end",
  children,
}): JSX.Element => {
  return <span title={content}>{children}</span>;
};
