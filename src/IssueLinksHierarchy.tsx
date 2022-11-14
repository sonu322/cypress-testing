import React, { Suspense } from "react";
import LicenseContainer from "./components/common/LicenseContainer";
import { IssueTreeModule } from "./components/IssueTreeModule/IssueTreeModule";
import { APIContext } from "./context/api";
import { useTranslation } from "react-i18next";
import "../i18n";

const IssueLinksHierarchy = () => {
  const { t } = useTranslation();
  return (
    <Suspense fallback={t("lxp.common.loading")}>
      <APIContext.Consumer>
        {(api) => {
          return api.hasValidLicense() ? (
            <IssueTreeModule />
          ) : (
            <LicenseContainer />
          );
        }}
      </APIContext.Consumer>
    </Suspense>
  );
};

export default IssueLinksHierarchy;
