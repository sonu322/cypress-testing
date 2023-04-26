import React from "react";
import Button from "@atlaskit/button";
import { TooltipContainer } from "../TooltipContainer";
import SettingsIcon from "@atlaskit/icon/glyph/settings";
import { useTranslation } from "react-i18next";
interface Props {
  handleClick: () => void;
}

export const ConfigureGadgetButton: React.FC<Props> = ({ handleClick }) => {
  const { t } = useTranslation();
  const configureGadgetLabel = t("otpl.lxp.gadget-common.configure-label");
  const configureGadgetDescription = t(
    "otpl.lxp.tree-gadget.configure-button.description"
  );
  return (
    <TooltipContainer content={configureGadgetDescription}>
      <Button
        appearance="default"
        onClick={handleClick}
        iconBefore={<SettingsIcon label={configureGadgetDescription} />}
      >
        {configureGadgetLabel}
      </Button>
    </TooltipContainer>
  );
};
