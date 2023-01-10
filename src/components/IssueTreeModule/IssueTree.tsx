import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TreeUtils from "../../util/TreeUtils";
import { IssueItem } from "./IssueItem";
import { ID, IssueField, IssueTreeFilter } from "../../types/api";
import { AtlasTree } from "../../types/app";
import { useTranslation } from "react-i18next";
import Tree, { mutateTree } from "@atlaskit/tree";
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
  const loadingText = t("lxp.common.loading");
  const fieldMap = {};
  issueFields.forEach((field) => {
    fieldMap[field.id] = field;
  });
  // const [renderItem, setRenderItem] = useState();
  useEffect(() => {
    if (isMultiNodeTree) {
      setTree((tree) => {
        const newTree = treeUtils.applyMultiNodeTreeFilter(
          tree,
          filter,
          issueFields
        );
        return newTree;
      });
    } else {
      setTree((prevTree) => {
        if (prevTree !== undefined) {
          treeUtils.applyFilterHook(tree, setTree, filter, issueFields);
        } else {
          return prevTree;
        }
      });
    }
  }, [filter, isMultiNodeTree]);

  useEffect(() => {
    console.log("called use eff ");

  //   setTree((tree) => {
  //     //   if (prevTree !== undefined) {
  //     //     const newTree = treeUtils.cloneTree(prevTree);
  //     //     const newestTree = { ...newTree };
  //     //     console.log(newestTree === prevTree);
  //     //     return newestTree;
  //     //   } else {
  //     //     return prevTree;
  //     //   }
  //     // });
  //     const prevTree = { ...tree };
  //     if (prevTree !== undefined) {
  //       const root = prevTree.items[treeUtils.ROOT_ID];
  //       const firstNode = prevTree.items[root.children[0]];
  //       console.log(prevTree);

  //       if (firstNode !== undefined) {
  //         return mutateTree(prevTree, firstNode.id, {
  //           children: [...prevTree.items[firstNode.id].children],
  //           data: { ...prevTree.items[firstNode.id].data },
  //           isExpanded: true,
  //         });
  //       }
  //     } else {
  //       return prevTree;
  //     }
  //   });
  // }, [selectedIssueFieldIds, setTree, treeUtils.ROOT_ID]);

  const onExpand = (itemId) => {
    treeUtils.expandTreeHook(
      itemId,
      filter,
      treeUtils.findJiraFields(fieldMap, selectedIssueFieldIds),
      setTree,
      handleError,
      clearAllErrors
    );
  };

  const onCollapse = (itemId) => {
    treeUtils.collapseTreeHook(itemId, setTree);
  };

  // useEffect(() => {
  // const newRenderItem = ({ ...props }) => {
  //   return (
  //     // @ts-expect-error
  //     <IssueItem
  //       {...props}
  //       selectedIssueFieldIds={selectedIssueFieldIds}
  //       selectedJqlString={selectedJqlString}
  //       issueFields={issueFields}
  //       setTree={setTree}
  //       handleError={handleError}
  //     />
  //   );
  //   // }
  // };
  //   setRenderItem(newRenderItem);
  // }, [
  //   selectedIssueFieldIds,
  //   selectedJqlString,
  //   issueFields,
  //   setTree,
  //   handleError,
  // ]);
  if (tree?.items !== undefined) {
    return (
      <Container>
        <Tree
          tree={tree}
          key={selectedIssueFieldIds}
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
