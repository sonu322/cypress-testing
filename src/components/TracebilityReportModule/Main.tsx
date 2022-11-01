import React, { useContext, useEffect, useState } from "react";
import { LoadingButton } from "@atlaskit/button";
import Spinner from "@atlaskit/spinner";
import { APIContext } from "../../context/api";
import { getFieldIds } from "../../util";
import styled from "styled-components";
import { Report } from "./Report";
import {
  getRelatedIssueIds,
  getJQLStringFromIds,
} from "../../util/tracebilityReportsUtils";
import {Issue} from "../../types/api";

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
  allRelatedIssues,
  setAllRelatedIssues,
  areIssuesLoading,
  setAreIssuesLoading,
}): JSX.Element => {
  const [totalNumberOfIssues, setTotalNumberOfIssues] = useState(0);
  const [areMoreIssuesLoading, setAreMoreIssuesLoading] = useState(false);
  const api = useContext(APIContext);
  useEffect(() => {
    if (jqlString) {
      const fetchFilteredIssues = async (): Promise<void> => {
        setAreIssuesLoading(true);
        try {
          const searchResult = await api.searchLinkedIssues(
            jqlString,
            issueFields,
            START_INDEX,
            DEFAULT_ROWS_PER_PAGE
          );
          const {data, total} = searchResult;

          const relatedIssueIds = getRelatedIssueIds(data);
          const relatedIssuesjqlString = getJQLStringFromIds(relatedIssueIds);
          setFilteredIssues(data);
          const searchAllRelatedIssuesResult = await api.searchIssues(
            relatedIssuesjqlString,
            issueFields,
            START_INDEX,
            relatedIssueIds.length
          );
          const allRelatedIssues = searchAllRelatedIssuesResult.data;
          setAllRelatedIssues(allRelatedIssues);
          if (
            data != null &&
            allRelatedIssues !== undefined &&
            allRelatedIssues !== null
          ) {
            setAreIssuesLoading(false);
          }
          setTotalNumberOfIssues(total);
        } catch (error) {
          setAreIssuesLoading(false);
          handleNewError(error);
        }
      };
      void fetchFilteredIssues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jqlString]);
  const fetchMoreIssues = (): void => {
    const fieldIds = getFieldIds(issueFields);
    const fetchFilteredIssues = async (): Promise<void> => {
      setAreMoreIssuesLoading(true);
      try {
        const searchResult = await api.searchLinkedIssues(
          jqlString,
          filteredIssues.length,
          totalNumberOfIssues,
          fieldIds
        );
        const issues = searchResult.issues;
        const oldIssueIds = getRelatedIssueIds(filteredIssues);
        let newIssueIds = getRelatedIssueIds(issues);
        newIssueIds = newIssueIds.filter((id) => {
          return !oldIssueIds.includes(id);
        });
        const relatedIssuesjqlString = getJQLStringFromIds(newIssueIds);
        const searchAllRelatedIssuesResult = await api.searchIssues(
          relatedIssuesjqlString,
          fieldIds,
          START_INDEX,
          newIssueIds.length
        );
        const allRelatedIssues = searchAllRelatedIssuesResult.data;
        setFilteredIssues((prevIssues: Issue[]) => prevIssues.concat(issues));
        setAllRelatedIssues((prevIssues: Issue[]) =>
          prevIssues.concat(allRelatedIssues)
        );
        if (issues != null) {
          setAreMoreIssuesLoading(false);
        }
      } catch (error) {
        setAreMoreIssuesLoading(false);
        handleNewError(error);
      }
    };
    void fetchFilteredIssues();
  };
  if (areIssuesLoading) {
    return (
      <Container>
        <Spinner size="medium" />
      </Container>
    );
  } else if (
    Boolean(jqlString) &&
    filteredIssues != null &&
    allRelatedIssues != null
  ) {
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
            allRelatedIssues={allRelatedIssues}
            issueCardOptionsMap={issueCardOptionsMap}
            filteredIssues={filteredIssues}
            issueFieldIds={selectedIssueFieldIds}
            tableFieldIds={selectedTableFieldIds}
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
