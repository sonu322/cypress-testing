/* eslint-disable indent */
import React, { useMemo } from "react";
import { colors } from "@atlaskit/theme";
import styled, { css } from "styled-components";
import Badge from "@atlaskit/badge";
import Avatar from "@atlaskit/avatar";
import URLSearchParams from "@ungap/url-search-params";
import { Icon } from "./Icon";
import { TooltipContainer } from "./TooltipContainer";

const searcher = new URLSearchParams(location.search);
const xdm = searcher.get("xdm_e");

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
  const storyPointsInfo = useMemo(() => {
    let field = issueFields.find((field) => field.customKey == "storypoints");
    if (!field) {
      field = issueFields.find(
        (field) => field.customKey == "storypointestimate"
      );
    }
    field.isSelected = selectedIssueFields.includes(field.key);
    return field;
  }, [issueFields, selectedIssueFields]);

  console.log(storyPointsInfo);
  const priorityInfo = useMemo(() => {
    const field = issueFields.find((field) => field.customKey == "priority");
    field.isSelected = selectedIssueFields.includes(field.key);
    return field;
  }, [issueFields, selectedIssueFields]);

  const issueTypeInfo = useMemo(() => {
    const field = issueFields.find((field) => field.customKey == "issuetype");
    field.isSelected = selectedIssueFields.includes(field.key);
    return field;
  }, [issueFields, selectedIssueFields]);
  const assigneeInfo = useMemo(() => {
    const field = issueFields.find((field) => field.customKey == "assignee");
    field.isSelected = selectedIssueFields.includes(field.key);
    return field;
  }, [issueFields, selectedIssueFields]);

  console.log("from card");
  console.log(issueData);

  if (issueData && issueData.fields) {
    const issueUrl = `${xdm}/browse/${issueData.key}`;
    return (
      <Container>
        {/* header */}
        <TooltipContainer content={issueData.fields.summary} position="bottom">
          <SummaryContainer>{issueData.fields.summary}</SummaryContainer>
        </TooltipContainer>

        {/* footer */}
        <CardFooter>
          <FooterSideContainer>
            {issueTypeInfo.isSelected && (
              <TooltipContainer
                position="bottom-end"
                content={issueData.fields.issuetype.name}
              >
                <Icon
                  height={16}
                  width={16}
                  src={issueData.fields.issuetype.iconUrl}
                />
              </TooltipContainer>
            )}
            {priorityInfo.isSelected && issueData.fields.priority && (
              <TooltipContainer
                position="bottom-end"
                content={issueData.fields.priority.name}
              >
                <Icon
                  height={16}
                  width={16}
                  src={issueData.fields.priority.iconUrl}
                />
              </TooltipContainer>
            )}
            {storyPointsInfo.isSelected &&
              issueData.fields[storyPointsInfo.key] && (
                <TooltipContainer
                  position="bottom-end"
                  content={
                    issueData.fields[storyPointsInfo.key] +
                    " " +
                    storyPointsInfo.name
                  }
                >
                  <Badge>{issueData.fields[storyPointsInfo.key]}</Badge>
                </TooltipContainer>
              )}
            {/* {storyPointEstimateInfo.isSelected &&
              issueData.fields[storyPointEstimateInfo.key] && (
                <TooltipContainer
                  position="bottom-end"
                  content={
                    issueData.fields[storyPointEstimateInfo.key] +
                    " " +
                    storyPointEstimateInfo.name
                  }
                >
                  <Badge>{issueData.fields[storyPointEstimateInfo.key]}</Badge>
                </TooltipContainer>
              )} */}
          </FooterSideContainer>
          <FooterSideContainer>
            <TooltipContainer position="bottom-end" content={issueData.key}>
              <IssueKey
                target="_blank"
                href={issueUrl}
                isResolved={issueData.fields.resolution ? true : false}
              >
                {issueData.key}
              </IssueKey>
            </TooltipContainer>
            {assigneeInfo.isSelected && (
              <TooltipContainer
                position="bottom-end"
                content={
                  issueData.fields[assigneeInfo.key]
                    ? "Assignee: " +
                      issueData.fields[assigneeInfo.key].displayName
                    : "Unassigned"
                }
              >
                <Avatar
                  src={
                    issueData.fields[assigneeInfo.key] &&
                    issueData.fields[assigneeInfo.key].avatarUrls["16x16"]
                  }
                ></Avatar>
              </TooltipContainer>
            )}
          </FooterSideContainer>
        </CardFooter>
      </Container>
    );
  } else {
    return <Container>some error occured</Container>;
  }
};
