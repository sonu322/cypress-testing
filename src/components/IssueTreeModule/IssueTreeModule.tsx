import React, { useEffect, useState, useContext } from "react";
import { Toolbar } from "./Toolbar";
import { IssueTreeSingleNode } from "./IssueTreeSingleNode";
import { ErrorsList } from "../common/ErrorsList";
import TreeUtils from "../../util/TreeUtils";
import { APIContext } from "../../context/api";
import { IssueField, IssueTreeFilter } from "../../types/api";
import { useTranslation } from "react-i18next";
export const IssueTreeModule = () => {
  const { t } = useTranslation();
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
  const updateFilter = (filter: {
    priorities: string[];
    issueTypes: string[];
    linkTypes: string[];
  }): void => {
    setFilter(filter);
  };

  const updateOptions = (options: {
    priorities: IssuePriority[];
    issueTypes: IssueType[];
    linkTypes: IssueLinkType[];
  }): void => {
    setOptions(options);
  };

  const updateSelectedIssueFieldIds = (
    selectedIssueFieldIds: string[]
  ): void => {
    setSelectedIssueFieldIds(selectedIssueFieldIds);
  };

  const updateIssueFields = (issueFields: IssueField[]): void => {
    setIssueFields(issueFields);
  };

  const updateIsLoading = (isLoading: boolean): void => {
    setIsLoading(isLoading);
  };
  const handleNewError = (error: unknown): void => {
    setErrors((prevErrors) => [...prevErrors, error] as any);
  };
  const clearAllErrors = (): void => {
    setErrors([]);
  };

  useEffect(() => {
    // const loadToolbarData = async () => {
    //   try {
    //     const result = await Promise.all([
    //       api.getPriorities(),
    //       api.getIssueTypes(),
    //       api.getIssueLinkTypes(),
    //       api.getIssueFields(),
    //     ]);

    //     const priorities = result[0],
    //       issueTypes = result[1],
    //       linkTypes = result[2],
    //       fields = result[3];

    //     const filterObj = {
    //       priorities: priorities.map((option) => option.id),
    //       issueTypes: issueTypes.map((option) => option.id),
    //       linkTypes: linkTypes.map((option) => option.id),
    //     };
    //     setFilter(filterObj);
    //     setOptions({ priorities, issueTypes, linkTypes });

    //     const selectedFieldIds = fields.map((field) => field.id);
    //     setSelectedIssueFieldIds(selectedFieldIds);
    //     setIssueFields(fields);
    //     setIsLoading(false);
    //   } catch (error) {
    //     setIsLoading(false);
    //     handleNewError(error);
    //   }
    // };
    void treeUtils.loadToolbarData(
      updateFilter,
      updateOptions,
      updateSelectedIssueFieldIds,
      updateIssueFields,
      updateIsLoading,
      handleNewError
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFilteredKeyOptions = (key, keyOptions) => {
    setFilter((prevFilter) => {
      let newFilter = { ...prevFilter };
      newFilter[key] = keyOptions;
      return newFilter;
    });
  };

  const filterDropdowns = [
    { key: "priorities", label: t("lxp.common.issue.priority") },
    { key: "linkTypes", label: t("lxp.toolbar.link-type.text") },
    { key: "issueTypes", label: t("lxp.toolbar.issue-type.text") },
  ];

  return isLoading ? (
    <div>{t("lxp.common.loading")}.</div>
  ) : (
    <div>
      {errors && errors.length > 0 && <ErrorsList errors={errors} />}

      <Toolbar
        exportTree={() => treeUtils.exportTree(tree)}
        isExportDisabled={
          tree?.items !== undefined && Object.keys(tree.items).length <= 1
        }
        options={options}
        filter={filter}
        updateFilteredKeyOptions={updateFilteredKeyOptions}
        filterDropdowns={filterDropdowns}
        issueCardOptions={issueFields}
        selectedIssueFieldIds={selectedIssueFieldIds}
        setSelectedIssueFieldIds={setSelectedIssueFieldIds}
      />
      <IssueTreeSingleNode
        tree={tree}
        treeUtils={treeUtils}
        setTree={setTree}
        filter={filter}
        issueFields={issueFields}
        selectedIssueFieldIds={selectedIssueFieldIds}
        handleError={handleNewError}
        clearAllErrors={clearAllErrors}
      />
    </div>
  );
};
