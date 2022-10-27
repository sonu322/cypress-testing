import React from "react";
import styled from "styled-components";
import { IssueCard } from "../IssueCard";
import { colors } from "@atlaskit/theme";

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
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

const upsurt = (holder, link, links) => {
  const name = link.inwardIssue ? link.type.inward : link.type.outward;
  if (!links.includes(name)) {
    links.push(name);
  }
  if (!holder[name]) holder[name] = [];
  holder[name].push(link.outwardIssue ? link.outwardIssue : link.inwardIssue);
};

export const Report = ({
  issues,
  tableFieldIds,
  issueFieldIds,
  issueCardOptionsMap,
}) => {
  // const issue = issues[0];
  const links = [];
  const classifieds = [];
  issues.forEach((issue) => {
    const fields = issue.fields;
    const classified = {
      issue,
      parent: fields.parent,
      subtasks: fields.subtasks,
    };
    if (fields.issuelinks) {
      fields.issuelinks.forEach((link) => {
        upsurt(classified, link, links);
      });
    }
    classifieds.push(classified);
  });
  links.sort();
  console.log("LInks!!!!");
  console.log(links);
  return (
    // <IssueCard
    //   issueData={issue}
    //   selectedIssueFieldIds={issueFieldIds}
    //   issueCardOptionsMap={issueCardOptionsMap}
    // ></IssueCard>
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Parent</th>
          <th>Sub-tasks</th>
          {links.map((link, i) => (
            <th key={i}>{link}</th>
          ))}
        </tr>
      </thead>
    </table>
  );
};
 