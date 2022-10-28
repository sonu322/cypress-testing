import React, { useContext, useEffect, useState } from "react";
import Page from "@atlaskit/page";
import styled from "styled-components";
import { APIContext } from "../../context/api";
import { getFieldIds, reportCsv, download } from "../../util";
import PageHeader from "@atlaskit/page-header";
import { Toolbar } from "./Toolbar";
import { IssueField } from "../../types/api";
import { Main } from "./Main";
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
const FullWidthContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const GrowContainer = styled.div`
  flex-grow: 1;
  display: flex;
`;
const fixedFieldNames = [
  "summary",
  "subtasks",
  "parent",
  "issuelinks",
  "status",
  "resolution",
];

export const TracebilityReportModule = () => {
  const [filteredIssues, setFilteredIssues] = useState<Issue[] | null>(null);
  const [selectedJQLString, setSelectedJQLString] = useState<string | null>(
    null
  );
  const api = useContext(APIContext);
  const handleNewError = (err: unknown) => {
    // TODO: add error handling
    console.log(err);
  };
  const [issueFields, setIssueFields] = useState<Map<string, IssueField>>(
    new Map()
  );
  const [selectedIssueFieldIds, setSelectedIssueFieldIds] = useState<string[]>(
    []
  );
  const [selectedTableFieldIds, setSelectedTableFieldIds] = useState(new Map());
  const [tableFields, setTableFields] = useState(new Map());
  const exportReport = () => {
    const upsurt = (holder, link, links) => {
      const issue = link.inwardIssue ?? link.outwardIssue;
      if (
        selectedTableFieldIds
          .get("issueTypes")
          .includes(issue.fields.issuetype.id)
      ) {
        let name = link.inwardIssue ? link.type.inward : link.type.outward;
        name = toTitleCase(name);
        if (!links.includes(name)) {
          links.push(name);
        }
        if (!holder[name]) holder[name] = [];
        holder[name].push(issue);
      }
    };
    console.log("table field ids!!");
    console.log(selectedTableFieldIds);
    const links = [];
    const classifieds = [];
    filteredIssues.forEach((issue) => {
      const fields = issue.fields;
      const classified = {
        issue,
        subtasks: fields.subtasks.filter((issue) =>
          selectedTableFieldIds
            .get("issueTypes")
            .includes(issue.fields.issuetype.id)
        ),
      };
      if (
        fields.parent &&
        selectedTableFieldIds
          .get("issueTypes")
          .includes(fields.parent.fields.issuetype.id)
      ) {
        classified.parent = fields.parent;
      }
      if (fields.issuelinks) {
        fields.issuelinks.forEach((link) => {
          console.log("checking links!!!!!!!");
          console.log(selectedTableFieldIds.get("linkTypes"));
          console.log(link);
          if (selectedTableFieldIds.get("linkTypes").includes(link.type.id)) {
            upsurt(classified, link, links);
          }
        });
      }
      classifieds.push(classified);
    });
    links.sort();
    download("csv", reportCsv(classifieds, links));
  };
  useEffect(() => {
    const fetchFieldsData = async () => {
      try {
        let results = await api.getIssueFields();
        const newResults = results.map((result) => {
          if (result.key.includes("customfield_")) {
            result.customKey = result.name
              .replace(/[\s, -]/g, "")
              .toLowerCase();
          } else {
            result.customKey = result.key;
          }
          return result;
        });
        const fieldNames = [
          ...fixedFieldNames,
          "issuetype",
          "priority",
          "status",
          "assignee",
          "storypoints",
          "storypointestimate",
        ];
        let selectedFieldIds: string[] = [];
        let fieldsMap = new Map();
        fieldNames.forEach((name) => {
          const field = newResults.find((result) => result.customKey == name);
          if (field) {
            fieldsMap.set(field.customKey, field);
            if (!fixedFieldNames.includes(name)) {
              selectedFieldIds.push(field.id);
            }
          }
        });
        setIssueFields(fieldsMap);
        setSelectedIssueFieldIds(selectedFieldIds);
      } catch (error) {
        handleNewError(error);
      }
    };
    const fetchIssueTypes = async () => {
      try {
        const issueTypes = await api.getIssueTypes();
        console.log(issueTypes);

        setTableFields((prevState) => {
          const newMap = new Map(prevState);
          newMap.set("issueTypes", { name: "Issue Types", values: issueTypes });
          return newMap;
        });
        setSelectedTableFieldIds((prevState) => {
          const newMap = new Map(prevState);
          newMap.set(
            "issueTypes",
            issueTypes.map((type) => type.id)
          );
          return newMap;
        });
      } catch (error) {
        handleNewError(error);
      }
    };
    const fetchLinkTypes = async () => {
      try {
        const issueLinkTypes = await api.getIssueLinkTypes();
        console.log(issueLinkTypes);
        setTableFields((prevState) => {
          const newMap = new Map(prevState);
          newMap.set("linkTypes", {
            name: "Issue Link Types",
            values: issueLinkTypes,
          });
          return newMap;
        });
        setSelectedTableFieldIds((prevState) => {
          const newMap = new Map(prevState);
          newMap.set(
            "linkTypes",
            issueLinkTypes.map((type) => type.id)
          );
          return newMap;
        });
      } catch (error) {
        handleNewError(error);
      }
    };
    fetchFieldsData();
    fetchIssueTypes();
    fetchLinkTypes();
  }, []);
  console.log("from main");
  console.log(tableFields);
  const issueCardOptionsMap = new Map(issueFields);
  for (const fieldId of issueCardOptionsMap.keys()) {
    if (fixedFieldNames.includes(fieldId)) {
      issueCardOptionsMap.delete(fieldId);
    }
  }

  return (
    <FullWidthContainer>
      <PageHeader
        bottomBar={
          <Toolbar
            selectedJQLString={selectedJQLString}
            setSelectedJQLString={setSelectedJQLString}
            issueCardOptionsMap={issueCardOptionsMap}
            selectedIssueFieldIds={selectedIssueFieldIds}
            setSelectedIssueFieldIds={setSelectedIssueFieldIds}
            selectedTableFieldIds={selectedTableFieldIds}
            updateSelectedTableFieldIds={setSelectedTableFieldIds}
            tableFields={tableFields}
            exportReport={exportReport}
          />
        }
      >
        Links Explorer Traceability and Reports
      </PageHeader>
      <GrowContainer>
        <Main
          issueCardOptionsMap={issueCardOptionsMap}
          jqlString={selectedJQLString}
          handleNewError={handleNewError}
          issueFields={issueFields}
          selectedIssueFieldIds={selectedIssueFieldIds}
          selectedTableFieldIds={selectedTableFieldIds}
          filteredIssues={filteredIssues}
          setFilteredIssues={setFilteredIssues}
        />
      </GrowContainer>
    </FullWidthContainer>
  );
};
