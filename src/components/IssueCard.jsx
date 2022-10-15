/* eslint-disable indent */
import React, { useMemo } from "react";
import { colors } from "@atlaskit/theme";
import styled, { css } from "styled-components";
import Badge from "@atlaskit/badge";
import Avatar from "@atlaskit/avatar";
import { Icon } from "./Icon";
import { TooltipContainer } from "./TooltipContainer";
import { getQueryParam } from "../util";
// varibles
const xdm = getQueryParam("xdm_e");

// styled components
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

// main function
export const IssueCard = ({
  issueData,
  selectedIssueFieldIds,
  issueFields,
}) => {
  // variables
  const storyPointsInfo = useMemo(() => {
    // let field = issueFields.find((field) => field.customKey == "storypoints");
    let field = issueFields.get("storypoints");
    console.log(field);
    if (!field) {
      field = issueFields.find(
        (field) => field.customKey == "storypointestimate"
      );
    }
    field.isSelected = selectedIssueFieldIds.includes(field.key);
    field.value = issueData.fields[field.key];
    return field;
  }, [issueFields, selectedIssueFieldIds, issueData]);
  const priorityInfo = useMemo(() => {
    const field = issueFields.get("priority");
    console.log(field);
    field.isSelected = selectedIssueFieldIds.includes(field.key);
    field.value = issueData.fields[field.key];
    return field;
  }, [issueFields, selectedIssueFieldIds, issueData]);
  console.log("priorityinfo");
  console.log(priorityInfo);
  const issueTypeInfo = useMemo(() => {
    const field = issueFields.get("issuetype");
    field.isSelected = selectedIssueFieldIds.includes(field.key);
    field.value = issueData.fields[field.key];
    return field;
  }, [issueFields, selectedIssueFieldIds, issueData]);
  const assigneeInfo = useMemo(() => {
    const field = issueFields.get("assignee");
    field.isSelected = selectedIssueFieldIds.includes(field.key);
    field.value = issueData.fields[field.key];
    return field;
  }, [issueFields, selectedIssueFieldIds, issueData]);

  if (issueData && issueData.fields && xdm) {
    const issueUrl = `${xdm}/browse/${issueData.key}`;
    console.log("storypointsinfo");
    console.log(issueData.fields);
    console.log(issueData.fields[storyPointsInfo.key]);
    // component to render
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
                content={issueTypeInfo.value.name}
              >
                <Icon src={issueTypeInfo.value.iconUrl} />
              </TooltipContainer>
            )}
            {priorityInfo.isSelected && priorityInfo.value && (
              <TooltipContainer
                position="bottom-end"
                content={priorityInfo.value.name}
              >
                <Icon src={priorityInfo.value.iconUrl} />
              </TooltipContainer>
            )}
            {storyPointsInfo.isSelected && storyPointsInfo.value && (
              <TooltipContainer
                position="bottom-end"
                content={storyPointsInfo.value + " " + storyPointsInfo.name}
              >
                <Badge>{storyPointsInfo.value}</Badge>
              </TooltipContainer>
            )}
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
                  assigneeInfo.value
                    ? "Assignee: " + assigneeInfo.value.displayName
                    : "Unassigned"
                }
              >
                <Avatar
                  src={
                    assigneeInfo.value && assigneeInfo.value.avatarUrls["16x16"]
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
