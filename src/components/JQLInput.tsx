import React, { useEffect, useContext } from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import Button, { ButtonGroup } from "@atlaskit/button";
import { Dropdown } from "./Dropdown";
import { FilterAPI } from "./api";
import { APIContext } from "../context/api";

const MainBar = styled.div`
  display: flex;
  background-color: ${colors.N20}
  padding: 10px;
  border-radius: 3px;
`;

export const JQLInput = () => {
  const api = useContext(APIContext);
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
        console.log("filters", response);
        return response;
      } catch (error) {
        console.log(error);
      }
    };
    fetchFilters();
  }, []);
  return (
    <MainBar>
      <ButtonGroup>
        <Dropdown dropdownName={"Select filter | selected"}></Dropdown>
        <Button appearance="primary">Apply</Button>
      </ButtonGroup>
    </MainBar>
  );
};
