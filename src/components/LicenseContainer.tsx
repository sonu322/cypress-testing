import React from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";

const NoLicense = styled.div`
  color: ${colors.R500};
`;

const LicenseContainer = () => {
  return <NoLicense>Error: you don't have a valid license</NoLicense>;
};

export default LicenseContainer;
