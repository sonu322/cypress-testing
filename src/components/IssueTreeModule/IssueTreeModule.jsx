import React, {useEffect, useState } from "react";
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
import { download, csv } from "../../util";
import { ErrorsList } from "../ErrorsList";
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
  const [isFetched, setIsFetched] = useState(false);
  const [issueFields, setIssueFields] = useState([]);
  const [selectedIssueFieldIds, setSelectedIssueFieldIds] = useState([]);
  const handleSingleError = (error) => {
    setErrors([...errors, error]);
  };

  const exportTree = () => {
    const root = tree.items[tree.rootId];
    const rootChildren = root.children;

    const contents = [];

    const process = (item, indent) => {
      if (!item) return;
      const content = {
        indent: indent,
        key: "",
        link: "",
        summary: "",
        type: "",
        status: "",
        priority: "",
      };

      if (item.data) {
        const data = item.data;
        if (data.isType) {
          content.link = data.title;
        } else {
          content.key = data.title;
          content.summary = data.summary;
          content.type = data.type.name;
          content.status = data.status.name;
          content.priority = data.priority.name;
        }
      }

      contents.push(content);
      if (item.hasChildren) {
        const nextIndent = indent + 1;
        item.children.forEach((key) => {
          process(tree.items[key], nextIndent);
        });
      }
    };

    process(tree.items[rootChildren[0]], 1);
    download("csv", csv(contents, true));

    // return contents;
  };
  useEffect(() => {
    const handleMultipleErrors = (newErrors) => {
      newErrors = errors.concat(newErrors);
      setErrors(newErrors);
    };
    const fetchDropdownsData = async () => {
      Promise.all([PriorityAPI(), LinkTypeAPI(), IssueTypeAPI()])
        .then((results) => {
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
        })
        .catch((newErrors) => {
          handleMultipleErrors(newErrors);
        });
    };
    const fetchFieldsData = async () => {
      Promise.all([ProjectAPI(), IssueFieldsAPI()])
        .then(([project, results]) => {
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

          if (project.style == "classic") {
            fieldNames.push("storypoints");
          } else {
            fieldNames.push("storypointestimate");
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
        })
        .catch((errors) => {
          handleMultipleErrors(errors);
        });
    };
    fetchDropdownsData();
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
        exportTree={exportTree}
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
        isFetched={isFetched}
        setIsFetched={setIsFetched}
        filter={filter}
        root={root}
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
