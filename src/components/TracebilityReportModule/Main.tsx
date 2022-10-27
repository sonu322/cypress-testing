import React, { useContext, useEffect, useState } from "react";
import Button from "@atlaskit/button";
import Spinner from "@atlaskit/spinner";
import { APIContext } from "../../context/api";
import { Issue } from "../../types/api";
import { getFieldIds } from "../../util";
import styled from "styled-components";
import { Report } from "./Report";
const Container = styled.div`
  padding: 4px;
`;
const DEFAULT_ROWS_PER_PAGE = 20;

export const Main = ({
  issueCardOptionsMap,
  jqlString,
  handleNewError,
  issueFields,
  selectedIssueFieldIds,
  selectedTableFieldIds,
}) => {
  const [filteredIssues, setFilteredIssues] = useState<Issue[] | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [totalNumberOfIssues, setTotalNumberOfIssues] = useState(0);
  const api = useContext(APIContext);
  useEffect(() => {
    if (jqlString) {
      const fieldIds = getFieldIds(issueFields);
      const fetchFilteredIssues = async () => {
        try {
          const searchResult = await api.searchIssues(
            jqlString,
            startIndex,
            DEFAULT_ROWS_PER_PAGE,
            fieldIds
          );
          const issues = searchResult.issues;
          const totalNumberOfIssues = searchResult.totalNumberOfIssues;
          console.log("from table!!!!", issues);
          console.log(issues);
          setFilteredIssues(issues);
          setTotalNumberOfIssues(totalNumberOfIssues);
        } catch (error) {
          handleNewError(error);
        }
      };
      fetchFilteredIssues();
    }
  }, [jqlString]);
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
        <Report
          issueCardOptionsMap={issueCardOptionsMap}
          issues={filteredIssues}
          issueFieldIds={selectedIssueFieldIds}
          tableFieldIds={selectedTableFieldIds}
        />
        <Button
          // isLoading={gettingMore}
          isDisabled={filteredIssues.length >= totalNumberOfIssues}
          onClick={() => {
            const fieldIds = getFieldIds(issueFields);
            const fetchFilteredIssues = async () => {
              try {
                const searchResult = await api.searchIssues(
                  jqlString,
                  filteredIssues.length,
                  totalNumberOfIssues,
                  fieldIds
                );
                const issues = searchResult.issues;

                console.log("from table!!!!", issues);
                console.log(issues);
                setFilteredIssues(filteredIssues.concat(issues));
              } catch (error) {
                handleNewError(error);
              }
            };
            void fetchFilteredIssues();
          }}
        >
          More
        </Button>
        <div>
          <div>{jqlString}</div>
          <div>......</div>
          <div>{filteredIssues?.map((issue) => issue.id)}</div>
        </div>
      </Container>
    );
  } else if (Boolean(jqlString) && filteredIssues == null) {
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
