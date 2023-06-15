import React, { useContext } from "react";
import styled, { css } from "styled-components";
import { IssueCard } from "../common/issueCard/IssueCard";
import { ExpansionToggler } from "./ExpansionToggler";
import { LoadingButton } from "@atlaskit/button";
import { APIContext } from "../../context/api";
import TreeUtils from "../../util/TreeUtils";
import { Issue, IssueField, IssueWithLinkedIssues } from "../../types/api";
import {
  AtlasTree,
  AtlasTreeNode,
  ButtonTypeTreeNode,
  LinkTypeTreeNode,
  TreeNodeType,
} from "../../types/app";
import { token } from "@atlaskit/tokens";
const PADDING_LEVEL = 30;
const LinkTypeContainer = styled.div`
  display: flex;
  height: 32px;
  line-height: 32px;
  border: none;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: ${token("elevation.surface.raised")};
  fill: ${token("elevation.surface.raised")};
  padding-left: 6px;
  padding-right: 6px;
  font-weight: 500;
  text-transform: capitalize;
`;
const getItemMargin = (depth) => {
  return PADDING_LEVEL * depth + "px";
};
const Container = styled.div<any>`
  margin: 0.5rem 0;
  display: flex;
  margin-left: 0px;
  ${({ marginLeft }) =>
    marginLeft &&
    css`
      margin-left: ${marginLeft};
    `}
`;

interface Props {
  selectedJqlString: string;
  issueFields: IssueField[];
  setTree: React.Dispatch<React.SetStateAction<AtlasTree>>;
  handleError: (err: unknown) => void;
  item: AtlasTreeNode;
  onExpand: ({
    nodeId,
    nodeType,
  }: {
    nodeId: string;
    nodeType: TreeNodeType;
  }) => void;
  onCollapse: (itemId: string) => void;
  provided;
  depth;
  selectedIssueFieldIds: string[];
}

export const IssueItem = ({
  selectedJqlString,
  issueFields,
  setTree,
  handleError,
  item,
  onExpand,
  onCollapse,
  provided,
  depth,
  selectedIssueFieldIds,
}: Props): JSX.Element => {
  const marginLeft = getItemMargin(depth);
  const api = useContext(APIContext);
  const treeUtils = new TreeUtils(api);
  return (
    <Container
      marginLeft={marginLeft}
      innerRef={provided.innerRef}
      {...provided.dragHandleProps}
    >
      {item.nodeType === TreeNodeType.ButtonNode ? (
        <LoadingButton
          isDisabled={
            (item.data as ButtonTypeTreeNode).totalSearchResults <=
            (item.data as ButtonTypeTreeNode).startNextCallIndex
          }
          isLoading={(item.data as ButtonTypeTreeNode).isDataLoading}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={() =>
            treeUtils.handleLoadMoreOrphanIssues(
              selectedJqlString,
              issueFields,
              (item.data as ButtonTypeTreeNode).startNextCallIndex,
              setTree,
              handleError
            )
          }
        >
          {(item.data as ButtonTypeTreeNode).title}
        </LoadingButton>
      ) : (
        <>
          <ExpansionToggler
            isExpanded={item.isExpanded}
            isLoading={item.isChildrenLoading}
            onExpand={() =>
              onExpand({
                nodeId: item.id,
                nodeType: item.nodeType,
              })
            }
            onCollapse={() => onCollapse(item.id)}
            hasChildren={item.hasChildren}
            isTogglerDisabled={item.isTogglerDisabled}
          ></ExpansionToggler>
          {item.nodeType === TreeNodeType.LinkNode ? (
            <LinkTypeContainer>
              {(item.data as LinkTypeTreeNode)?.title ?? ""}
            </LinkTypeContainer>
          ) : (
            <IssueCard
              issueData={(item.data as IssueWithLinkedIssues | Issue) ?? null}
              selectedIssueFieldIds={selectedIssueFieldIds}
            />
          )}
        </>
      )}
    </Container>
  );
};
