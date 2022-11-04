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
import { Issue, IssueWithPopulatedLinks } from "../../../types/api";

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

export interface Props {
  issueData: Issue;
  selectedIssueFieldIds: string[];
}

// main function
export const IssueCard = ({
  issueData,
  selectedIssueFieldIds,
}: Props): JSX.Element => {
  const selectedMap: { [key: string]: boolean } = {};

  for (const issueFieldId of selectedIssueFieldIds) {
    selectedMap[issueFieldId] = true;
  }
  const storyPointsInfo = issueData.storyPoints;
  const priorityInfo = issueData.priority;
  const issueTypeInfo = issueData.type;
  const assigneeInfo = issueData.assignee;
  console.log("issueFields!!!!!!!!!");
  console.log(selectedIssueFieldIds);
  console.log(issueData);
  // component to render
  return (
    <Container>
      {/* header */}

      {selectedMap.summary && <IssueSummary content={issueData.summary} />}
      {/* footer */}
      <CardFooter>
        <FooterSideContainer>
          {selectedMap.issueType && issueTypeInfo && (
            <IssueTypeInfo content={issueTypeInfo} />
          )}
          {selectedMap.priority && priorityInfo && (
            <PriorityInfo content={priorityInfo} />
          )}
          {selectedMap.storyPoints && storyPointsInfo && (
            <StoryPointsInfo content={storyPointsInfo} />
          )}
        </FooterSideContainer>
        <FooterSideContainer>
          <IssueKey
            isResolved={selectedMap.status && issueData.isResolved}
            issueKey={issueData.issueKey}
          />
          {selectedMap.assignee && <AssigneeInfo content={assigneeInfo} />}
        </FooterSideContainer>
      </CardFooter>
    </Container>
  );
};
