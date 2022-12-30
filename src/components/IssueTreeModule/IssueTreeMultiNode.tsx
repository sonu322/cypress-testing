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
  treeHasOnlyOrphans: boolean;
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
  treeHasOnlyOrphans,
}: Props): JSX.Element => {
  const fieldMap = {};
  issueFields.forEach((field) => {
    fieldMap[field.id] = field;
  });

  useEffect(() => {
    // if (tree.items["0"].children.length === 0) {
    const initTree = async (): Promise<void> => {
      const newTree = await treeUtils.initMultiNodeTree(
        filter,
        issueFields,
        handleError,
        filteredIssues
      );
      setTree(newTree);
    };
    void initTree();
    // } else {
    //   let childrenIssueIds;
    //   const orphanIssues = filteredIssues.filter((issue) => {
    //     console.log(issue);
    //     const foundPopulatedList = Object.values(issue.sortedLinks).find(
    //       (sortedLinks) => sortedLinks.length > 0
    //     );
    //     if (foundPopulatedList === undefined) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   });
    //   if (treeHasOnlyOrphans) {
    //     const onlyOrphanIds = orphanIssues.map(
    //       (orphanIssue) => `/${orphanIssue.id}`
    //     );
    //     // const onlyOrphansTree = mutateTree(tree, "0", { children: ids });
    //     // setTree(onlyOrphansTree);
    //     childrenIssueIds = onlyOrphanIds;
    //   } else {
    //     const allIds = filteredIssues.map((issue) => `/${issue.id}`);
    //     childrenIssueIds = allIds;
    //   }
    //   // change condition later
    //   if (tree.items["0"].children.length !== childrenIssueIds.length) {
    //     setTree((tree) => {
    //       const newTree = mutateTree(tree, "0", { children: childrenIssueIds });
    //       return newTree;
    //     });
    //   }
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      treeHasOnlyOrphans={treeHasOnlyOrphans}
    />
  );
};
