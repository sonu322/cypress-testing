import React, { useContext, useEffect, useState } from "react";
import Button from "@atlaskit/button";
import Spinner from "@atlaskit/spinner";
import { APIContext } from "../../context/api";
import { Issue } from "../../types/api";
import { getFieldIds } from "../../util";
import styled from "styled-components";
import { Table } from "./Table";
const Container = styled.div`
  padding: 4px;
`;
export const Main = ({
  jqlString,
  handleNewError,
  issueFields,
  selectedIssueFieldIds,
  selectedTableFieldIds,
}) => {
  const [filteredIssues, setFilteredIssues] = useState<Issue[] | null>(null);
  const api = useContext(APIContext);
  useEffect(() => {
    if (jqlString) {
      const fieldIds = getFieldIds(issueFields);
      const fetchFilteredIssues = async () => {
        try {
          const issues = await api.searchIssues(
            jqlString,
            0,
            undefined,
            fieldIds
          );
          console.log("from table!!!!", issues);
          console.log(issues);
          setFilteredIssues(issues);
        } catch (error) {
          handleNewError(error);
        }
      };
      fetchFilteredIssues();
    }
  }, [jqlString]);
  if (Boolean(jqlString) && filteredIssues != null) {
    return (
      <Container>
        <Table />
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
        <em>Please select filter to view table</em>
      </Container>
    );
  }
};
