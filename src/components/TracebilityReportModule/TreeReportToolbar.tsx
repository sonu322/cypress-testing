import React from "react";
import styled from "styled-components";
import { treeFilterDropdowns } from "../../constants/common";
import { TreeFilterDropdowns } from "../IssueTreeModule/TreeFilterDropdowns";
import { LoadingButton } from "@atlaskit/button";
import Heading from "@atlaskit/heading";
import {
  IssueLinkType,
  IssuePriority,
  IssueTreeFilter,
  IssueType,
} from "../../types/api";
import { useTranslation } from "react-i18next";
import TreeUtils from "../../util/TreeUtils";
import { APIContext } from "../../context/api";
const FlexContainer = styled.div`
  display: flex;
  gap: 4px;
  position: relative;
  padding-top: 10px;
`;

const ToolbarContainer = styled.div`
  padding-top: 16px;
`;

interface Props {
  options: {
    issueTypes: IssueType[];
    linkTypes: IssueLinkType[];
    priorities: IssuePriority[];
  };
  filter: IssueTreeFilter;
  updateFilteredKeyOptions: (key: string, keyOptions: string[]) => void;
  isOrphansBranchPresent: boolean;
  updateIsOrphansBranchPresent: (treeHasOnlyOptions: boolean) => void;
  isToggleOrphansLoading: boolean;
}
export const TreeReportToolbar = ({
  options,
  filter,
  updateFilteredKeyOptions,
  isOrphansBranchPresent,
  updateIsOrphansBranchPresent,
  isToggleOrphansLoading,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const hideOrphanText = t(
    "otpl.lxp.traceability-report.tree-view.hide-orphan-issues"
  );
  const showOrphanText = t(
    "otpl.lxp.traceability-report.tree-view.show-orphan-issues"
  );
  const treeToolBarHeading = t(
    "otpl.lxp.traceability-report.tree-view.tree-toolbar-heading"
  );
  const toggleOrphans = (): void => {
    updateIsOrphansBranchPresent(!isOrphansBranchPresent);
  };

  return (
    <ToolbarContainer>
      <Heading level={"h300"}>{treeToolBarHeading}</Heading>
      <FlexContainer>
        <TreeFilterDropdowns
          options={options}
          filter={filter}
          filterDropdowns={treeFilterDropdowns}
          updateFilteredKeyOptions={updateFilteredKeyOptions}
          isMultiNodeTree={true}
        />
        <LoadingButton
          onClick={toggleOrphans}
          isLoading={isToggleOrphansLoading}
        >
          {isOrphansBranchPresent ? hideOrphanText : showOrphanText}
        </LoadingButton>
      </FlexContainer>
    </ToolbarContainer>
  );
};
