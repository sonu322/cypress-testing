import React from "react";
import Button from "@atlaskit/button";

interface Props {
  onSelectAll: () => void;
  onClearAll: () => void;
}

export const SelectClearOption = ({
  onSelectAll,
  onClearAll,
}: Props): JSX.Element => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Button onClick={onSelectAll}>Select All</Button>
      <Button onClick={onClearAll}>Clear All</Button>
    </div>
  );
};
