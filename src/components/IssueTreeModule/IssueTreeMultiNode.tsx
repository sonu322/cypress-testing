import React, { useEffect, useMemo } from "react";
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
  const fieldMap = {};
  issueFields.forEach((field) => {
    fieldMap[field.id] = field;
  });

  useEffect(() => {
    console.log("called use effect");
    const initTree = async (): Promise<void> => {
      let newTree = treeUtils.initMultiNodeTree(
        filter,
        issueFields,
        handleError,
        filteredIssues
      );
      if (isOrphansBranchPresent) {
        newTree = await treeUtils.initOrphanBranch(
          newTree,
          selectedJqlString,
          issueFields,
          handleError,
          filteredIssues
        );
      }
      console.log("newest new tree");
      console.log(newTree);
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
          console.log("NEW TREEEEEEE!!!!", newTree);
          return newTree;
        });
      } else {
        setTree(async (tree) => {
          const newPreviousTree = treeUtils.cloneTree(tree);
          const newTree = await treeUtils.initOrphanBranch(
            newPreviousTree,
            selectedJqlString,
            issueFields,
            handleError,
            filteredIssues
          );
          console.log("NEW TREEEEEEE!!!! from async add", newTree);
          return newTree;
        });
      }
    } else {
      if (rootNode.children.includes(orphansTreeBranchId)) {
        setTree((tree) => {
          const newTree = treeUtils.removeOrphansBranch(tree);
          console.log("NEW TREEEEEEE!!!! from remove", newTree);
          return newTree;
        });
      }
    }
  }, [isOrphansBranchPresent]);
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
