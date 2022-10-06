import React, { useState } from "react";
import { Toolbar } from "./Toolbar";
export const IssueTreeModule = () => {
  const [filter, setFilter] = useState({
    priorities: [],
    issueTypes: [],
    linkTypes: [],
  });

  const updateFilteredKeyOptions = (key, keyOptions) => {
    
    let newFilter = { ...filter };
    newFilter[key] = keyOptions;
    setFilter(newFilter);
    console.log(JSON.stringify(filter));
  };
  return (

    <div>
      <Toolbar
        filter={filter}
        updateFilteredKeyOptions={updateFilteredKeyOptions}
      />
      {console.log(filter)}
      {Object.keys(filter).map((key) => (
        <div key={key}>
          {" "}
          ---
          {filter[key].map((item) => (
            <div key={item}>
              {key}:{item}
            </div>
          ))}
          ---
        </div>
      ))}
    </div>
  );
};
