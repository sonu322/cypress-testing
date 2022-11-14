import React, { useEffect, useState, useContext } from "react";
import { Toolbar } from "./Toolbar";
import { IssueTree } from "./IssueTree";
import { ErrorsList } from "../common/ErrorsList";
import TreeUtils from "../../util/TreeUtils";
import { APIContext } from "../../context/api";
import { IssueField, IssueTreeFilter } from "../../types/api";
import { useTranslation } from "react-i18next";
export const IssueTreeModule = () => {
  const { t, i18n } = useTranslation();
  const api = useContext(APIContext);
  const treeUtils = new TreeUtils(api);

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [options, setOptions] = useState({});
  const [filter, setFilter] = useState<IssueTreeFilter>({
    priorities: [],
    issueTypes: [],
    linkTypes: [],
  });
  const [tree, setTree] = useState(treeUtils.getRootTree());
  const [issueFields, setIssueFields] = useState<IssueField[]>([]);
  const [selectedIssueFieldIds, setSelectedIssueFieldIds] = useState<string[]>(
    []
  );

  const handleNewError = (error) => {
    setErrors((prevErrors) => [...prevErrors, error] as any);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await Promise.all([
          api.getPriorities(),
          api.getIssueTypes(),
          api.getIssueLinkTypes(),
          api.getIssueFields(),
        ]);

        const priorities = result[0],
          issueTypes = result[1],
          linkTypes = result[2],
          fields = result[3];

        const filterObj = {
          priorities: priorities.map((option) => option.id),
          issueTypes: issueTypes.map((option) => option.id),
          linkTypes: linkTypes.map((option) => option.id),
        };
        setFilter(filterObj);
        setOptions({ priorities, issueTypes, linkTypes });

        const selectedFieldIds = fields.map((field) => field.id);
        setSelectedIssueFieldIds(selectedFieldIds);
        setIssueFields(fields);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        handleNewError(error);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFilteredKeyOptions = (key, keyOptions) => {
    setFilter((prevFilter) => {
      let newFilter = { ...prevFilter };
      newFilter[key] = keyOptions;
      return newFilter;
    });
  };
  // console.log("LOGGED!!!");
  // console.log(Locale.getDefault().getLanguage());

  const filterDropdowns = [
    { key: "priorities", label: t("lxp.common.issue.priority") },
    { key: "linkTypes", label: t("lxp.toolbar.link-type.text") },
    { key: "issueTypes", label: t("lxp.toolbar.issue-type.text") },
  ];

  return isLoading ? (
    <div>Loading data ...</div>
  ) : (
    <div>
      {errors && errors.length > 0 && <ErrorsList errors={errors} />}

      <Toolbar
        exportTree={() => treeUtils.exportTree(tree)}
        options={options}
        filter={filter}
        updateFilteredKeyOptions={updateFilteredKeyOptions}
        filterDropdowns={filterDropdowns}
        issueCardOptions={issueFields}
        selectedIssueFieldIds={selectedIssueFieldIds}
        setSelectedIssueFieldIds={setSelectedIssueFieldIds}
      />
      <IssueTree
        tree={tree}
        treeUtils={treeUtils}
        setTree={setTree}
        filter={filter}
        issueFields={issueFields}
        selectedIssueFieldIds={selectedIssueFieldIds}
        handleError={handleNewError}
      />
    </div>
  );
};
