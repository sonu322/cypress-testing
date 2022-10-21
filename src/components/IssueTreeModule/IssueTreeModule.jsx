import React, { useEffect, useState, useContext } from "react";
import { Toolbar } from "./Toolbar";
import { IssueTree } from "./IssueTree";
import { mutateTree } from "@atlaskit/tree";
import { ErrorsList } from "../ErrorsList";
import { exportTree } from "../../util/issueTreeUtils";
import { APIContext } from "../../context/api";

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
  const api = useContext(APIContext)
  const [errors, setErrors] = useState([]);
  const [options, setOptions] = useState({});
  const [filter, setFilter] = useState({});
  const [tree, setTree] = useState(mutateTree(root, "0", { isExpanded: true }));
  const [issueFields, setIssueFields] = useState([]);
  const [selectedIssueFieldIds, setSelectedIssueFieldIds] = useState([]);
  const handleNewError = (error) => {
    setErrors((prevErrors) => [...prevErrors, error]);
  };
  useEffect(() => {
    const handleFetchedOptions = (dropdownName, dropdownOptions) => {
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
        let response = await api.getPriorities();
        handleFetchedOptions("priorities", response);
        return response;
      } catch (error) {
        handleNewError(error);
      }
    };
    const fetchIssueTypes = async () => {
      try {
        let response = await api.getIssueTypes();
        handleFetchedOptions("issueTypes", response);
        return response;
      } catch (error) {
        handleNewError(error);
      }
    };
    const fetchLinkTypes = async () => {
      try {
        let response = await api.getIssueLinkTypes();
        handleFetchedOptions("linkTypes", response);
        return response;
      } catch (error) {
        handleNewError(error);
      }
    };

    const fetchFieldsData = async () => {
      let promises = [
        api.getCurrentProject().catch((err) => handleNewError(err)),
        api.getIssueFields(),
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
            fieldsMap.set(field.customKey, field);
            if (!fixedFieldNames.includes(name)) {
              selectedFieldIds.push(field.id);
            }
          }
        });
        setIssueFields(fieldsMap);
        setSelectedIssueFieldIds(selectedFieldIds);
      } catch (error) {
        handleNewError(error);
      }
    };
    fetchIssueTypes();
    fetchLinkTypes();
    fetchPriorities();
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
        handleError={handleNewError}
      />
    </div>
  );
};
