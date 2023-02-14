import React, { useEffect } from "react";
import styled from "styled-components";
import TreeUtils from "../../util/TreeUtils";
import { IssueItem } from "./IssueItem";
import { ID, IssueField, IssueTreeFilter } from "../../types/api";
import { AtlasTree, TreeNodeType } from "../../types/app";
import { useTranslation } from "react-i18next";
import Tree from "@atlaskit/tree";
const Container = styled.div`
  display: flex;
`;

export interface Props {
  tree: AtlasTree;
  treeUtils: TreeUtils;
  setTree: (tree: AtlasTree | ((tree: AtlasTree) => AtlasTree)) => void;
  filter: IssueTreeFilter;
  issueFields: IssueField[];
  selectedIssueFieldIds: ID[];
  handleError: any;
  clearAllErrors: () => void;
  isMultiNodeTree?: boolean;
  selectedJqlString?: string;
}

export const IssueTree = ({
  tree,
  treeUtils,
  setTree,
  filter,
  issueFields,
  selectedIssueFieldIds,
  handleError,
  clearAllErrors,
  isMultiNodeTree,
  selectedJqlString,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const loadingText = t("otpl.lxp.common.loading");
  const fieldMap = {};
  issueFields.forEach((field) => {
    fieldMap[field.id] = field;
  });
  useEffect(() => {
    if (isMultiNodeTree) {
      setTree((tree) => {
        const newTree = treeUtils.applyMultiNodeTreeFilter(
          tree,
          filter,
          issueFields,
          handleError
        );
        return newTree;
      });
    } else {
      setTree((prevTree) => {
        if (prevTree !== undefined) {
          const rootNode = prevTree.items[treeUtils.ROOT_ID];
          const rootIssueNodeId = rootNode.children[0];
          if (rootIssueNodeId !== undefined && rootIssueNodeId !== "") {
            const newTree = treeUtils.applySingleNodeTreeFilter(
              tree,
              filter,
              issueFields,
              rootIssueNodeId,
              handleError
            );
            return newTree;
          }
        }
        return prevTree;
      });
    }
  }, [filter, isMultiNodeTree]);

  useEffect(() => {
    setTree((tree) => {
      if (
        tree?.items !== undefined &&
        selectedIssueFieldIds !== undefined &&
        selectedIssueFieldIds !== null
      ) {
        return treeUtils.cloneTree(tree);
      }
    });
  }, [selectedIssueFieldIds]);

  const onExpand = async ({
    nodeId,
    nodeType,
  }: {
    nodeId: string;
    nodeType: TreeNodeType;
  }): Promise<void> => {
    if (nodeType === TreeNodeType.LinkNode) {
      setTree((prevTree) => treeUtils.expandLinkNode(nodeId, prevTree));
    } else {
      const node = tree.items[nodeId];
      // we dont need immediately previous tree in this case,
      // since we are using it to check only if children are loaded or not.
      if (node !== undefined) {
        await treeUtils.expandIssueNode(
          nodeId,
          node.hasChildrenLoaded,
          filter,
          treeUtils.findJiraFields(fieldMap, selectedIssueFieldIds),
          setTree,
          handleError,
          clearAllErrors
        );
      }
    }
  };

  const onCollapse = (itemId: string): void => {
    treeUtils.collapseNode(itemId, setTree);
  };
 console.log("this is new");
 if (tree?.items !== undefined) {
   return (
     <Container>
       <Tree
         tree={tree}
         renderItem={({ ...props }) => {
           return (
             // @ts-expect-error
             <IssueItem
               {...props}
               selectedIssueFieldIds={selectedIssueFieldIds}
               selectedJqlString={selectedJqlString}
               issueFields={issueFields}
               setTree={setTree}
               handleError={handleError}
             />
           );
         }}
         onExpand={onExpand}
         onCollapse={onCollapse}
         isDragEnabled={false}
       />
     </Container>
   );
 } else {
   return <em>{loadingText}</em>;
 }
};
