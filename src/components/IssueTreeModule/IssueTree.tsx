import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import TreeUtils from "../../util/TreeUtils";
import { IssueItem } from "./IssueItem";
import { ID, IssueField, IssueTreeFilter } from "../../types/api";
import { AtlasTree } from "../../types/app";
import { useTranslation } from "react-i18next";
import Tree, { mutateTree } from "@atlaskit/tree";
import { APIContext } from "../../context/api";
import { linkTypeTreeNodeName } from "../../constants/common";
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
  const api = useContext(APIContext);
  const loadingText = t("lxp.common.loading");
  const fieldMap = {};
  issueFields.forEach((field) => {
    fieldMap[field.id] = field;
  });
  // const [renderItem, setRenderItem] = useState();
  useEffect(() => {
    console.log("filter changed");
    if (isMultiNodeTree) {
      setTree((tree) => {
        const newTree = treeUtils.applyMultiNodeTreeFilterNew(
          tree,
          filter,
          issueFields
        );
        return newTree;
      });
    } else {
      setTree((prevTree) => {
        if (prevTree !== undefined) {
          const rootNode = prevTree.items[treeUtils.ROOT_ID];
          const rootIssueNodeId = rootNode.children[0];
          if (rootIssueNodeId !== undefined && rootIssueNodeId !== "") {
            const newTree = treeUtils.applyFilterHook(
              tree,
              filter,
              issueFields,
              rootIssueNodeId
            );
            return newTree;
          }
        }
        return prevTree;
      });
    }
  }, [filter, isMultiNodeTree]);

  useEffect(() => {
    console.log("use eff selectedIssueFieldIds", selectedIssueFieldIds);

    setTree((tree) => {
      if (tree?.items !== undefined && selectedIssueFieldIds !== undefined) {
        return treeUtils.cloneTree(tree);
      }
    });
  }, [selectedIssueFieldIds]);

  // useEffect(() => {
  // console.log("called use eff ");

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

  const onExpand = async ({
    itemId,
    itemType,
  }: {
    itemId: string;
    itemType: string;
  }): Promise<void> => {
    console.log("type", itemType);
    if (itemType === linkTypeTreeNodeName) {
      console.log("this is a link");
      setTree((prevTree) => treeUtils.expandSingleNode(itemId, prevTree));
    } else {
      console.log(itemId);
      const lastSlashIndex = itemId.lastIndexOf("/");
      const issueId = itemId.substring(lastSlashIndex + 1);
      console.log(issueId);
      await treeUtils.expandTree(
        itemId,
        issueId,
        filter,
        treeUtils.findJiraFields(fieldMap, selectedIssueFieldIds),
        setTree,
        handleError,
        clearAllErrors
      );
    }
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
  console.log("tree from main file", tree);
  if (tree?.items !== undefined) {
    return (
      <Container>
        <Tree
          tree={tree}
          // key={selectedIssueFieldIds} // needs change. called unnecessarily.
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
