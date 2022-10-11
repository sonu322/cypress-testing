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
const fixedFieldNames = ["summary", "subtasks", "parent", "issuelinks", "status"];
export const IssueTreeModule = () => {
  const [options, setOptions] = useState({});
  const [filter, setFilter] = useState({});
  const [tree, setTree] = useState(mutateTree(root, "0", { isExpanded: true }));
  const [isFetched, setIsFetched] = useState(false);
  const [issueFields, setIssueFields] = useState([]);
  const [selectedIssueFields, setSelectedIssueFields] = useState([]);
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

    return contents;
  };
  useEffect(() => {
    const fetchDropdownsData = async () => {
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
    fetchDropdownsData();
  }, []);
  useEffect(() => {
    const fetchFieldsData = async () => {
      Promise.all([ProjectAPI(), IssueFieldsAPI()]).then(
        ([project, results]) => {
          console.log("fields!!!");
          console.log(results);
          const newResults = results.map((result) => {
            if (result.key.includes("customfield_")) {
              console.log("custom!!!");
              result.customKey = result.name
                .replace(/[\s, -]/g, "")
                .toLowerCase();
              console.log(result.key, result.name, result.customKey);
            } else {
              result.customKey = result.key;
            }
            return result;
          });
          // setIssueFields(newResults);
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
          // const selectedFields = fieldNames.map((name) => {
          //   const field = newResults.find((result) => result.customKey == name);
          //   if (field) {
          //     return field.customKey;
          //   } // useforeach
          // });
          let selectedFields = [];
          let allOptions = [];
          fieldNames.forEach((name) => {
            const field = newResults.find((result) => result.customKey == name);
            if (field) {
              allOptions.push(field);
              if (!fixedFieldNames.includes(name)) {
                selectedFields.push(field.key);
              }
            }
          });
          console.log("selected");
          console.log(selectedFields);
          console.log(allOptions);
          setIssueFields(allOptions);
          setSelectedIssueFields(selectedFields);
        }
      );
    };
    fetchFieldsData();
  }, []);

  const updateFilteredKeyOptions = (key, keyOptions) => {
    let newFilter = { ...filter };
    newFilter[key] = keyOptions;
    setFilter(newFilter);
  };
  const issueCardOptions = issueFields.filter(
    (field) => !fixedFieldNames.includes(field.customKey)
  );
  return (
    <div>
      <Toolbar
        exportTree={exportTree}
        options={options}
        filter={filter}
        updateFilteredKeyOptions={updateFilteredKeyOptions}
        keyNames={["priorities", "linkTypes", "issueTypes"]}
        issueFields={issueCardOptions}
        selectedIssueFields={selectedIssueFields}
        setSelectedIssueFields={setSelectedIssueFields}
      />
      <IssueTree
        tree={tree}
        setTree={setTree}
        isFetched={isFetched}
        setIsFetched={setIsFetched}
        filter={filter}
        root={root}
        selectedIssueFields={selectedIssueFields}
        issueFields={issueFields}
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
