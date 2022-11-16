import React, { useContext, useEffect, useState } from "react";
import { LoadingButton } from "@atlaskit/button";
import Spinner from "@atlaskit/spinner";
import { APIContext } from "../../context/api";
import styled from "styled-components";
import { Report } from "./Report";
import TracebilityReportUtils from "../../util/tracebilityReportsUtils";
import {
  IssueField,
  IssueLinkType,
  IssueType,
  IssueWithSortedLinks,
} from "../../types/api";
const Container = styled.div`
  width: 100%;
`;
const FullHeightContainer = styled.div`
  
`;
const TableContainer = styled.div`
  display: flex;
`;
const MarginAddedContainer = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
`;
const DEFAULT_ROWS_PER_PAGE = 20;
const START_INDEX = 0;

interface Props {
  jqlString: string;
  handleNewError: (err: unknown) => void;
  issueFields: IssueField[];
  selectedIssueFieldIds: string[];
  selectedTableFieldIds: string[];
  tableFields: IssueType[] | IssueLinkType[];
  filteredIssues: IssueWithSortedLinks[];
  areIssuesLoading: boolean;
  setAreIssuesLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFilteredIssues: React.Dispatch<
    React.SetStateAction<IssueWithSortedLinks[]>
  >;
  isIssueTypeReport: boolean;
  errors: any[];
}

export const Main = ({
  jqlString,
  handleNewError,
  issueFields,
  selectedIssueFieldIds,
  selectedTableFieldIds,
  tableFields,
  filteredIssues,
  areIssuesLoading,
  setAreIssuesLoading,
  setFilteredIssues,
  isIssueTypeReport,
  errors
}: Props): JSX.Element => {
  const [totalNumberOfIssues, setTotalNumberOfIssues] = useState(0);
  const [areMoreIssuesLoading, setAreMoreIssuesLoading] = useState(false);
  const api = useContext(APIContext);
  const addMoreIssues = (issues: IssueWithSortedLinks[]): void => {
    const newIssues = filteredIssues ?? [];
    const updatedIssues = newIssues.concat(issues);
    setFilteredIssues(updatedIssues);
  };
  const updateIssues = (issues: IssueWithSortedLinks[]): void => {
    setFilteredIssues(issues);
  };
  const tracebilityReportUtils = new TracebilityReportUtils(api);
  useEffect(() => {
    if (jqlString !== null) {
      void tracebilityReportUtils.populateIssues(
        jqlString,
        issueFields,
        START_INDEX,
        DEFAULT_ROWS_PER_PAGE,
        updateIssues,
        setAreIssuesLoading,
        setTotalNumberOfIssues,
        handleNewError
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jqlString]);

  const fetchMoreIssues = (): void => {
    void tracebilityReportUtils.populateIssues(
      jqlString,
      issueFields,
      filteredIssues.length,
      totalNumberOfIssues,
      addMoreIssues,
      setAreMoreIssuesLoading,
      null,
      handleNewError
    );
  };

  if (areIssuesLoading) {
    return (
      <FullHeightContainer>
        <Spinner size="medium" />
      </FullHeightContainer>
    );
  } else if (jqlString !== null && filteredIssues != null) {
    if (filteredIssues.length === 0) {
      return (
        <FullHeightContainer>
          <em>No matching issues</em>
        </FullHeightContainer>
      );
    }

    return (
      <Container>
        <TableContainer>
          <Report
            filteredIssues={filteredIssues}
            issueFieldIds={selectedIssueFieldIds}
            tableFields={tableFields}
            selectedTableFieldIds={selectedTableFieldIds}
            isIssueTypeReport={isIssueTypeReport}
            errors={errors}
          />
        </TableContainer>
        <MarginAddedContainer>
          <LoadingButton
            isLoading={areMoreIssuesLoading}
            isDisabled={filteredIssues.length >= totalNumberOfIssues}
            onClick={fetchMoreIssues}
          >
            More
          </LoadingButton>
        </MarginAddedContainer>
      </Container>
    );
  } else {
    return (
      <FullHeightContainer>
        <em>Please select filter to view report</em>
      </FullHeightContainer>
    );
  }
};
