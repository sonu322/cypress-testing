import React from "react";
import { TooltipContainer } from "./TooltipContainer";
import styled, { css } from "styled-components";
import { colors } from "@atlaskit/theme";
import { getQueryParam } from "../util";
const StyledIssueKey = styled.a`
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.N400};
  text-decoration: none;
  cursor: pointer;
  ${(props) =>
    props.isResolved &&
    css`
      text-decoration: line-through;
    `};
`;
const xdm = getQueryParam("xdm_e");

export const IssueKey = ({ issueKey, isResolved }) => {
  const issueUrl = `${xdm}/browse/${issueKey}`;
  return (
    <TooltipContainer position="bottom-end" content={issueKey}>
      <StyledIssueKey target="_blank" href={issueUrl} isResolved={isResolved}>
        {issueKey}
      </StyledIssueKey>
    </TooltipContainer>
  );
};
