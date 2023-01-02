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
    console.log("called use effect");
    const initTree = async (): Promise<void> => {
      let newTree = treeUtils.initMultiNodeTree(
        filter,
        issueFields,
        handleError,
        filteredIssues
      );
      if (isOrphansBranchPresent) {
        const searchResult = await api.searchOrphanIssues(
          selectedJqlString,
          issueFields,
          0,
          20
        );
        newTree = treeUtils.initOrphanBranch(
          searchResult.data,
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
      console.log(tree.items[orphansTreeBranchId]);
      if (tree.items[orphansTreeBranchId] === undefined) {
        // setTree((prevTree) => {
        //   console.log("PREVIOUS TREE", prevTree);
        //   const newTree = treeUtils.initOrphanBranch(
        //     prevTree,
        //     selectedJqlString,
        //     issueFields,
        //     handleError,
        //     filteredIssues
        //   );
        //   console.log("ne")
        //   return newTree;
        // });
      } else {
        setTree((tree) => {
          const newTree = treeUtils.addOrphansBranch(tree);
          console.log("NEW TREEEEEEE!!!!", newTree);
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

  useEffect(() => {
    const orphansTreeBranchId = `/${orphansTreeBranchName}`;
    console.log("called use effect is oprhans ");
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
    // TODO: fix duplicate keys error . make sure this is not called the first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOrphansBranchPresent, filteredIssues, tree]);
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
