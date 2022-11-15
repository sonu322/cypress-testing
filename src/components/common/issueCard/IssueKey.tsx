import React, { useContext } from "react";
import { TooltipContainer } from "../TooltipContainer";
import styled, { css } from "styled-components";
import { colors } from "@atlaskit/theme";
import { APIContext } from "../../../context/api";

const StyledIssueKey = styled.a<any>`
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.B400};
  text-decoration: none;
  cursor: pointer;
  ${(props: any) =>
    props.isResolved &&
    css`
      text-decoration: line-through;
    `};
`;

export interface Props {
  issueKey: string;
  isResolved: boolean;
}

export const IssueKey = ({ issueKey, isResolved }: Props) => {
  const api = useContext(APIContext);
  const issueUrl = `${api.getJiraBaseURL()}/browse/${issueKey}`;
  return (
    <TooltipContainer content={issueKey}>
      <StyledIssueKey target="_blank" href={issueUrl} isResolved={isResolved}>
        {issueKey}
      </StyledIssueKey>
    </TooltipContainer>
  );
};
