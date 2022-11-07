import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { APIContext } from "../../context/api";
import PageHeader from "@atlaskit/page-header";
import { SelectedType } from "@atlaskit/tabs/types";
import { Toolbar } from "./Toolbar";
import { IssueField, IssueWithSortedLinks } from "../../types/api";
import { Main } from "./Main";
import { ErrorsList } from "../common/ErrorsList";
import { exportReport } from "../../util/tracebilityReportsUtils";
import { getKeyMap, getKeyValues } from "../../util/common";

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

export const TracebilityReportModule = (): JSX.Element => {
  const [selectedTableFieldIds, setSelectedTableFieldIds] = useState<
    Map<string, string[]>
  >(new Map());

  const [tableFields, setTableFields] = useState<
    Map<string, { name: string; values: any[] }>
  >(new Map());
  const [areOptionsLoading, setAreOptionsLoading] = useState(true);
  const [filteredIssues, setFilteredIssues] = useState<
    IssueWithSortedLinks[] | null
  >(null);
  const [selectedJQLString, setSelectedJQLString] = useState<string | null>(
    null
  );
  const [issueFields, setIssueFields] = useState<IssueField[]>([]);
  const [selectedIssueFieldIds, setSelectedIssueFieldIds] = useState<string[]>(
    []
  );
  // const [issueFields, setIssueFields] = useState<IssueField[]>([]);
  // const [selectedIssueFieldIds, setSelectedIssueFieldIds] = useState<string[]>(
  //   []
  // );
  // const [issueFields, setIssueFields] = useState<IssueField[]>([]);
  // const [selectedIssueFieldIds, setSelectedIssueFieldIds] = useState<string[]>(
  //   []
  // );

  const [areIssuesLoading, setAreIssuesLoading] = useState(false);
  const [errors, setErrors] = useState<unknown[]>([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState<SelectedType>(0);
  const viewTabs = ["Issue Type View", "Link Type View"];
  const handleTabOptionSelect = (tabIndex: SelectedType): void => {
    setSelectedTabIndex(tabIndex);
  };
  const api = useContext(APIContext);
  const handleNewError = (err: unknown): void => {
    console.log(err);
    setErrors((prevErrors) => [...prevErrors, err]);
  };
  console.log("selectedtab");
  console.log(selectedTabIndex);
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

        // setting state - fields for issue card
        setIssueFields(fields);

        // setting state - selected field ids
        const selectedFieldIds = getKeyValues(fields, "id");
        setSelectedIssueFieldIds(selectedFieldIds);

        // setting state - table field options
        const fieldsMap = new Map<string, { name: string; values: any[] }>();
        fieldsMap.set("issueTypes", {
          name: "Issue Types",
          values: issueTypes,
        });
        fieldsMap.set("linkTypes", {
          name: "Issue Link Types",
          values: linkTypes,
        });
        setTableFields(fieldsMap);

        // setting state - table field selected options
        const fieldIdsMap = getKeyMap(fieldsMap, "id");
        setSelectedTableFieldIds(fieldIdsMap);

        // loading state
        setAreOptionsLoading(false);
      } catch (error) {
        console.error(error);
        handleNewError(error);
      }
    };
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isExportDisabled =
    filteredIssues == null || filteredIssues.length === 0;

  if (areOptionsLoading) {
    return <div>Loading data ...</div>;
  }
  return (
    <FullWidthContainer>
      <PageHeader
        bottomBar={
          <Toolbar
            selectedJQLString={selectedJQLString}
            setSelectedJQLString={setSelectedJQLString}
            issueCardOptions={issueFields}
            selectedIssueFieldIds={selectedIssueFieldIds}
            setSelectedIssueFieldIds={setSelectedIssueFieldIds}
            selectedTableFieldIds={selectedTableFieldIds}
            updateSelectedTableFieldIds={setSelectedTableFieldIds}
            tableFields={tableFields}
            exportReport={() =>
              exportReport(tableFields, selectedTableFieldIds, filteredIssues)
            }
            isExportDisabled={isExportDisabled}
            handleNewError={handleNewError}
            viewTabs={viewTabs}
            viewTabsId={"view-tabs"}
            handleTabOptionSelect={handleTabOptionSelect}
            selectedTabIndex={selectedTabIndex}
          />
        }
      >
        Links Explorer Traceability and Reports
      </PageHeader>
      {errors.length > 0 && <ErrorsList errors={errors} />}
      <GrowContainer>
        <Main
          jqlString={selectedJQLString}
          handleNewError={handleNewError}
          issueFields={issueFields}
          selectedIssueFieldIds={selectedIssueFieldIds}
          tableFields={tableFields}
          selectedTableFieldIds={selectedTableFieldIds}
          filteredIssues={filteredIssues}
          setFilteredIssues={setFilteredIssues}
          areIssuesLoading={areIssuesLoading}
          setAreIssuesLoading={setAreIssuesLoading}
          selectedTab={selectedTabIndex === 0 ? "issueType" : "linkType"}
        />
      </GrowContainer>
    </FullWidthContainer>
  );
};;
