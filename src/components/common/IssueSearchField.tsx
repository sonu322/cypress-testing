import React, { useContext, useState } from "react";
import { SearchableSelect } from "./SearchableSelect";
import { APIContext } from "../../context/api";
import { Issue } from "../../types/api";
interface Props {
  isMultiValued: boolean;
  onSearch: (query: string) => void;
  searchQuery: string;
  onChange: (issueKeys: string[]) => void;
}

export const IssueSearchField = ({
  isMultiValued,
  searchQuery,
  onChange,
}: Props): JSX.Element => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const api = useContext(APIContext);
  let issues: Issue[] = [];
  const handleInputChange = async (inputValue: string) => {
    setInputValue(inputValue);
    console.log("input valueeee", inputValue);
    const searchByKeyPromise = api.searchIssues(
      `issueKey = "${inputValue.toUpperCase()}"`
    );
    const searchBySummaryPromise = api.searchIssues(
      `summary ~ "${inputValue}"`
    );
    Promise.allSettled([searchByKeyPromise, searchBySummaryPromise])
      .then((results) => {
        const resolvedPromise1 =
          results[0].status === "fulfilled" ? results[0].value : null;
        const resolvedPromise2 =
          results[1].status === "fulfilled" ? results[1].value : null;

        if (resolvedPromise1 !== null) {
          issues = issues.concat(resolvedPromise1.data);
        }
        if (resolvedPromise2 !== null) {
          issues = issues.concat(resolvedPromise2.data);
        }
        const allOptions = issues.map((issue) => ({
          label: `${issue.issueKey} ${issue.summary}`,
          value: issue.issueKey,
        }));
        setOptions(allOptions);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <SearchableSelect
        isMultiValued={isMultiValued}
        inputValue={inputValue}
        onSearch={handleInputChange}
        options={options}
        searchQuery={searchQuery}
        onChange={onChange}
      />
    </div>
  );
};
