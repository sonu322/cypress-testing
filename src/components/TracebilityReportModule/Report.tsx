import React from "react";
import styled from "styled-components";
import { IssueCard } from "../IssueCard";
import { colors } from "@atlaskit/theme";
const Container = styled.div`
  padding: 4px;
`;

const BorderTr = styled.tr`
  border-bottom: 1px solid ${colors.N40};
`;

const TableContainer = styled.div`
  padding: 2px 5px;
  border: 1px solid ${colors.N10};
  width: 100%;
`;

const IssueContainer = styled.span`
  display: inline-flex;
  background-color: ${colors.N30}
  fill: ${colors.N30};
  padding: 4px;
  border: none;
  border-radius: 3px;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const Icon = styled.span`
  display: flex;
  width: 16px;
  overflow: hidden;
  height: 16px;
`;

const Key = styled.span`
  display: flex;
  background-color: ${colors.N10}
  fill: ${colors.N10};
  border-radius: 4px;
  padding: 0 4px;
  height: 16px;
  line-height: 1;
`;

const LinkName = styled.span`
  color: ${colors.N600}
  height: 16px;
  line-height: 1;
  font-weight: bold;
  margin-right: 5px;
  text-transform: capitalize;
`;

const ListItem = styled.div`
  margin-bottom: 3px;
`;

const ROWS_PER_PAGE = 20;

export const Report = ({
  issues,
  tableFieldIds,
  issueFieldIds,
  issueCardOptionsMap,
}) => {
  const issue = issues[0];
  return (
    <IssueCard
      issueData={issue}
      selectedIssueFieldIds={issueFieldIds}
      issueCardOptionsMap={issueCardOptionsMap}
    ></IssueCard>
  );
};
