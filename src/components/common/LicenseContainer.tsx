import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { token } from "@atlaskit/tokens";
const NoLicense = styled.div`
  color: ${token("color.text.danger")};
`;

// TODO: Add a link to acquire the license in this screen.
const LicenseContainer = () => {
  const { t, i18n } = useTranslation();
  const errorMessage = t("otpl.lxp.license.do-not-have");
  return <NoLicense>{errorMessage}</NoLicense>;
};

export default LicenseContainer;
