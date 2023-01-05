import React, { useContext } from "react";
import styled, { css } from "styled-components";
import { colors } from "@atlaskit/theme";
import { IssueCard } from "../common/issueCard/IssueCard";
import { ExpansionToggler } from "./ExpansionToggler";
import Button from "@atlaskit/button";
import { APIContext } from "../../context/api";
import TreeUtils from "../../util/TreeUtils";
const PADDING_LEVEL = 30;
const LinkTypeContainer = styled.div`
  display: flex;
  height: 32px;
  line-height: 32px;
  border: none;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: ${colors.N30}
  fill: ${colors.N30};
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
}) => {
  const marginLeft = getItemMargin(depth);
  const api = useContext(APIContext);
  const treeUtils = new TreeUtils(api);
  return (
    <Container
      marginLeft={marginLeft}
      innerRef={provided.innerRef}
      {...provided.dragHandleProps}
    >
      {item.data.isButton ? (
        <Button
          onClick={() =>
            treeUtils.handleLoadMoreOrphanIssues(
              selectedJqlString,
              issueFields,
              item.data.startNextCallIndex,
              setTree,
              handleError
            )
          }
        >
          load more issues
        </Button>
      ) : (
        <>
          <ExpansionToggler
            isExpanded={item.isExpanded}
            isLoading={item.isChildrenLoading}
            onExpand={() => onExpand(item.id)}
            onCollapse={() => onCollapse(item.id)}
            isTogglerDisabled={!item.hasChildren}
          ></ExpansionToggler>
          {item.data?.isType ? (
            <LinkTypeContainer>
              {item.data ? item.data.title : "No Name"}
            </LinkTypeContainer>
          ) : (
            <IssueCard
              issueData={item.data ?? null}
              selectedIssueFieldIds={selectedIssueFieldIds}
            />
          )}
        </>
      )}
    </Container>
  );
};
