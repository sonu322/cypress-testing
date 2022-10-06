import React, { useState } from "react";
import { Toolbar } from "./Toolbar";
export const IssueTreeModule = () => {
  const [options, setOptions] = useState({
    issueTypes: [],
    linkTypes: [],
    priorities: [],
  });
  const [filter, setFilter] = useState({
    issueTypes: [],
    linkTypes: [],
    priorities: [],
  });
  const updateKeyOptions = (key, keyOptions) => {
    let newOptions = { ...options };
    newOptions[key] = keyOptions;
    setOptions(newOptions);
  };
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
        updateKeyOptions={updateKeyOptions}
        updateFilteredKeyOptions={updateFilteredKeyOptions}
      />
    </div>
  );
};
