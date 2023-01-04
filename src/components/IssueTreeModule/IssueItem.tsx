import React from "react";
import styled, { css } from "styled-components";
import { colors } from "@atlaskit/theme";
import { IssueCard } from "../common/issueCard/IssueCard";
import { ExpansionToggler } from "./ExpansionToggler";
import Button from "@atlaskit/button";
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
  item,
  onExpand,
  onCollapse,
  provided,
  depth,
  selectedIssueFieldIds,
}) => {
  const marginLeft = getItemMargin(depth);

  return (
    <Container
      marginLeft={marginLeft}
      innerRef={provided.innerRef}
      {...provided.dragHandleProps}
    >
      <ExpansionToggler
        isExpanded={item.isExpanded}
        isLoading={item.isChildrenLoading}
        onExpand={() => onExpand(item.id)}
        onCollapse={() => onCollapse(item.id)}
        isTogglerDisabled={!item.hasChildren}
      ></ExpansionToggler>
      {item.data?.isType ? (
        <>
          <LinkTypeContainer>
            {item.data ? item.data.title : "No Name"}
          </LinkTypeContainer>
        </>
      ) : item.data?.isButton ? (
        <Button onClick={item.data.handleLoadMoreIssues}>
          load more issues
        </Button>
      ) : (
        <IssueCard
          issueData={item.data ?? null}
          selectedIssueFieldIds={selectedIssueFieldIds}
        />
      )}
    </Container>
  );
};
