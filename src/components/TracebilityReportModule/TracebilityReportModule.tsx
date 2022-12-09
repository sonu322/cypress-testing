import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { APIContext } from "../../context/api";
import PageHeader from "@atlaskit/page-header";
import { SelectedType } from "@atlaskit/tabs/types";
import { Toolbar } from "./Toolbar";
import { useTranslation } from "react-i18next";
import {
  IssueField,
  IssueLinkType,
  IssueType,
  IssueWithSortedLinks,
} from "../../types/api";
import { Main } from "./Main";
import { ErrorsList } from "../common/ErrorsList";
import {
  exportReport,
  orderSelectedIds,
} from "../../util/tracebilityReportsUtils";
import { getKeyValues } from "../../util/common";

const FullWidthContainer = styled.div`
  width: 100%;
  // height: 100%;
  display: flex;
  flex-direction: column;
  margin-top: -16px;
`;
const GrowContainer = styled.div`
  flex-grow: 1;
  display: flex;
`;

export const TracebilityReportModule = (): JSX.Element => {
  const { t } = useTranslation();
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
  const [issueTypes, setIssueTypes] = useState<IssueType[]>([]);
  const [selectedIssueTypeIds, setSelectedIssueTypeIds] = useState<string[]>(
    []
  );
  const [linkTypes, setLinkTypes] = useState<IssueLinkType[]>([]);
  const [selectedLinkTypeIds, setSelectedLinkTypeIds] = useState<string[]>([]);

  const [areIssuesLoading, setAreIssuesLoading] = useState(false);
  const [errors, setErrors] = useState<unknown[]>([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState<SelectedType>(0);
  const viewTabs = [
    {
      name: t("traceability-report.issuetype-view.name"),
      description: t("traceability-report.issuetype-view.description"),
    },
    {
      name: t("traceability-report.linktype-view.name"),
      description: t("traceability-report.linktype-view.description"),
    },
  ];
  const handleTabOptionSelect = (tabIndex: SelectedType): void => {
    setSelectedTabIndex(tabIndex);
  };
  const api = useContext(APIContext);
  const handleNewError = (err: unknown): void => {
    console.error(err);
    setErrors((prevErrors) => [...prevErrors, err]);
  };
  const clearAllErrors = (): void => {
    setErrors([]);
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

        // setting state - fields for issue card
        setIssueFields(fields);

        // setting state - selected field ids
        const selectedFieldIds = getKeyValues(fields, "id");
        setSelectedIssueFieldIds(selectedFieldIds);

        // setting state - table field options

        setIssueTypes(issueTypes);
        setSelectedIssueTypeIds(getKeyValues(issueTypes, "id"));
        setLinkTypes(linkTypes);
        setSelectedLinkTypeIds(getKeyValues(linkTypes, "id"));

        // loading state
        setAreOptionsLoading(false);
      } catch (error) {
        setAreOptionsLoading(false);
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
    return <div>{t("lxp.common.loading")}</div>;
  }
  const updateSelectedIssueTypeIds = (fieldIds: string[]): void => {
    const newSelectedIds = orderSelectedIds(fieldIds, issueTypes);
    setSelectedIssueTypeIds(newSelectedIds);
  };
  const updateSelectedLinkTypeIds = (fieldIds: string[]): void => {
    const newSelectedIds = orderSelectedIds(fieldIds, linkTypes);
    setSelectedLinkTypeIds(newSelectedIds);
  };
  let selectedTableFieldIds: string[];
  let isIssueTypeReport: boolean;
  let updateSelectedTableFieldIds: (fieldIds: string[]) => void;
  let tableFields: IssueType[] | IssueLinkType[];
  if (selectedTabIndex === 0) {
    selectedTableFieldIds = selectedIssueTypeIds;
    tableFields = issueTypes;
    updateSelectedTableFieldIds = updateSelectedIssueTypeIds;
    isIssueTypeReport = true;
  } else {
    selectedTableFieldIds = selectedLinkTypeIds;
    tableFields = linkTypes;
    updateSelectedTableFieldIds = updateSelectedLinkTypeIds;
    isIssueTypeReport = false;
  }
  const allTableFieldIds = tableFields.map((field) => field.id);

  const emptyEqualsAllTableIds =
    selectedTableFieldIds.length > 0 ? selectedTableFieldIds : allTableFieldIds;
  const title = t("traceability-report.name");
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
            updateSelectedTableFieldIds={updateSelectedTableFieldIds}
            tableFields={tableFields}
            exportReport={() =>
              exportReport(
                tableFields,
                emptyEqualsAllTableIds,
                filteredIssues,
                isIssueTypeReport
              )
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
        {title}
      </PageHeader>
      {errors.length > 0 && <ErrorsList errors={errors} />}
      <GrowContainer>
        <Main
          jqlString={selectedJQLString}
          handleNewError={handleNewError}
          clearAllErrors={clearAllErrors}
          issueFields={issueFields}
          selectedIssueFieldIds={selectedIssueFieldIds}
          tableFields={tableFields}
          selectedTableFieldIds={emptyEqualsAllTableIds}
          filteredIssues={filteredIssues}
          setFilteredIssues={setFilteredIssues}
          areIssuesLoading={areIssuesLoading}
          setAreIssuesLoading={setAreIssuesLoading}
          isIssueTypeReport={selectedTabIndex === 0}
          errors={errors}
        />
      </GrowContainer>
    </FullWidthContainer>
  );
};;
