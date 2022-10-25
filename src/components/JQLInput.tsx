import React, { useEffect,useState,  useContext } from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import Button, { ButtonGroup } from "@atlaskit/button";
import { Dropdown } from "./Dropdown";
import { FilterAPI } from "./api";
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
  const [filters, setFilters] = useState<Filter[]>([])
    const [selectedFilters, setSelectedFilterIds] = useState<String[]>([])
  // componentDidMount() {
  //     this._isMounted = true;
  //     FilterAPI().then((data) => {
  //       if (this._isMounted) {
  //         this.setState({
  //           fetched: true,
  //           options: data.values,
  //         });
  //       }
  //     });
  //   }
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        let response = await api.getFilters();
        setFilters(response)
        const ids = response.map(filter => filter.id)
        setSelectedFilterIds(ids)
        return response;
      } catch (error) {
        console.log(error)
        // TODO: add error handling
        // handleNewError(error);
      }
    };
    fetchFilters();
  }, []);

//   selectedOptions,
//   dropdownName,
//   updateSelectedOptions,
//   options,
  return (
    <MainBar>
      <ButtonGroup>
        <Dropdown dropdownName={"Select filter | selected"} 
        options={filters}
        selectedOptions={selectedFilters}
        updateSelectedOptions={setSelectedFilterIds}      
        ></Dropdown>
        <Button appearance="primary">Apply</Button>
      </ButtonGroup>
    </MainBar>
  );
};
