/* eslint-disable indent */
import React, { useMemo } from "react";
import { colors } from "@atlaskit/theme";
import styled, { css } from "styled-components";
import Badge from "@atlaskit/badge";
import Avatar from "@atlaskit/avatar";
import { Icon } from "./Icon";
import { TooltipContainer } from "./TooltipContainer";
import { getQueryParam } from "../util";
import { IssueTypeInfo } from "./IssueTypeInfo";
import { PriorityInfo } from "./PriorityInfo";
import { StoryPointsInfo } from "./StoryPointsInfo";
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
  issueCardOptionsMap,
}) => {
  let cardOptionsDataMap = useMemo(() => {
    let copy = new Map(issueCardOptionsMap);
    for (const field of copy.values()) {
      field.isSelected = selectedIssueFieldIds.includes(field.key);
      field.value = issueData.fields[field.key];
    }
    console.log("copy");
    console.log(copy);
    return copy;
  }, [issueCardOptionsMap, issueData, selectedIssueFieldIds]);
  // ----
  // const fieldCustomKeys = ["issuetype", "priority", "status", "assignee"];

  // fieldCustomKeys.push(storyPointsFieldName);
  // // variables

  // fieldCustomKeys.forEach((customKey) => {
  //   const field = issueFields.get(customKey);
  //   console.log(field);
  //   field.isSelected = selectedIssueFieldIds.includes(field.key);
  //   field.value = issueData.fields[field.key];
  //   return field;
  // });
  const storyPointsInfo = useMemo(() => {
    return (
      cardOptionsDataMap.get("storypoints") ??
      cardOptionsDataMap.get("storypointestimate")
    );
  }, [cardOptionsDataMap]);
  const priorityInfo = useMemo(() => {
    return cardOptionsDataMap.get("priority");
  }, [cardOptionsDataMap]);
  console.log("priorityinfo");
  console.log(priorityInfo);
  const issueTypeInfo = useMemo(() => {
    return cardOptionsDataMap.get("issuetype");
  }, [cardOptionsDataMap]);
  const assigneeInfo = useMemo(() => {
    return cardOptionsDataMap.get("assignee");
  }, [cardOptionsDataMap]);

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
          <SummaryContainer
            
          >{issueData.fields.summary}</SummaryContainer>
        </TooltipContainer>

        {/* footer */}
        <CardFooter>
          <FooterSideContainer>
            {issueTypeInfo.isSelected && (
              <IssueTypeInfo content={issueTypeInfo} />
            )}
            {priorityInfo.isSelected && <PriorityInfo content={priorityInfo} />}
            {storyPointsInfo.isSelected && (
              <StoryPointsInfo content={storyPointsInfo}></StoryPointsInfo>
            )}
          </FooterSideContainer>
          <FooterSideContainer>
            <TooltipContainer position="bottom-end" content={issueData.key}>
              <IssueKey
                target="_blank"
                href={issueUrl}
                isResolved={issueData.fields.resolution}
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
