import React from "react";
import Button, { ButtonGroup, LoadingButton } from "@atlaskit/button";
import { IssueOptionsDropdown } from "./IssueOptionsDropdown";
import ExpandIcon from "@atlaskit/icon/glyph/hipchat/chevron-double-down";
import CollapseIcon from "@atlaskit/icon/glyph/hipchat/chevron-double-up";
import { TooltipContainer } from "../common/TooltipContainer";

export const TreeFilterDropdowns = ({
  options,
  filter,
  filterDropdowns,
  updateFilteredKeyOptions,
  expandAll,
  isExpandAllLoading,
  collapseAll
}): JSX.Element => {
  return (
    <ButtonGroup>
      {filterDropdowns.map((fd) => (
        <IssueOptionsDropdown
          key={fd.key}
          keyName={fd.key}
          dropdownName={fd.label}
          options={options[fd.key]}
          selectedOptions={filter[fd.key]}
          updateSelectedOptions={updateFilteredKeyOptions}
        />
      ))}
      <TooltipContainer content={t("lxp.toolbar.expand-all.title")}>
        <LoadingButton
          appearance="default"
          iconBefore={<ExpandIcon label={""} />}
          onClick={expandAll}
          isLoading={isExpandAllLoading}
          isDisabled={isExpandAllLoading}
        />
      </TooltipContainer>
      <TooltipContainer content={t("lxp.toolbar.collapse-all.title")}>
        <Button
          appearance="default"
          iconBefore={<CollapseIcon label={""} />}
          onClick={collapseAll}
        />
      </TooltipContainer>
    </ButtonGroup>
  );
};
