import React, { useContext } from "react";
import { TooltipContainer } from "../TooltipContainer";
import styled, { css } from "styled-components";
import { APIContext } from "../../../context/api";
import { token } from "@atlaskit/tokens";
import { colors } from "@atlaskit/theme";

const StyledIssueKey = styled.a<any>`
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: 600;
  color: ${token("color.text.brand", colors.B400)};
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
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

export const IssueKey = ({ issueKey, isResolved }: Props): JSX.Element => {
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
