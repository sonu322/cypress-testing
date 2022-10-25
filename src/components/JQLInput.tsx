import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import Button, { ButtonGroup } from "@atlaskit/button";
import { DropdownSingleSelect } from "./DropdownSingleSelect";
import { APIContext } from "../context/api";
import { Filter } from "../types/api";

const MainBar = styled.div`
  display: flex;
  background-color: ${colors.N20}
  padding: 10px;
  border-radius: 3px;
`;

export const JQLInput = () => {
  const api = useContext(APIContext);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [selectedFilterId, setSelectedFilterId] = useState<String>();
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
    <MainBar>
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
    </MainBar>
  );
};
