import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../../context/api";
import { Issue } from "../../types/api";
import { getFieldIds } from "../../util";
export const Table = ({
  jqlString,
  handleNewError,
  issueFields,
  selectedIssueFieldIds,
  selectedTableFieldIds,
}) => {
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>();
  const api = useContext(APIContext);
  useEffect(() => {
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
  }, [jqlString]);
  return (
    <div>
      <div>
        <div>{jqlString}</div>
        <div>......</div>
        <div>{filteredIssues?.map((issue) => issue.id)}</div>
      </div>
    </div>
  );
};
