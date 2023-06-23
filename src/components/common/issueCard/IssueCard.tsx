/* eslint-disable indent */
import React from "react";
import styled from "styled-components";
import { IssueTypeInfo } from "./IssueTypeInfo";
import { PriorityInfo } from "./PriorityInfo";
import { StoryPointsInfo } from "./StoryPointsInfo";
import { IssueKey } from "./IssueKey";
import { AssigneeInfo } from "./AssigneeInfo";
import { IssueSummary } from "./IssueSummary";
import { Issue, IssueWithLinkedIssues } from "../../../types/api";
import { StatusText } from "./StatusInfo";
import { FixVersion } from "./FixVersion";
import { token } from "@atlaskit/tokens";

const Container = styled.div`
  background-color: ${token("elevation.surface.raised")};
  color: ${token("color.text")};
  box-shadow: ${token("elevation.shadow.raised")};
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
  border: 1px solid ${token("color.border")};
  border-spacing: 10px 0px;
  box-sizing: border-box;

  & + & {
    margin-top: 8px;
  }
`;
const CardFooter = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 4px;
`;
const FooterSideContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export interface Props {
  issueData: Issue | IssueWithLinkedIssues;
  selectedIssueFieldIds: string[];
}

// main function
export const IssueCard = ({
  issueData,
  selectedIssueFieldIds,
}: Props): JSX.Element => {
  const selectedMap = {};
  for (const issueFieldId of selectedIssueFieldIds) {
    selectedMap[issueFieldId] = true;
  }
  const storyPointsInfo = issueData.storyPoints;
  const priorityInfo = issueData.priority;
  const issueTypeInfo = issueData.type;
  const assigneeInfo = issueData.assignee;
  const statusInfo = issueData.status;
  const versionInfo = issueData.fixVersions;
  // component to render
  return (
    <Container>
      {/* header */}
      {selectedMap["summary"] && issueData.summary && (
        <IssueSummary content={issueData.summary} />
      )}

      {/* footer */}
      <CardFooter>
        <FooterSideContainer>
          {selectedMap["issueType"] && issueTypeInfo && (
            <IssueTypeInfo content={issueTypeInfo} />
          )}
          {selectedMap["priority"] && priorityInfo && (
            <PriorityInfo content={priorityInfo} />
          )}
          {selectedMap["storyPoints"] && storyPointsInfo && (
            <StoryPointsInfo content={storyPointsInfo} />
          )}
        </FooterSideContainer>
        <FooterSideContainer>
          {selectedMap["fixVersions"] && versionInfo && (
            <FixVersion versionInfo={versionInfo} />
          )}
          {selectedMap["status"] && <StatusText statusInfo={statusInfo} />}
          <IssueKey
            isResolved={issueData.isResolved}
            issueKey={issueData.issueKey}
          />
          {selectedMap["assignee"] && <AssigneeInfo content={assigneeInfo} />}
        </FooterSideContainer>
      </CardFooter>
    </Container>
  );
};
