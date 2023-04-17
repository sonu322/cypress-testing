import React from "react";
import { SearchableSelect } from "./SearchableSelect";

interface Props {
  isMultiValued: boolean;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const IssueSearchField = ({
  isMultiValued,
  onSearch,
  searchQuery,
}: Props): JSX.Element => {
  return (
    <div>
      <SearchableSelect
        isMultiValued={isMultiValued}
        onSearch={onSearch}
        searchQuery={searchQuery}
      />
    </div>
  );
};
