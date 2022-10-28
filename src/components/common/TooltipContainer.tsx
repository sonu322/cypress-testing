import React from "react";
import Tooltip from "@atlaskit/tooltip";
export const TooltipContainer = ({ content, position= "bottom-end", children }) => {
  return (
    //@ts-ignore
    <Tooltip content={content} position={position}>
      {(props) => <div {...props}>{children}</div>}
    </Tooltip>
  );
};
