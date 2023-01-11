import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import {
  IssueField,
  IssueTreeFilter,
  IssueWithSortedLinks,
} from "../../types/api";
import { getScreenHeight } from "../../util/common";
import { IssueTreeMultiNode } from "../IssueTreeModule/IssueTreeMultiNode";
import { APIContext } from "../../context/api";
import TreeUtils from "../../util/TreeUtils";
import { AtlasTree } from "../../types/app";

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
}: Props): JSX.Element => {
  // TODO: probably we may improve this calculation
  const calculateTableHeight = (errors) => {
    const headingHeight = 40 + 8; // 8: margin top
    const toolbarHeight = 94 + 8 + 42; // 8: table top margin
    const footerHeight = 32 + 8 + 8;
    const // more button 8: margin top and bottom
      errorsHeight = errors && errors.length ? (52 + 8) * errors.length : 0;
    const finalHeight =
      getScreenHeight() -
      headingHeight -
      toolbarHeight -
      footerHeight -
      errorsHeight -
      2;
    return finalHeight < 200 ? 200 : finalHeight;
  };
  const api = useContext(APIContext);
  const treeUtils = new TreeUtils(api);

  const [tableHeight, setTableHeight] = useState(calculateTableHeight(errors));
  useEffect(() => {
    const resizeHandler = () => {
      setTableHeight((prevHeight) => {
        if (_AP !== null) {
          _AP.sizeToParent();
        }
        return calculateTableHeight(errors);
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
      />
    </Container>
  );
};
