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
import TreeUtils from "../../util/TreeUtils";

export const TreeFilterContextProvider = ({ children }): JSX.Element => {
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
    void treeUtils.loadTreeFilterDropdownsData(
      updateFilter,
      updateOptions,
      updateIsLoading,
      handleNewError
    );
  }, []);
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
