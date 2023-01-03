import React, { useContext, useEffect, useMemo } from "react";
import { mutateTree } from "@atlaskit/tree";
import TreeUtils from "../../util/TreeUtils";
import {
  ID,
  IssueField,
  IssueTreeFilter,
  IssueWithSortedLinks,
} from "../../types/api";
import { AtlasTree } from "../../types/app";
import { IssueTree } from "./IssueTree";
import { orphansTreeBranchName } from "../../constants/traceabilityReport";
import { APIContext } from "../../context/api";

export interface Props {
  tree: AtlasTree;
  treeUtils: TreeUtils;
  setTree: (
    tree: AtlasTree
  ) => void | ((setterFunction: (tree: AtlasTree) => AtlasTree) => void);
  filter: IssueTreeFilter;
  issueFields: IssueField[];
  selectedIssueFieldIds: ID[];
  handleError: any;
  clearAllErrors: () => void;
  filteredIssues: IssueWithSortedLinks[];
  isOrphansBranchPresent: boolean;
  selectedJqlString: string;
}

export const IssueTreeMultiNode = ({
  tree,
  treeUtils,
  setTree,
  filter,
  issueFields,
  selectedIssueFieldIds,
  handleError,
  filteredIssues,
  clearAllErrors,
  isOrphansBranchPresent,
  selectedJqlString,
}: Props): JSX.Element => {
  const api = useContext(APIContext);
  const fieldMap = {};
  issueFields.forEach((field) => {
    fieldMap[field.id] = field;
  });

  useEffect(() => {
    const initTree = async (): Promise<void> => {
      let newTree = treeUtils.initMultiNodeTree(
        filter,
        issueFields,
        handleError,
        filteredIssues
      );
      setTree(newTree);
    };

    void initTree();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredIssues]);

  useEffect(() => {
    const rootNode = tree.items[treeUtils.ROOT_ID];
    const orphansTreeBranchId = `/${orphansTreeBranchName}`;
    if (isOrphansBranchPresent) {
      if (tree.items[orphansTreeBranchId] !== undefined) {
        setTree((tree) => {
          const newTree = treeUtils.addOrphansBranch(tree);
          return newTree;
        });
      }
    } else {
      if (rootNode.children.includes(orphansTreeBranchId)) {
        setTree((tree) => {
          const newTree = treeUtils.removeOrphansBranch(tree);
          return newTree;
        });
      }
    }
  }, [isOrphansBranchPresent]);

  useEffect(() => {
    const orphansTreeBranchId = `/${orphansTreeBranchName}`;
    const initOrphans = async (): Promise<void> => {
      const searchResult = await api.searchOrphanIssues(
        selectedJqlString,
        issueFields,
        0,
        20
      );

      try {
        setTree((tree) => {
          const newTree = treeUtils.initOrphanBranch(
            searchResult.data,
            tree,
            selectedJqlString,
            issueFields,
            handleError,
            filteredIssues
          );
          return newTree;
        });
      } catch (e) {
        handleError(e);
        console.log(e);
      }
    };

    if (
      tree.items[orphansTreeBranchId] === undefined &&
      isOrphansBranchPresent
    ) {
      void initOrphans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOrphansBranchPresent, filteredIssues]);
  return (
    <IssueTree
      tree={tree}
      treeUtils={treeUtils}
      setTree={setTree}
      filter={filter}
      issueFields={issueFields}
      selectedIssueFieldIds={selectedIssueFieldIds}
      handleError={handleError}
      clearAllErrors={clearAllErrors}
      isMultiNodeTree={true}
      isOrphansBranchPresent={isOrphansBranchPresent}
    />
  );
};
