import React from "react";
import Tooltip from "@atlaskit/tooltip";
export const TooltipContainer = ({ content, position, children }) => {
  return (
    <Tooltip content={content} position={position ?? "bottom-end"}>
      {(props) => <div {...props}>{children}</div>}
    </Tooltip>
  );
};
