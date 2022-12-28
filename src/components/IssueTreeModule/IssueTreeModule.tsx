import React, { useEffect, useState, useContext } from "react";
import { Toolbar } from "./Toolbar";
import { IssueTreeSingleNode } from "./IssueTreeSingleNode";
import { ErrorsList } from "../common/ErrorsList";
import TreeUtils from "../../util/TreeUtils";
import { APIContext } from "../../context/api";
import {
  IssueField,
  IssueLinkType,
  IssuePriority,
  IssueTreeFilter,
  IssueType,
} from "../../types/api";
import { useTranslation } from "react-i18next";
import { treeFilterDropdowns } from "../../constants/common";
export const IssueTreeModule = () => {
  const { t } = useTranslation();
  const api = useContext(APIContext);
  const treeUtils = new TreeUtils(api);

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [options, setOptions] = useState<{
    priorities: IssuePriority[];
    issueTypes: IssueType[];
    linkTypes: IssueLinkType[];
  }>({ priorities: [], issueTypes: [], linkTypes: [] });
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
        filterDropdowns={treeFilterDropdowns}
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
