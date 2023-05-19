import React from "react";
import Button, { ButtonGroup, LoadingButton } from "@atlaskit/button";
import { IssueOptionsDropdown } from "./IssueOptionsDropdown";
import ExpandIcon from "@atlaskit/icon/glyph/hipchat/chevron-double-down";
import CollapseIcon from "@atlaskit/icon/glyph/hipchat/chevron-double-up";
import { TooltipContainer } from "../common/TooltipContainer";
import { useTranslation } from "react-i18next";
import {
  IssueLinkType,
  IssuePriority,
  IssueTreeFilter,
  IssueType,
} from "../../types/api";

interface Props {
  options: {
    issueTypes: IssueType[];
    linkTypes: IssueLinkType[];
    priorities: IssuePriority[];
  };
  filter: IssueTreeFilter;
  filterDropdowns: Array<{
    key: string;
    label: string;
  }>;
  updateFilteredKeyOptions: (key: string, keyOptions: string[]) => void;
  expandAll?: () => Promise<void>;
  isExpandAllLoading: boolean;
  collapseAll?: () => void;
  isMultiNodeTree?: boolean;
}
export const TreeFilterDropdowns = ({
  options,
  filter,
  filterDropdowns,
  updateFilteredKeyOptions,
  isExpandAllLoading,
  isMultiNodeTree = false,
  expandAll,
  collapseAll,
}: Props): JSX.Element => {
  const { t } = useTranslation();
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

      {!isMultiNodeTree && (
        <>
          <TooltipContainer content={t("otpl.lxp.toolbar.expand-all.title")}>
            <LoadingButton
              appearance="default"
              iconBefore={<ExpandIcon label={""} />}
              onClick={expandAll}
              isLoading={isExpandAllLoading}
              isDisabled={isExpandAllLoading}
            />
          </TooltipContainer>
          <TooltipContainer content={t("otpl.lxp.toolbar.collapse-all.title")}>
            <Button
              appearance="default"
              iconBefore={<CollapseIcon label={""} />}
              onClick={collapseAll}
            />
          </TooltipContainer>
        </>
      )}
    </ButtonGroup>
  );
};
