import React, { useContext, useEffect, useState } from "react";
import { LoadingButton } from "@atlaskit/button";
import Spinner from "@atlaskit/spinner";
import { APIContext } from "../../context/api";
import styled from "styled-components";
import { Report } from "./Report";
import TracebilityReportUtils from "../../util/tracebilityReportsUtils";
import { IssueField, IssueWithSortedLinks } from "../../types/api";
const Container = styled.div`
  padding: 4px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const GrowContainer = styled.div`
  flex-grow: 1;
  display: flex;
`;
const DEFAULT_ROWS_PER_PAGE = 20;
const START_INDEX = 0;

interface Props {
  jqlString: string;
  handleNewError: (err: unknown) => void;
  issueFields: IssueField[];
  selectedIssueFieldIds: string[];
  selectedTableFieldIds: Map<string, string[]>;
  tableFields: Map<
    string,
    {
      name: string;
      values: any[];
    }
  >;
  filteredIssues: IssueWithSortedLinks[];
  areIssuesLoading: boolean;
  setAreIssuesLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFilteredIssues: React.Dispatch<
    React.SetStateAction<IssueWithSortedLinks[]>
  >;
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
}: Props): JSX.Element => {
  const [totalNumberOfIssues, setTotalNumberOfIssues] = useState(0);
  const [areMoreIssuesLoading, setAreMoreIssuesLoading] = useState(false);
  const api = useContext(APIContext);
  const updateIssues = (issues): void => {
    const newIssues = filteredIssues ?? [];
    const updatedIssues = newIssues.concat(issues);
    setFilteredIssues(updatedIssues);
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
      updateIssues,
      setAreMoreIssuesLoading,
      null,
      handleNewError
    );
  };

  if (areIssuesLoading) {
    return (
      <Container>
        <Spinner size="medium" />
      </Container>
    );
  } else if (Boolean(jqlString) && filteredIssues != null) {
    if (filteredIssues.length === 0) {
      return (
        <Container>
          <em>No matching issues</em>
        </Container>
      );
    }
    return (
      <Container>
        <GrowContainer>
          <Report
            filteredIssues={filteredIssues}
            issueFieldIds={selectedIssueFieldIds}
            tableFields={tableFields}
            selectedTableFieldIds={selectedTableFieldIds}
          />
        </GrowContainer>
        <div>
          <LoadingButton
            isLoading={areMoreIssuesLoading}
            isDisabled={filteredIssues.length >= totalNumberOfIssues}
            onClick={fetchMoreIssues}
          >
            More
          </LoadingButton>
        </div>
      </Container>
    );
  } else {
    return (
      <Container>
        <em>Please select filter to view report</em>
      </Container>
    );
  }
};
