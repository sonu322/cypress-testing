import React, { useContext, useEffect, useState, useRef } from "react";
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

interface Props {
  children: any;
  localStorageKey?: string;
}
export const TreeFilterContextProvider = ({
  children,
  localStorageKey,
}: Props): JSX.Element => {
  const isMounted = useRef(true);
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
    if (newFilter !== undefined && localStorageKey !== undefined) {
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
    if (isMounted.current) {
      setOptions(options);
    }
  };

  const updateIsLoading = (isLoading: boolean): void => {
    if (isMounted.current) {
      setIsLoading(isLoading);
    }
  };
  const handleNewError = (error: unknown): void => {
    if (isMounted.current) {
      setErrors((prevErrors) => [...prevErrors, error] as any);
    }
  };

  useEffect(() => {
    const handleInitialUpdateFilter = (newFilter: IssueTreeFilter): void => {
      const store = getItemInLocalStorage(localStorageKey);
      if (!isMounted.current) {
        return;
      }
      if (store !== null) {
        const storedFilter = store.treeFilter;
        if (storedFilter !== undefined && storedFilter !== null) {
          updateFilter(store.treeFilter);
        } else {
          updateFilter(newFilter);
        }
      } else {
        updateFilter(newFilter);
      }
    };
    const loadData = async (): Promise<void> => {
      const request = await treeUtils.loadTreeFilterDropdownsData(
        handleInitialUpdateFilter,
        updateOptions,
        updateIsLoading,
        handleNewError
      );
      return request;
    };
    if (isMounted.current) {
      void loadData();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (isMounted.current) {
      updateLastSavedInLocalStorage(filter);
    }
    return () => {
      isMounted.current = false;
    };
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
