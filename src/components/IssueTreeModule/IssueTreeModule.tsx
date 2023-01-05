import React, { useEffect, useState, useContext } from "react";
import { Toolbar } from "./Toolbar";
import { IssueTreeSingleNode } from "./IssueTreeSingleNode";
import { ErrorsList } from "../common/ErrorsList";
import TreeUtils from "../../util/TreeUtils";
import { APIContext } from "../../context/api";
import { IssueField } from "../../types/api";
import { useTranslation } from "react-i18next";
import { TreeFilterContext } from "../../context/treeFilterContext";
export const IssueTreeModule = () => {
  const treeFilterContext = useContext(TreeFilterContext);
  const { t } = useTranslation();
  const api = useContext(APIContext);
  const treeUtils = new TreeUtils(api);

  const [isLoading, setIsLoading] = useState(true);
  const [isExpandAllLoading, setIsExpandAllLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [tree, setTree] = useState(treeUtils.getRootTree());
  const [issueFields, setIssueFields] = useState<IssueField[]>([]);
  const [selectedIssueFieldIds, setSelectedIssueFieldIds] = useState<string[]>(
    []
  );
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
      updateSelectedIssueFieldIds,
      updateIssueFields,
      updateIsLoading,
      handleNewError
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFilteredKeyOptions = (
    key: string,
    keyOptions: string[]
  ): void => {
    treeFilterContext.updateFilter((prevFilter) => {
      const newFilter = { ...prevFilter };
      newFilter[key] = keyOptions;
      return newFilter;
    });
  };
  const allErrors = errors.concat(treeFilterContext.errors);
  return isLoading ? (
    <div>{t("lxp.common.loading")}.</div>
  ) : (
    <div>
      {allErrors !== undefined && allErrors.length > 0 && (
        <ErrorsList errors={errors} />
      )}

      <Toolbar
        exportTree={() => treeUtils.exportTree(tree)}
        isExportDisabled={
          tree?.items !== undefined && Object.keys(tree.items).length <= 1
        }
        options={treeFilterContext.options}
        filter={treeFilterContext.filter}
        updateFilteredKeyOptions={updateFilteredKeyOptions}
        filterDropdowns={treeFilterContext.labels}
        issueCardOptions={issueFields}
        selectedIssueFieldIds={selectedIssueFieldIds}
        setSelectedIssueFieldIds={setSelectedIssueFieldIds}
        collapseAll={() => treeUtils.collapseAll(setTree)}
        isExpandAllLoading={isExpandAllLoading}
        expandAll={() => treeUtils.expandAll(treeFilterContext.filter, issueFields, setTree, handleNewError, clearAllErrors, setIsExpandAllLoading)}
      />
      <IssueTreeSingleNode
        tree={tree}
        treeUtils={treeUtils}
        setTree={setTree}
        filter={treeFilterContext.filter}
        issueFields={issueFields}
        selectedIssueFieldIds={selectedIssueFieldIds}
        handleError={handleNewError}
        clearAllErrors={clearAllErrors}
      />
    </div>
  );
};
