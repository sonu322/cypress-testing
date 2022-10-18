/* eslint-disable indent */
import React from "react";
import { colors } from "@atlaskit/theme";
import styled from "styled-components";
import { IssueTypeInfo } from "./IssueTypeInfo";
import { PriorityInfo } from "./PriorityInfo";
import { StoryPointsInfo } from "./StoryPointsInfo";
import { IssueKey } from "./IssueKey";
import { AssigneeInfo } from "./AssigneeInfo";
import { IssueSummary } from "./IssueSummary";

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
  // margin-top: 10px;
`;
const FooterSideContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// main function
export const IssueCard = ({
  issueData,
  selectedIssueFieldIds,
  issueCardOptionsMap,
}) => {
  console.log("called!!!!!!!!isseu card")
  console.log(issueData)
  let cardOptionsDataMap;
  let copy = new Map(issueCardOptionsMap);
  for (const field of copy.values()) {
    field.isSelected = selectedIssueFieldIds.includes(field.key);
    field.value = issueData.fields[field.key];
  }
  cardOptionsDataMap = copy;

  const storyPointsInfo =
    cardOptionsDataMap.get("storypoints") ??
    cardOptionsDataMap.get("storypointestimate");
  const priorityInfo = cardOptionsDataMap.get("priority");
  const issueTypeInfo = cardOptionsDataMap.get("issuetype");
  const assigneeInfo = cardOptionsDataMap.get("assignee");

  if (issueData && issueData.fields) {
    // component to render
    return (
      <Container>
        {/* header */}
        <IssueSummary content={issueData.fields.summary} />

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
            <IssueKey
              isResolved={issueData.fields.resolution}
              issueKey={issueData.key}
            />
            {assigneeInfo.isSelected && <AssigneeInfo content={assigneeInfo} />}
          </FooterSideContainer>
        </CardFooter>
      </Container>
    );
  } else {
    return <Container>some error occured</Container>;
  }
};
