import React, { useContext, useEffect, useState } from "react";
import { treeFilterDropdowns } from "../../constants/common";
import { APIContext } from "../../context/api";
import {
  TreeFilterContext,
  TreeFilterContextValue,
} from "../../context/treeFilterContext";
import {
  IssueLinkType,
  IssuePriority,
  IssueTreeFilter,
  IssueType,
} from "../../types/api";
import {
  getItemInLocalStorage,
  setItemInLocalStorage,
} from "../../util/common";
import TreeUtils from "../../util/TreeUtils";

export const TreeFilterContextProvider = ({
  children,
  localStorageKey,
}): JSX.Element => {
  const api = useContext(APIContext);
  // TODO: fix type
  const treeUtils = new TreeUtils(api);

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [options, setOptions] = useState<{
    priorities: IssuePriority[];
    issueTypes: IssueType[];
    linkTypes: IssueLinkType[];
  }>();
  const [filter, setFilter] = useState<IssueTreeFilter>();
  const updateFilter = (
    filter:
      | {
          priorities: string[];
          issueTypes: string[];
          linkTypes: string[];
        }
      | ((prevFilter: IssueTreeFilter) => IssueTreeFilter)
  ): void => {
    console.log("filter from update filter", filter);
    setFilter(filter);
  };

  const updateLastSavedInLocalStorage = (newFilter: IssueTreeFilter): void => {
    if (newFilter !== undefined) {
      const lastSavedConfig = getItemInLocalStorage(localStorageKey);
      const newSavedConfig = { ...lastSavedConfig, treeFilter: newFilter };
      setItemInLocalStorage(localStorageKey, newSavedConfig);
    }
  };

  const updateOptions = (options: {
    priorities: IssuePriority[];
    issueTypes: IssueType[];
    linkTypes: IssueLinkType[];
  }): void => {
    setOptions(options);
  };

  const updateIsLoading = (isLoading: boolean): void => {
    setIsLoading(isLoading);
  };
  const handleNewError = (error: unknown): void => {
    setErrors((prevErrors) => [...prevErrors, error] as any);
  };

  useEffect(() => {
    console.log(localStorageKey);
    const handleInitialUpdateFilter = (newFilter: IssueTreeFilter): void => {
      const store = getItemInLocalStorage(localStorageKey);
      console.log("from handleInitialUpdateFilter");
      console.log(store);
      if (store !== null) {
        console.log("store is not null");
        const storedFilter = store.treeFilter;
        if (storedFilter !== undefined && storedFilter !== null) {
          console.log("tree filter is not null");
          console.log(store.treeFilter);
          updateFilter(store.treeFilter);
        } else {
          console.log("setting normal filter");
          updateFilter(newFilter);
        }
      } else {
        updateFilter(newFilter);
      }
    };
    void treeUtils.loadTreeFilterDropdownsData(
      handleInitialUpdateFilter,
      updateOptions,
      updateIsLoading,
      handleNewError
    );
  }, []);
  useEffect(() => {
    updateLastSavedInLocalStorage(filter);
  }, [filter]);
  const contextValue: TreeFilterContextValue = {
    errors,
    handleError: handleNewError,
    filter,
    updateFilter,
    isOptionsDataLoading: isLoading,
    updateIsOptionsDataLoading: updateIsLoading,
    labels: treeFilterDropdowns,
    options,
    updateOptions,
  };
  return (
    <TreeFilterContext.Provider value={contextValue}>
      {children}
    </TreeFilterContext.Provider>
  );
};
