import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { APIContext } from "../../context/api";
import PageHeader from "@atlaskit/page-header";
import { Toolbar } from "./Toolbar";
import { Issue, IssueField } from "../../types/api";
import { Main } from "./Main";
import { ErrorsList } from "../ErrorsList";
import { exportReport } from "../../util/tracebilityReportsUtils";
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

export const TracebilityReportModule = (): JSX.Element => {
  const [filteredIssues, setFilteredIssues] = useState<Issue[] | null>(null);
  const [selectedJQLString, setSelectedJQLString] = useState<string | null>(
    null
  );
  const [issueFields, setIssueFields] = useState<Map<string, IssueField>>(
    new Map()
  );
  const [selectedIssueFieldIds, setSelectedIssueFieldIds] = useState<string[]>(
    []
  );
  const [selectedTableFieldIds, setSelectedTableFieldIds] = useState(new Map());
  const [errors, setErrors] = useState<unknown[]>([]);
  const [tableFields, setTableFields] = useState(new Map());
  const api = useContext(APIContext);
  const handleNewError = (err: unknown): void => {
    console.log(err);
    setErrors((prevErrors) => [...prevErrors, err]);
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
            exportReport={() =>
              exportReport(selectedTableFieldIds, filteredIssues)
            }
            handleNewError={handleNewError}
          />
        }
      >
        Links Explorer Traceability and Reports
      </PageHeader>
      {errors && <ErrorsList errors={errors} />}
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
