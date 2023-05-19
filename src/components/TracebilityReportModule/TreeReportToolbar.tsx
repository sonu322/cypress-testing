import React, { useContext, useState } from "react";
import styled from "styled-components";
import { treeFilterDropdowns } from "../../constants/common";
import { TreeFilterDropdowns } from "../IssueTreeModule/TreeFilterDropdowns";
import { LoadingButton } from "@atlaskit/button";
import Heading from "@atlaskit/heading";
import {
  IssueField,
  IssueLinkType,
  IssuePriority,
  IssueTreeFilter,
  IssueType,
} from "../../types/api";
import { useTranslation } from "react-i18next";
import TreeUtils from "../../util/TreeUtils";
import { APIContext } from "../../context/api";
import { TreeFilterContext } from "../../context/treeFilterContext";
import { AtlasTree } from "../../types/app";
const FlexContainer = styled.div`
  display: flex;
  gap: 4px;
  position: relative;
  padding-top: 10px;
  flex-wrap: wrap;
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
  issueFields: IssueField[];
  tree: AtlasTree;
  setTree: React.Dispatch<React.SetStateAction<AtlasTree>>;
  handleNewError: (err: unknown) => void;
  clearAllErrors: () => void;
}
export const TreeReportToolbar = ({
  options,
  filter,
  updateFilteredKeyOptions,
  isOrphansBranchPresent,
  updateIsOrphansBranchPresent,
  isToggleOrphansLoading,
  issueFields,
  tree,
  setTree,
  handleNewError,
  clearAllErrors,
}: Props): JSX.Element => {
  const [isExpandAllLoading, setIsExpandAllLoading] = useState(false);
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
  const api = useContext(APIContext);
  const treeUtils = new TreeUtils(api);
  const treeFilterContext = useContext(TreeFilterContext);

  return (
    <ToolbarContainer>
      <Heading level={"h300"}>{treeToolBarHeading}</Heading>
      <FlexContainer>
        <TreeFilterDropdowns
          isMultiNodeTree
          options={options}
          filter={filter}
          filterDropdowns={treeFilterDropdowns}
          updateFilteredKeyOptions={updateFilteredKeyOptions}
          isExpandAllLoading={isExpandAllLoading}
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
