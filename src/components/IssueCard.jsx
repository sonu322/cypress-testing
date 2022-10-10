/* eslint-disable indent */
import React from "react";
import { colors } from "@atlaskit/theme";
import styled from "styled-components";
// import { SimpleTag } from "@atlaskit/tag";
import Tooltip from "@atlaskit/tooltip";
import Badge from "@atlaskit/badge";
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
  border-radius: 4px;
  padding-top: 1px;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 14px;
  font-weight: 400px;
  line-height: 20px;
  min-width: 162px;
  width: 100%;
  max-width: 500px;

  border-spacing: 10px 0px;
`;
// const Spacer = styled.div`
//   width: ${({ width }) => {
//     return css`
//       ${width}
//     `;
//   }};
//   height: ${({ height }) => {
//     return css`
//       ${height}
//     `;
//   }};
// `;
const CardFooter = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 10px;
`;
const FooterSideContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const SummaryContainer = styled.div``;
export const IssueCard = ({ issueData, selectedIssueFields }) => {
  const storyPointsField = selectedIssueFields.find(
    (field) => field.customKey == "storypoints"
  );
  const priorityField = selectedIssueFields.find(
    (field) => field.key == "priority"
  );
  console.log("from card");
  console.log(issueData);
  if (issueData && issueData.fields) {
    return (
      <Container>
        {/* header */}
        <Tooltip content={issueData.fields.summary}>
          {(props) => (
            <SummaryContainer {...props}>
              {issueData.fields.summary}
            </SummaryContainer>
          )}
        </Tooltip>
        {/* footer */}
        <CardFooter>
          <FooterSideContainer>
            {issueData.fields.issuetype && (
              <Tooltip position="bottom-end" content={issueData.fields.issuetype.name}>
                {(props) => (
                  <IconContainer {...props}>
                    <img
                      height={16}
                      width={16}
                      src={issueData.fields.issuetype.iconUrl}
                    />
                  </IconContainer>
                )}
              </Tooltip>
            )}
            {priorityField && issueData.fields.priority && (
              <Tooltip position="bottom-end" content={issueData.fields.priority.name}>
                <IconContainer>
                  <img
                    height={16}
                    width={16}
                    src={issueData.fields.priority.iconUrl}
                  />
                </IconContainer>
              </Tooltip>
            )}
            {storyPointsField && issueData.fields[storyPointsField.key] && (
              <Tooltip position="bottom-end"
                content={
                  issueData.fields[storyPointsField.key] +
                  " " +
                  storyPointsField.name
                }
              >
                {(props) => (
                  <Badge {...props}>
                    {issueData.fields[storyPointsField.key]}
                  </Badge>
                )}
              </Tooltip>
            )}
          </FooterSideContainer>
          <FooterSideContainer>
            <IssueTypeName>{issueData.key}</IssueTypeName>
          </FooterSideContainer>
        </CardFooter>
      </Container>
    );
  } else {
    return <Container>some error occured</Container>;
  }
};
