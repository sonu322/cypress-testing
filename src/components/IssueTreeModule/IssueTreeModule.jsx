import React, { useEffect, useState } from "react";
import { IssueTypeAPI, LinkTypeAPI, PriorityAPI } from "../api";
import { Toolbar } from "./Toolbar";
export const IssueTreeModule = () => {
  const [options, setOptions] = useState({});
  const [filter, setFilter] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      Promise.all([PriorityAPI(), LinkTypeAPI(), IssueTypeAPI()]).then(
        (results) => {
          const optionsData = {
            priorities: results[0],
            linkTypes: results[1],
            issueTypes: results[2],
          };
          setOptions(optionsData);
          const ids = {
            priorities: optionsData.priorities.map((item) => item.id),
            linkTypes: optionsData.linkTypes.map((item) => item.id),
            issueTypes: optionsData.issueTypes.map((item) => item.id),
          };
          setFilter(ids);
        }
      );
    };
    fetchData();
  }, []);
  const updateFilteredKeyOptions = (key, keyOptions) => {
    let newFilter = { ...filter };
    newFilter[key] = keyOptions;
    setFilter(newFilter);
  };
  return (
    <div>
      <Toolbar
        options={options}
        filter={filter}
        updateFilteredKeyOptions={updateFilteredKeyOptions}
        keyNames={["priorities", "linkTypes", "issueTypes"]}
      />
      {Object.keys(filter).map((keyName) => (
        <div key={keyName}>
          ---
          {filter[keyName].map((item) => (
            <div key={item}>
              {keyName}:{item}
            </div>
          ))}
          ---
        </div>
      ))}
    </div>
  );
};
