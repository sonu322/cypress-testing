import React from "react";
import styled, { css } from "styled-components";
import { colors } from "@atlaskit/theme";

import { IssueCard } from "../IssueCard";
import { ExpansionToggler } from "../ExpansionToggler";
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
const Container = styled.div`
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
  issueCardOptionsMap,
}) => {
  const marginLeft = getItemMargin(depth);
  return (
    <Container

      marginLeft={marginLeft}
      innerRef={provided.innerRef}
      {...provided.dragHandleProps}
    >
      <ExpansionToggler
        item={item}
        isExpanded={item.isExpanded}
        isLoading={item.isChildrenLoading}
        onExpand={() => onExpand(item.id)}
        onCollapse={() => onCollapse(item.id)}
        isTogglerDisabled={!item.hasChildren}
      ></ExpansionToggler>
      {item.data && item.data.isType ? (
        <LinkTypeContainer>
          {item.data ? item.data.title : "No Name"}
        </LinkTypeContainer>
      ) : (
        <IssueCard
          issueData={item.data ?? null}
          selectedIssueFieldIds={selectedIssueFieldIds}
          issueCardOptionsMap={issueCardOptionsMap}
          isIssueExpanded={item.isExpanded}
        />
      )}
    </Container>
  );
};
