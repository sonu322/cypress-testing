import React, { useContext, useEffect } from "react";
import TreeUtils from "../../util/TreeUtils";
import {
  ID,
  IssueField,
  IssueTreeFilter,
  IssueWithSortedLinks,
} from "../../types/api";
import { AtlasTree } from "../../types/app";
import { IssueTree } from "./IssueTree";
import {
  orphansMaxResults,
  orphansTreeBranchName,
} from "../../constants/traceabilityReport";
import { APIContext } from "../../context/api";

export interface Props {
  tree: AtlasTree;
  treeUtils: TreeUtils;
  setTree: (tree: AtlasTree | ((tree: AtlasTree) => AtlasTree)) => void;
  filter: IssueTreeFilter;
  issueFields: IssueField[];
  selectedIssueFieldIds: ID[];
  handleError: any;
  clearAllErrors: () => void;
  filteredIssues: IssueWithSortedLinks[];
  isOrphansBranchPresent: boolean;
  selectedJqlString: string;
  isToggleOrphansLoading: boolean;
  updateIsToggleOrphansLoading: (isToggleOrphansLoading: boolean) => void;
  selectedLimitOptionId: number;
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
  isToggleOrphansLoading,
  updateIsToggleOrphansLoading,
  selectedLimitOptionId,
}: Props): JSX.Element => {
  const api = useContext(APIContext);
  const fieldMap = {};
  issueFields.forEach((field) => {
    fieldMap[field.id] = field;
  });
  useEffect(() => {
    const initTree = async (): Promise<void> => {
      const itemsTree = treeUtils.initMultiNodeTree(
        handleError,
        filteredIssues
      );
      setTree(itemsTree);
    };

    if (filteredIssues !== undefined && filteredIssues.length > 0) {
      if (filteredIssues.length <= selectedLimitOptionId) {
        void initTree();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedJqlString, filteredIssues]);

  useEffect(() => {
    if (filteredIssues?.length > selectedLimitOptionId) {
      setTree((prevTree) => {
        let shouldShowOrphansBranch = false;
        const isOrphansBranchPreviouslyPresent = prevTree.items[
          treeUtils.ROOT_ID
        ]?.children?.includes(`/${orphansTreeBranchName}`);
        if (isOrphansBranchPresent) {
          if (isOrphansBranchPreviouslyPresent) {
            if (prevTree.items[`/${orphansTreeBranchName}`] !== undefined) {
              shouldShowOrphansBranch = true;
            }
          }
        }
        const newTree = treeUtils.addNewNodes(
          handleError,
          filteredIssues,
          prevTree,
          shouldShowOrphansBranch
        );
        return newTree;
      });
    }
  }, [filteredIssues]);

  useEffect(() => {
    if (tree !== undefined) {
      const rootNode = tree.items[treeUtils.ROOT_ID];
      const orphansTreeBranchId = `/${orphansTreeBranchName}`;
      if (isOrphansBranchPresent) {
        if (tree.items[orphansTreeBranchId] !== undefined) {
          updateIsToggleOrphansLoading(true);
          setTree((tree) => {
            if (tree?.items !== undefined) {
              const isOrphanBranchHidden = !tree?.items[
                treeUtils.ROOT_ID
              ]?.children?.includes(`/${orphansTreeBranchName}`);
              if (isToggleOrphansLoading && isOrphanBranchHidden) {
                const newTree = treeUtils.addOrphansBranch(tree);
                return newTree;
              } else {
                return tree;
              }
            }
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
    }
  }, [isOrphansBranchPresent, tree]);

  useEffect(() => {
    const isOrphansBranchVisible = tree?.items[
      treeUtils.ROOT_ID
    ]?.children?.includes(`/${orphansTreeBranchName}`);
    if (isToggleOrphansLoading && isOrphansBranchVisible) {
      updateIsToggleOrphansLoading(false);
    }
  }, [isToggleOrphansLoading, tree]);

  useEffect(() => {
    const initOrphans = async (): Promise<void> => {
      try {
        const searchResult = await api.searchOrphanIssues(
          selectedJqlString,
          issueFields,
          0,
          orphansMaxResults
        );

        setTree((tree) => {
          const isOrphanBranchHidden = !tree.items[
            treeUtils.ROOT_ID
          ]?.children?.includes(`/${orphansTreeBranchName}`);

          if (isOrphanBranchHidden) {
            const newTree = treeUtils.initOrphanBranch(
              searchResult.data,
              searchResult.total,
              tree,
              handleError
            );
            return newTree;
          } else {
            return tree;
          }
        });
      } catch (e) {
        handleError(e);
        console.log(e);
      }
    };
    const orphansTreeBranchId = `/
    ${orphansTreeBranchName}`;
    if (
      tree !== undefined &&
      tree.items[orphansTreeBranchId] === undefined &&
      isOrphansBranchPresent
    ) {
      updateIsToggleOrphansLoading(true);
      void initOrphans().then(() => {
        updateIsToggleOrphansLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOrphansBranchPresent, selectedJqlString]);
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
      selectedJqlString={selectedJqlString}
    />
  );
};