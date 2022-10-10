/* eslint-disable indent */
import React from "react";
import { colors } from "@atlaskit/theme";
import styled, { css } from "styled-components";
import { SimpleTag } from "@atlaskit/tag";
import Tooltip from "@atlaskit/tooltip";
const IconContainer = styled.span`
  display: flex;
  width: 16px;
  overflow: hidden;
  height: 16px;
`;
const IssueTypeName = styled.span`
  text-overflow: ellipsis;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.N70};
`;
const Container = styled.div`
  color: ${colors.N800};
  box-shadow: rgba(23, 43, 77, 0.2) 0px 1px 1px 0px,
    rgba(23, 43, 77, 0.2) 0px 0px 1px 0px;
  border-radius: 3px;
  padding: 12px;
  font-size: 14px;
  font-weight: 400px;
  line-height: 20px;
  width: 260px;
`;
const Spacer = styled.div`
  width: ${({ width }) => {
    return css`
      ${width}
    `;
  }};
  height: ${({ height }) => {
    return css`
      ${height}
    `;
  }};
`;
const CardFooter = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 10px;
`;
const TypeAndKeyContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const SummaryContainer = styled.div``;
export const IssueCard = ({ issueData }) => {
  console.log("from card");
  console.log(issueData);
  if (issueData && issueData.fields) {
    return (
      <Container>
        {/* header */}
        <Tooltip content={issueData.fields.summary}>
          <SummaryContainer>{issueData.fields.summary}</SummaryContainer>
        </Tooltip>
        {/* footer */}
        <CardFooter>
          <TypeAndKeyContainer>
            {issueData.fields.issuetype && (
              <IconContainer>
                <img
                  height={16}
                  width={16}
                  src={issueData.fields.issuetype.iconUrl}
                  title={`${issueData.fields.issuetype.name} - ${issueData.fields.issuetype.description}`}
                />
              </IconContainer>
            )}
            <IssueTypeName>{issueData.key}</IssueTypeName>
          </TypeAndKeyContainer>
        </CardFooter>
      </Container>
    );
  } else {
    return <Container>some error occured</Container>;
  }
};
