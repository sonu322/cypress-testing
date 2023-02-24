import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import {
  IssueField,
  IssueTreeFilter,
  IssueWithSortedLinks,
} from "../../types/api";
import { IssueTreeMultiNode } from "../IssueTreeModule/IssueTreeMultiNode";
import { APIContext } from "../../context/api";
import TreeUtils from "../../util/TreeUtils";
import { AtlasTree } from "../../types/app";
import TracebilityReportUtils from "../../util/tracebilityReportsUtils";

const Container = styled.div`
  width: 100%;
  overflow: scroll;
  border: 1px solid ${colors.N40};
  border-radius: 10px;
`;

// @ts-expect-error
const _AP: any = typeof AP !== "undefined" ? AP : null;

interface Props {
  filteredIssues: IssueWithSortedLinks[];
  selectedIssueFieldIds: string[];
  errors: any[];
  issueFields: IssueField[];
  clearAllErrors: () => void;
  handleError: (err: unknown) => void;
  issueTreeFilter: IssueTreeFilter;
  isOrphansBranchPresent: boolean;
  selectedJqlString: string;
  tree: AtlasTree;
  setTree: React.Dispatch<React.SetStateAction<AtlasTree>>;
  isToggleOrphansLoading: boolean;
  updateIsToggleOrphansLoading: (isToggleOrphansLoading: boolean) => void;
  selectedLimitOptionId: number;
}
export const TreeReport = ({
  selectedJqlString,
  filteredIssues,
  selectedIssueFieldIds,
  issueFields,
  clearAllErrors,
  handleError,
  errors,
  issueTreeFilter,
  isOrphansBranchPresent,
  tree,
  setTree,
  updateIsToggleOrphansLoading,
  isToggleOrphansLoading,
  selectedLimitOptionId,
}: Props): JSX.Element => {
  const api = useContext(APIContext);
  const treeUtils = new TreeUtils(api);
  const traceabilityReportUtils = new TracebilityReportUtils(api);

  const initialHeight = traceabilityReportUtils.calculateTreeHeight(errors);
  const [tableHeight, setTableHeight] = useState(initialHeight);
  useEffect(() => {
    const resizeHandler = () => {
      setTableHeight((prevHeight) => {
        if (_AP !== null) {
          _AP.sizeToParent();
        }
        return traceabilityReportUtils.calculateTreeHeight(errors);
      });
    };
    window.addEventListener("resize", resizeHandler);
    resizeHandler();
    return () => window.removeEventListener("resize", resizeHandler);
  }, [errors]);

  return (
    <Container style={{ maxHeight: tableHeight }}>
      <IssueTreeMultiNode
        tree={tree}
        setTree={setTree}
        filter={issueTreeFilter}
        treeUtils={treeUtils}
        issueFields={issueFields}
        selectedIssueFieldIds={selectedIssueFieldIds}
        handleError={handleError}
        clearAllErrors={clearAllErrors}
        filteredIssues={filteredIssues}
        isOrphansBranchPresent={isOrphansBranchPresent}
        selectedJqlString={selectedJqlString}
        isToggleOrphansLoading={isToggleOrphansLoading}
        updateIsToggleOrphansLoading={updateIsToggleOrphansLoading}
        selectedLimitOptionId={selectedLimitOptionId}
      />
    </Container>
  );
};
