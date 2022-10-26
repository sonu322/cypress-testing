import React, { useContext, useEffect, useState } from "react";
import Page from "@atlaskit/page";
import styled from "styled-components";
import { APIContext } from "../../context/api";

import PageHeader from "@atlaskit/page-header";
import { Toolbar } from "./Toolbar";
import { IssueField, Project } from "../../types/api";
const FullWidthContainer = styled.div`
  width: 100%;
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
  const [selectedJQLString, setSelectedJQLString] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchFieldsData = async () => {
      let promises = [
        api.getCurrentProject().catch((err) => handleNewError(err)),
        api.getIssueFields(),
      ];
      try {
        let [project, results] = await Promise.all(promises);
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
        ];

        if (project) {
          if (project.style == "classic") {
            fieldNames.push("storypoints");
          } else {
            fieldNames.push("storypointestimate");
          }
        }
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
    <Page>
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
            />
          }
        >
          Links Explorer Traceability and Reports
        </PageHeader>
      </FullWidthContainer>
    </Page>
  );
};
