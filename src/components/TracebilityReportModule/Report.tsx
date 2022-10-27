import React from "react";
import styled from "styled-components";
import { IssueCard } from "../IssueCard";
import { colors } from "@atlaskit/theme";

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
const BorderTr = styled.tr`
  border-bottom: 1px solid ${colors.N40};
`;

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
    const fields = issue.fields;
    const classified = {
      issue,
      parent: fields.parent,
      subtasks: fields.subtasks.filter((issue) =>
        tableFieldIds.get("issueTypes").includes(issue.fields.issuetype.id)
      ),
    };
    if (fields.issuelinks) {
      fields.issuelinks.forEach((link) => {
        if (tableFieldIds.get("linkTypes").includes(link.id)) {
          upsurt(classified, link, links);
        }
      });
    }
    classifieds.push(classified);
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
          <th>Sub-tasks</th>
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
            <td>
              {classified.subtasks && classified.subtasks.length > 0 ? (
                classified.subtasks.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issueData={issue}
                    selectedIssueFieldIds={issueFieldIds}
                    issueCardOptionsMap={issueCardOptionsMap}
                  ></IssueCard>
                ))
              ) : (
                <span>--</span>
              )}
            </td>
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
