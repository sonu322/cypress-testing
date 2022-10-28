import React, { useContext, useEffect, useState } from "react";
import { LoadingButton } from "@atlaskit/button";
import Spinner from "@atlaskit/spinner";
import { APIContext } from "../../context/api";
import { getFieldIds } from "../../util";
import styled from "styled-components";
import { Report } from "./Report";

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
export const Main = ({
  issueCardOptionsMap,
  jqlString,
  handleNewError,
  issueFields,
  selectedIssueFieldIds,
  selectedTableFieldIds,
  filteredIssues,
  setFilteredIssues,
  areIssuesLoading,
  setAreIssuesLoading,
}) => {
  const [totalNumberOfIssues, setTotalNumberOfIssues] = useState(0);
  const api = useContext(APIContext);
  useEffect(() => {
    if (jqlString) {
      const fieldIds = getFieldIds(issueFields);
      const fetchFilteredIssues = async () => {
        setAreIssuesLoading(true);
        try {
          const searchResult = await api.searchIssues(
            jqlString,
            START_INDEX,
            DEFAULT_ROWS_PER_PAGE,
            fieldIds
          );
          const issues = searchResult.issues;
          const totalNumberOfIssues = searchResult.totalNumberOfIssues;
          setFilteredIssues(issues);
          if (issues != null) {
            setAreIssuesLoading(false);
          }
          setTotalNumberOfIssues(totalNumberOfIssues);
        } catch (error) {
          setAreIssuesLoading(false);
          handleNewError(error);
        }
      };
      fetchFilteredIssues();
    }
  }, [jqlString]);
  const fetchMoreIssues = (): void => {
    const fieldIds = getFieldIds(issueFields);
    const fetchFilteredIssues = async (): Promise<void> => {
      setAreIssuesLoading(true);
      try {
        const searchResult = await api.searchIssues(
          jqlString,
          filteredIssues.length,
          totalNumberOfIssues,
          fieldIds
        );
        const issues = searchResult.issues;
        setFilteredIssues(filteredIssues.concat(issues));
        if (issues != null) {
          setAreIssuesLoading(false);
        }
      } catch (error) {
        setAreIssuesLoading(false);
        handleNewError(error);
      }
    };
    void fetchFilteredIssues();
  };
  if (Boolean(jqlString) && filteredIssues != null) {
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
            issueCardOptionsMap={issueCardOptionsMap}
            issues={filteredIssues}
            issueFieldIds={selectedIssueFieldIds}
            tableFieldIds={selectedTableFieldIds}
          />
        </GrowContainer>
        <div>
          <LoadingButton
            isLoading={areIssuesLoading}
            isDisabled={filteredIssues.length >= totalNumberOfIssues}
            onClick={fetchMoreIssues}
          >
            More
          </LoadingButton>
        </div>
      </Container>
    );
  } else if (Boolean(jqlString) && filteredIssues == null && areIssuesLoading) {
    return (
      <Container>
        <Spinner size="medium" />
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
