import React from "react";
import Button from "@atlaskit/button";
import { token } from "@atlaskit/tokens";

interface Props {
  onSelectAll: () => void;
  onClearAll: () => void;
}

export const SelectClearOption = ({
  onSelectAll,
  onClearAll,
}: Props): JSX.Element => {
  return (
    <div
      style={{
        borderTop: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: token("elevation.surface.overlay"),
      }}
    >
      <Button appearance="subtle-link" onClick={onSelectAll}>
        Select All
      </Button>
      <Button appearance="subtle-link" onClick={onClearAll}>
        Clear All
      </Button>
    </div>
  );
};
