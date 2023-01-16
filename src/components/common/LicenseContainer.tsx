import React from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import { useTranslation } from "react-i18next";
const NoLicense = styled.div`
  color: ${colors.R500};
`;

// TODO: Add a link to acquire the license in this screen.
const LicenseContainer = () => {
  const { t, i18n } = useTranslation();
  const errorMessage = t("otpl.lxp.license.do-not-have");
  return <NoLicense>{errorMessage}</NoLicense>;
};

export default LicenseContainer;
