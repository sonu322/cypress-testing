import React, { useContext, useEffect, useState } from "react";
import Page  from "@atlaskit/page"; 
import styled from "styled-components";
import { APIContext } from "../../context/api";

import PageHeader from "@atlaskit/page-header";
import { Toolbar } from "./Toolbar";
import { IssueField } from "../../types/api";
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
  const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null);
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
    fetchFieldsData();
  }, []);
  let issueCardOptionsMap = new Map(issueFields);
  for (let fieldId of issueCardOptionsMap.keys()) {
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
                selectedFilterId={selectedFilterId}
                setSelectedFilterId={setSelectedFilterId}
                issueCardOptionsMap={issueCardOptionsMap}
                selectedIssueFieldIds={selectedIssueFieldIds}
                setSelectedIssueFieldIds={setSelectedIssueFieldIds}
              />
            }
          >
            Links Explorer Traceability and Reports
          </PageHeader>
        </FullWidthContainer>
      </Page>
  );
};
