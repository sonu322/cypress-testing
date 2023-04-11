import React from "react";
import Button from "@atlaskit/button";
import { TooltipContainer } from "../TooltipContainer";
import SettingsIcon from "@atlaskit/icon/glyph/settings";
interface Props {
  handleClick: () => void;
}

export const ConfigureGadgetButton: React.FC<Props> = ({ handleClick }) => {
  return (
    <TooltipContainer content={"Configure Gadget"}>
      <Button
        appearance="default"
        onClick={handleClick}
        iconBefore={<SettingsIcon label="Configure Gadget" />}
      >
        Configure
      </Button>
    </TooltipContainer>
  );
};
