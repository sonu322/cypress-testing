import React, { useEffect, useState } from "react";
import {
  IssueTypeAPI,
  LinkTypeAPI,
  PriorityAPI,
  IssueFieldsAPI,
  ProjectAPI,
} from "../api";
import { Toolbar } from "./Toolbar";
import { IssueTree } from "./IssueTree";
import { mutateTree } from "@atlaskit/tree";
import { ErrorsList } from "../ErrorsList";
import { exportTree } from "../../util/issueTreeUtils";

let root = {
  rootId: "0",
  items: {
    0: {
      id: "0",
      children: [],
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        title: "Fake Root Node",
      },
    },
  },
};
const fixedFieldNames = [
  "summary",
  "subtasks",
  "parent",
  "issuelinks",
  "status",
  "resolution",
];
export const IssueTreeModule = () => {
  const [errors, setErrors] = useState([]);
  const [options, setOptions] = useState({});
  const [filter, setFilter] = useState({});
  const [tree, setTree] = useState(mutateTree(root, "0", { isExpanded: true }));
  const [issueFields, setIssueFields] = useState([]);
  const [selectedIssueFieldIds, setSelectedIssueFieldIds] = useState([]);
  const handleSingleError = (error) => {
    setErrors((prevErrors) => [...prevErrors, error]);
  };
  useEffect(() => {
    const handleFetchedOptions = (dropdownName, dropdownOptions) => {
      console.log(dropdownName, dropdownOptions);
      setOptions((prevOptions) => {
        let newOptions = { ...prevOptions };
        newOptions[dropdownName] = dropdownOptions;
        return newOptions;
      });
      const ids = dropdownOptions.map((option) => option.id);
      setFilter((prevFilter) => {
        let newFilter = { ...prevFilter };
        newFilter[dropdownName] = ids;
        return newFilter;
      });
    };
    const fetchPriorities = async () => {
      try {
        let response = await PriorityAPI();
        handleFetchedOptions("priorities", response);
        return response;
      } catch (error) {
        console.log("catche caleld priorities");
        console.log(error);
        handleSingleError(error);
      }
    };
    const fetchIssueTypes = async () => {
      try {
        let response = await IssueTypeAPI();
        console.log("issue types");
        console.log(response);
        handleFetchedOptions("issueTypes", response);
        return response;
      } catch (error) {
        console.log("catche caleld");
        console.log(error);
        handleSingleError(error);
      }
    };
    const fetchLinkTypes = async () => {
      try {
        let response = await LinkTypeAPI();
        handleFetchedOptions("linkTypes", response);
        return response;
      } catch (error) {
        console.log("catche caleld");
        console.log(error);
        handleSingleError(error);
      }
    };

    const fetchFieldsData = async () => {
      let promises = [
        ProjectAPI().catch((err) => handleSingleError(err)),
        IssueFieldsAPI(),
      ];
      try {
        let [project, results] = await Promise.all(promises);
        const newResults = results.map((result) => {
          if (result.key.includes("customfield_")) {
            result.customKey = result.name
              .replace(/[\s, -]/g, "")
              .toLowerCase();
          } else {
            result.customKey = result.key;
          }
          return result;
        });
        const fieldNames = [
          ...fixedFieldNames,
          "issuetype",
          "priority",
          "status",
          "assignee",
        ];

        if (project) {
          if (project.style == "classic") {
            fieldNames.push("storypoints");
          } else {
            fieldNames.push("storypointestimate");
          }
        }
        let selectedFieldIds = [];
        let fieldsMap = new Map();
        fieldNames.forEach((name) => {
          const field = newResults.find((result) => result.customKey == name);
          if (field) {
            // fieldsMap.push(field);
            fieldsMap.set(field.customKey, field);
            if (!fixedFieldNames.includes(name)) {
              selectedFieldIds.push(field.id);
            }
          }
        });
        setIssueFields(fieldsMap);
        setSelectedIssueFieldIds(selectedFieldIds);
      } catch (error) {
        handleSingleError(error);
      }
    };
    let issueTypes = fetchIssueTypes();
    console.log("returned issuetypes");
    console.log(issueTypes);
    let linkTypes = fetchLinkTypes();
    let priorities = fetchPriorities();
    {
      issueTypes &&
        issueTypes.length &&
        setOptions((prevOptions) => {
          console.log("setting options issueTypes");
          console.log(issueTypes);
          return {
            ...prevOptions,
            issueTypes: issueTypes,
          };
        });
    }
    {
      linkTypes &&
        linkTypes.length &&
        setOptions((prevOptions) => ({ ...prevOptions, linkTypes: linkTypes }));
    }
    {
      priorities &&
        priorities.length &&
        setOptions((prevOptions) => ({
          ...prevOptions,
          priorities: priorities,
        }));
    }
    fetchFieldsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const updateFilteredKeyOptions = (key, keyOptions) => {
    let newFilter = { ...filter };
    newFilter[key] = keyOptions;
    setFilter(newFilter);
  };
  let issueCardOptions = new Map(issueFields);
  for (let fieldId of issueCardOptions.keys()) {
    if (fixedFieldNames.includes(fieldId)) {
      issueCardOptions.delete(fieldId);
    }
  }

  return (
    <div>
      {errors && <ErrorsList errors={errors} />}

      <Toolbar
        exportTree={() => exportTree(tree)}
        options={options}
        filter={filter}
        updateFilteredKeyOptions={updateFilteredKeyOptions}
        keyNames={["priorities", "linkTypes", "issueTypes"]}
        issueCardOptionsMap={issueCardOptions}
        selectedIssueFieldIds={selectedIssueFieldIds}
        setSelectedIssueFieldIds={setSelectedIssueFieldIds}
      />
      <IssueTree
        tree={tree}
        setTree={setTree}
        filter={filter}
        // root={root}
        issueCardOptionsMap={issueCardOptions}
        selectedIssueFieldIds={selectedIssueFieldIds}
        issueFields={issueFields}
        cardFields={options}
        handleError={handleSingleError}
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
