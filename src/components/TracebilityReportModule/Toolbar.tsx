import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
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
  return (
    <MainBar>
      <JQLSelectDropdown />
    </MainBar>
  );
};
