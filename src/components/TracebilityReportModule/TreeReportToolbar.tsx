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
  treeHasOnlyOrphans: boolean;
  updateTreeHasOnlyOrphans: (treeHasOnlyOptions: boolean) => void;
}
export const TreeReportToolbar = ({
  // priorities,
  // issueTypes,
  // linkTypes,
  options,
  filter,
  updateFilteredKeyOptions,
  treeHasOnlyOrphans,
  updateTreeHasOnlyOrphans,
}: Props): JSX.Element => {
  const toggleOrphans = (): void => {
    updateTreeHasOnlyOrphans(!treeHasOnlyOrphans);
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
        {treeHasOnlyOrphans ? "Hide Orphan Issues" : "Show Orphan Issues"}
      </Button>
    </FlexContainer>
  );
};
