/* eslint-disable indent */
import React from "react";
import { colors } from "@atlaskit/theme";
import styled, { css } from "styled-components";
// import { SimpleTag } from "@atlaskit/tag";
import Tooltip from "@atlaskit/tooltip";
import Badge from "@atlaskit/badge";
import Avatar from "@atlaskit/avatar";
import URLSearchParams from "@ungap/url-search-params";

const searcher = new URLSearchParams(location.search);
const xdm = searcher.get("xdm_e");

// TODO: ADD ASSIGNEE AVATAR, TOOLTIP FOR KEY
const IconContainer = styled.span`
  display: flex;
  width: 16px;
  overflow: hidden;
  height: 16px;
`;
const IssueKey = styled.a`
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
export const IssueCard = ({ issueData, selectedIssueFields, issueFields }) => {
  const storyPointsField = issueFields.find(
    (field) => field.customKey == "storypoints"
  );
  console.log("from card!!!! storypoints and estimate");
  const storyPointEstimateField = issueFields.find(
    (field) => field.customKey == "storypointestimate"
  );
  console.log(storyPointsField);
  console.log(storyPointEstimateField);
  const priorityField = issueFields.find(
    (field) => field.customKey == "priority"
  );
  const issueTypeField = issueFields.find(
    (field) => field.customKey == "issuetype"
  );
  const isIssueTypeFieldSelected = selectedIssueFields.includes(
    issueTypeField.key
  );
  const isStoryPointsFieldSelected = selectedIssueFields.includes(
    storyPointsField.key
  );
  const isStoryPointEstimateFieldSelected = selectedIssueFields.includes(
    storyPointEstimateField.key
  );
  const isPriorityFieldSelected = selectedIssueFields.includes(
    priorityField.key
  );
  const assigneeField = issueFields.find(
    (field) => field.customKey == "assignee"
  );
  const isAssigneeFieldSelected = selectedIssueFields.includes(
    assigneeField.key
  );

  console.log("from card");
  console.log(
    isStoryPointsFieldSelected,
    isStoryPointEstimateFieldSelected,
    isPriorityFieldSelected,
    isAssigneeFieldSelected,
    issueData.fields[storyPointsField.key],
    issueData.fields[storyPointEstimateField.key],
    issueData.fields[priorityField.key],
    issueData.fields[assigneeField.key]
  );
  console.log(issueData);

  if (issueData && issueData.fields) {
    const issueUrl = `${xdm}/browse/${issueData.key}`;
    return (
      <Container>
        {/* header */}
        <Tooltip content={issueData.fields.summary} position="bottom-end">
          {(props) => (
            <div {...props}>
              <SummaryContainer>{issueData.fields.summary}</SummaryContainer>
            </div>
          )}
        </Tooltip>

        {/* footer */}
        <CardFooter>
          <FooterSideContainer>
            {isIssueTypeFieldSelected && (
              <Tooltip
                position="bottom-end"
                content={issueData.fields.issuetype.name}
              >
                {(props) => (
                  <div {...props}>
                    <IconContainer>
                      <img
                        height={16}
                        width={16}
                        src={issueData.fields.issuetype.iconUrl}
                      />
                    </IconContainer>
                  </div>
                )}
              </Tooltip>
            )}
            {isPriorityFieldSelected && (
              <Tooltip
                position="bottom-end"
                content={
                  issueData.fields.priority.name
                    ? issueData.fields.priority.name
                    : "no priority selected"
                }
              >
                {(props) => (
                  <div {...props}>
                    <IconContainer>
                      <img
                        height={16}
                        width={16}
                        src={issueData.fields.priority.iconUrl}
                      />
                    </IconContainer>
                  </div>
                )}
              </Tooltip>
            )}
            {isStoryPointsFieldSelected &&
              issueData.fields[storyPointsField.key] && (
                <Tooltip
                  position="bottom-end"
                  content={
                    issueData.fields[storyPointsField.key] +
                    " " +
                    storyPointsField.name
                  }
                >
                  {(props) => (
                    <div {...props}>
                      <Badge>{issueData.fields[storyPointsField.key]}</Badge>
                    </div>
                  )}
                </Tooltip>
              )}
            {isStoryPointEstimateFieldSelected &&
              issueData.fields[storyPointEstimateField.key] && (
                <Tooltip
                  position="bottom-end"
                  content={
                    issueData.fields[storyPointEstimateField.key] +
                    " " +
                    storyPointEstimateField.name
                  }
                >
                  {(props) => (
                    <div {...props}>
                      <Badge>
                        {issueData.fields[storyPointEstimateField.key]}
                      </Badge>
                    </div>
                  )}
                </Tooltip>
              )}
          </FooterSideContainer>
          <FooterSideContainer>
            <Tooltip position="bottom-end" content={issueData.key}>
              {(props) => (
                <div {...props}>
                  <IssueKey
                    target="_blank"
                    href={issueUrl}
                    isResolved={issueData.fields.resolution ? true : false}
                  >
                    {issueData.key}
                  </IssueKey>
                </div>
              )}
            </Tooltip>
            {isAssigneeFieldSelected && (
              <Tooltip
                position="bottom-end"
                content={
                  issueData.fields[assigneeField.key]
                    ? "Assignee: " +
                      issueData.fields[assigneeField.key].displayName
                    : "Unassigned"
                }
              >
                {(props) => (
                  <div {...props}>
                    <Avatar
                      src={
                        issueData.fields[assigneeField.key] &&
                        issueData.fields[assigneeField.key].avatarUrls["16x16"]
                      }
                    ></Avatar>
                  </div>
                )}
              </Tooltip>
            )}
          </FooterSideContainer>
        </CardFooter>
      </Container>
    );
  } else {
    return <Container>some error occured</Container>;
  }
};
