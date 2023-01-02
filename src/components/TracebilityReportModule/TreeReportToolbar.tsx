import React from "react";
import styled from "styled-components";
import { treeFilterDropdowns } from "../../constants/common";
import { TreeFilterDropdowns } from "../IssueTreeModule/TreeFilterDropdowns";
import Button from "@atlaskit/button";
import {
  IssueLinkType,
  IssuePriority,
  IssueTreeFilter,
  IssueType,
} from "../../types/api";
import { useTranslation } from "react-i18next";
const FlexContainer = styled.div`
  display: flex;
  gap: 4px;
  padding-top: 10px;
  position: relative;
  top: 8px;
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
}
export const TreeReportToolbar = ({
  // priorities,
  // issueTypes,
  // linkTypes,
  options,
  filter,
  updateFilteredKeyOptions,
  isOrphansBranchPresent,
  updateIsOrphansBranchPresent,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const hideOrphanText = t("traceability-report.tree-view.hide-orphan-issues");
  const showOrphanText = t("traceability-report.tree-view.show-orphan-issues");
  const toggleOrphans = (): void => {
    updateIsOrphansBranchPresent(!isOrphansBranchPresent);
  };

  return (
    <FlexContainer>
      <TreeFilterDropdowns
        options={options}
        filter={filter}
        filterDropdowns={treeFilterDropdowns}
        updateFilteredKeyOptions={updateFilteredKeyOptions}
      />
      <Button onClick={toggleOrphans}>
        {isOrphansBranchPresent ? hideOrphanText : showOrphanText}
      </Button>
    </FlexContainer>
  );
};
