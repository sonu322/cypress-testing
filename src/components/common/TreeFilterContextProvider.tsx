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
    setFilter(filter);
  };

  const updateLastSavedInLocalStorage = (newFilter: IssueTreeFilter): void => {
    console.log("new filter set in local storage", newFilter);
    if (newFilter !== undefined) {
      console.log("new filter being set in local storage");
      const lastSavedConfig = getItemInLocalStorage(localStorageKey);
      const newSavedConfig = { ...lastSavedConfig, treeFilter: newFilter };
      setItemInLocalStorage(localStorageKey, newSavedConfig);
    }
  };
  const assignLastSavedTreeFilter = (): void => {
    console.log("setting filter");
    const lastSavedConfig = getItemInLocalStorage(localStorageKey);
    console.log("lastsavedconfig", lastSavedConfig);
    if (lastSavedConfig?.treeFilter !== undefined) {
      console.log("setting last");
      setFilter(lastSavedConfig.treeFilter);
    } else {
      console.log("setting default");
      setFilter({ priorities: [], issueTypes: [], linkTypes: [] });
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
      console.log("handle initial updater called");
      console.log("newfilter", newFilter);
      const lastSavedConfig = getItemInLocalStorage(localStorageKey);
      if (
        lastSavedConfig?.treeFilter !== undefined ||
        lastSavedConfig?.treeFilter !== null
      ) {
        assignLastSavedTreeFilter();
      } else {
        console.log("setting new defautl filter");
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
