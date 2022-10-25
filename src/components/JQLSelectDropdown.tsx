import React, { useEffect, useState, useContext } from "react";
import Button, { ButtonGroup } from "@atlaskit/button";
import { DropdownSingleSelect } from "./DropdownSingleSelect";
import { APIContext } from "../context/api";
import { Filter } from "../types/api";

export const JQLSelectDropdown = ({selectedFilterId, setSelectedFilterId}) => {
  const api = useContext(APIContext);
  const [filters, setFilters] = useState<Filter[]>([]);
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        let response = await api.getFilters();
        setFilters(response);
        return response;
      } catch (error) {
        console.log(error);
      }
    };
    fetchFilters();
  }, []);

  const selectedOption = filters.find(
    (filter) => filter.id == selectedFilterId
  );
  const fetchFilteredIssues = () => {
    // const jql = "filter=" + selectedOption?.id;
    //TODO: fetch filtered ids
  };
  return (
      <ButtonGroup>
        <DropdownSingleSelect
          dropdownName={selectedOption?.name ?? "Select filter"}
          options={filters}
          selectedOptionId={selectedFilterId}
          updateSelectedOptionId={setSelectedFilterId}
        ></DropdownSingleSelect>
        <Button appearance="primary" onClick={fetchFilteredIssues}>
          Apply
        </Button>
      </ButtonGroup>
  );
};
