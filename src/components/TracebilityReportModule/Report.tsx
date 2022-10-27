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



export const Report = ({
  issues,
  tableFieldIds,
  issueFieldIds,
  issueCardOptionsMap,
}) => {
  const upsurt = (holder, link, links) => {
    const issue = link.inwardIssue ?? link.outwardIssue;
    if (tableFieldIds.get("issueTypes").includes(issue.fields.issuetype.id)) {
      let name = link.inwardIssue ? link.type.inward : link.type.outward;
      name = toTitleCase(name);
      if (!links.includes(name)) {
        links.push(name);
      }
      if (!holder[name]) holder[name] = [];
      holder[name].push(issue);
    }
  };
  // const issue = issues[0];
  console.log("table field ids!!");
  console.log(tableFieldIds);
  const links = [];
  const classifieds = [];
  issues.forEach((issue) => {
    if (tableFieldIds.get("issueTypes").includes(issue.type.id)) {
      const fields = issue.fields;
      const classified = {
        issue,
        parent: fields.parent,
        subtasks: fields.subtasks,
      };
      if (fields.issuelinks) {
        fields.issuelinks.forEach((link) => {
          if (tableFieldIds.get("linkTypes").includes(link.id)) {
            upsurt(classified, link, links);
          }
        });
      }
      classifieds.push(classified);
    }
  });
  links.sort();
  console.log("LInks!!!!");
  console.log(links);
  console.log(classifieds);
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
          {/* <th>Sub-tasks</th> */}
          {links.map((link, i) => (
            <th key={i}>{link}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {classifieds.map((classified, i) => (
          <BorderTr key={i}>
            <td>
              {" "}
              <IssueCard
                issueData={classified.issue}
                selectedIssueFieldIds={issueFieldIds}
                issueCardOptionsMap={issueCardOptionsMap}
              ></IssueCard>
            </td>
            <td>
              {" "}
              {classified.parent ? (
                <IssueCard
                  issueData={classified.parent}
                  selectedIssueFieldIds={issueFieldIds}
                  issueCardOptionsMap={issueCardOptionsMap}
                ></IssueCard>
              ) : (
                <span>--</span>
              )}
            </td>
            {/* <td>{this.renderIssues(classified.subtasks)}</td> */}
            {links.map((link, j) => (
              <td key={`${i}..${j}`}>
                {classified[link] ? (
                  classified[link].map((issue) => {
                    if (issue) {
                      return (
                        <IssueCard
                          key={issue.id}
                          issueData={issue}
                          selectedIssueFieldIds={issueFieldIds}
                          issueCardOptionsMap={issueCardOptionsMap}
                        ></IssueCard>
                      );
                    }
                    return <span>--</span>;
                  })
                ) : (
                  <span>--</span>
                )}
              </td>
            ))}
          </BorderTr>
        ))}
      </tbody>
    </table>
  );
};
