import { createContext } from "react";
import { treeFilterDropdowns } from "../constants/common";
import {
  IssueLinkType,
  IssuePriority,
  IssueTreeFilter,
  IssueType,
} from "../types/api";

export interface TreeFilterContextValue {
  isOptionsDataLoading: boolean;
  updateIsOptionsDataLoading: (isOptionsDataLoading: boolean) => void;
  labels: Array<{
    key: string;
    label: string;
  }>;
  filter: {
    issueTypes: any[];
    linkTypes: any[];
    priorities: any[];
  };
  updateFilter: (
    filter:
      | {
          priorities: string[];
          issueTypes: string[];
          linkTypes: string[];
        }
      | ((prevFilter: IssueTreeFilter) => IssueTreeFilter)
  ) => void;
  options: {
    issueTypes: IssueType[];
    linkTypes: IssueLinkType[];
    priorities: IssuePriority[];
  };
  updateOptions: (options: {
    priorities: IssuePriority[];
    issueTypes: IssueType[];
    linkTypes: IssueLinkType[];
  }) => void;
  errors: unknown[];
  handleError: (error: unknown) => void;
}
export const TreeFilterContext = createContext<TreeFilterContextValue>({
  isOptionsDataLoading: false,
  updateIsOptionsDataLoading: (_isOptionsDataLoading) => {},
  labels: treeFilterDropdowns,
  filter: {
    issueTypes: [],
    linkTypes: [],
    priorities: [],
  },
  updateFilter: (_filter) => {},
  options: {
    issueTypes: [],
    linkTypes: [],
    priorities: [],
  },
  updateOptions: (_options) => {},
  errors: [],
  handleError: (_error) => {},
});
