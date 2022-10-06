import React, { useState } from "react";
import { Toolbar } from "./Toolbar";
export const IssueTreeModule = () => {
  const [options, setOptions] = useState({});
  const [filter, setFilter] = useState({});

  const updateKeyOptions = (key, keyOptions) => {
    let newOptions = { ...options };
    newOptions[key] = keyOptions;
    console.log("see change!!!!!!!!!!!!!");
    console.log("old:");
    console.log(options);
    console.log("new:");
    console.log(newOptions);
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
