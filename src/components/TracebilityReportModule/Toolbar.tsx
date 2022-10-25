import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import Button, { ButtonGroup } from "@atlaskit/button";
import { DropdownSingleSelect } from "../DropdownSingleSelect";
import { APIContext } from "../../context/api";
import { Filter } from "../../types/api";
import { JQLSelectDropdown } from "../JQLSelectDropdown";

const MainBar = styled.div`
  display: flex;
  background-color: ${colors.N20}
  padding: 10px;
  border-radius: 3px;
  justify-content: space-between;
`;

export const Toolbar = () => {
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
      <JQLSelectDropdown />
    </MainBar>
  );
};
