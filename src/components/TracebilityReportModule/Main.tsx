import React, { useContext, useEffect, useState } from "react";
import { LoadingButton } from "@atlaskit/button";
import Spinner from "@atlaskit/spinner";
import {APIContext} from "../../context/api";
import styled from "styled-components";
import {Report} from "./Report";
import TracebilityReportUtils from "../../util/tracebilityReportsUtils";
import TreeUtils from "../../util/TreeUtils";
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
  tableFields,
  filteredIssues,
  areIssuesLoading,
  setAreIssuesLoading,
  setFilteredIssues,
}): JSX.Element => {
  const [totalNumberOfIssues, setTotalNumberOfIssues] = useState(0);
  const [areMoreIssuesLoading, setAreMoreIssuesLoading] = useState(false);
  const api = useContext(APIContext);
  const tracebilityREportUtils = new TracebilityReportUtils(api);
  useEffect(() => {
    if (jqlString) {
      void tracebilityREportUtils.populateIssues(
        jqlString,
        issueFields,
        START_INDEX,
        DEFAULT_ROWS_PER_PAGE,
        setFilteredIssues,
        setAreIssuesLoading,
        setTotalNumberOfIssues,
        handleNewError
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jqlString]);

  const fetchMoreIssues = (): void => {
    const fetchFilteredIssues = async (): Promise<void> => {
      setAreMoreIssuesLoading(true);
      try {
        const searchResult = await api.searchLinkedIssues(
          jqlString,
          issueFields,
          filteredIssues.length,
          totalNumberOfIssues
        );
        const {data, total} = searchResult;
        console.log("total issues!!!!!");
        console.log(total);
        const fullIssues = filteredIssues.concat(data);
        setFilteredIssues(fullIssues);
        setAreMoreIssuesLoading(false);
      } catch (error) {
        setAreMoreIssuesLoading(false);
        handleNewError(error);
      }
    };
    void fetchFilteredIssues();
  };

  // const fieldIds = getFieldIds(issueFields);
  // const fetchFilteredIssues = async (): Promise<void> => {
  //   setAreMoreIssuesLoading(true);
  //   try {
  //     const searchResult = await api.searchLinkedIssues(
  //       jqlString,
  //       filteredIssues.length,
  //       totalNumberOfIssues,
  //       fieldIds
  //     );
  //     const issues = searchResult.issues;
  //     const oldIssueIds = getLinkedIssueIds(filteredIssues);
  //     let newIssueIds = getLinkedIssueIds(issues);
  //     newIssueIds = newIssueIds.filter((id) => {
  //       return !oldIssueIds.includes(id);
  //     });
  //     const relatedIssuesjqlString = getJQLStringFromIds(newIssueIds);
  //     const searchAllRelatedIssuesResult = await api.searchIssues(
  //       relatedIssuesjqlString,
  //       fieldIds,
  //       START_INDEX,
  //       newIssueIds.length
  //     );
  //     const allRelatedIssues = searchAllRelatedIssuesResult.data;
  //     setFilteredIssues((prevIssues: Issue[]) => prevIssues.concat(issues));
  //     setAllRelatedIssues((prevIssues: Issue[]) =>
  //       prevIssues.concat(allRelatedIssues)
  //     );
  //     if (issues != null) {
  //       setAreMoreIssuesLoading(false);
  //     }
  //   } catch (error) {
  //     setAreMoreIssuesLoading(false);
  //     handleNewError(error);
  //   }
  // };
  // void fetchFilteredIssues();
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
            issueCardOptionsMap={issueCardOptionsMap}
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
};;;;;;
