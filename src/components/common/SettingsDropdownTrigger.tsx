import React from "react";

import Button from "@atlaskit/button";
import SettingsIcon from "@atlaskit/icon/glyph/settings";
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down";
export const SettingsDropdownTrigger = ({ triggerRef, ...props }) => {
  return (
    <Button
      {...props}
      iconBefore={<SettingsIcon label="" />}
      iconAfter={<ChevronDownIcon label="" />}
      ref={triggerRef}
    />
  );
};
