import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { APIContext } from "../../context/api";
import PageHeader from "@atlaskit/page-header";
import { Toolbar } from "./Toolbar";
import { Issue, IssueField } from "../../types/api";
import { Main } from "./Main";
import { ErrorsList } from "../common/ErrorsList";
import { exportReport } from "../../util/tracebilityReportsUtils";
import { getKeyValues } from "../../util/common";
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
  const [isLoading, setIsLoading] = useState(true);
  const [allRelatedIssues, setAllRelatedIssues] = useState<Issue[] | null>(
    null
  );
  const [filteredIssues, setFilteredIssues] = useState<Issue[] | null>(null);
  const [selectedJQLString, setSelectedJQLString] = useState<string | null>(
    null
  );
  const [issueFields, setIssueFields] = useState<IssueField[]>([]);
  const [selectedIssueFieldIds, setSelectedIssueFieldIds] = useState<string[]>(
    []
  );
  const [selectedTableFieldIds, setSelectedTableFieldIds] = useState(new Map());
  const [errors, setErrors] = useState<unknown[]>([]);
  const [tableFields, setTableFields] = useState(new Map());
  const [areIssuesLoading, setAreIssuesLoading] = useState(false);
  const api = useContext(APIContext);
  const handleNewError = (err: unknown): void => {
    console.log(err);
    setErrors((prevErrors) => [...prevErrors, err]);
  };

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const result = await Promise.all([
          api.getIssueTypes(),
          api.getIssueLinkTypes(),
          api.getIssueFields(),
        ]);

        const issueTypes = result[0];
        const linkTypes = result[1];
        const fields = result[2];

        // setting state
        const fieldsMap = new Map();
        fieldsMap.set("issueTypes", {
          name: "Issue Types",
          values: issueTypes,
        });
        fieldsMap.set("linkTypes", {
          name: "Issue Link Types",
          values: linkTypes,
        });
        setTableFields(fieldsMap);

        const fieldIdsMap = new Map();
        fieldIdsMap.set("issueTypes", getKeyValues(issueTypes, "id"));
        fieldIdsMap.set("linkTypes", getKeyValues(linkTypes, "id"));
        setSelectedTableFieldIds(fieldIdsMap);

        setIssueFields(fields);
        setIsLoading(false);
      } catch (error) {
        handleNewError(error);
      }
    };
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isExportDisabled =
    filteredIssues == null || filteredIssues.length === 0;
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
            issueCardOptions={issueFields}
            issueCardOptionsMap={issueCardOptionsMap}
            selectedIssueFieldIds={selectedIssueFieldIds}
            setSelectedIssueFieldIds={setSelectedIssueFieldIds}
            selectedTableFieldIds={selectedTableFieldIds}
            updateSelectedTableFieldIds={setSelectedTableFieldIds}
            tableFields={tableFields}
            exportReport={() =>
              exportReport(selectedTableFieldIds, filteredIssues)
            }
            isExportDisabled={isExportDisabled}
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
          allRelatedIssues={allRelatedIssues}
          setAllRelatedIssues={setAllRelatedIssues}
          areIssuesLoading={areIssuesLoading}
          setAreIssuesLoading={setAreIssuesLoading}
        />
      </GrowContainer>
    </FullWidthContainer>
  );
};;;;;;
