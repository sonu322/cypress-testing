import React, { Suspense } from "react";
import LicenseContainer from "./components/common/LicenseContainer";
import { IssueTreeModule } from "./components/IssueTreeModule/IssueTreeModule";
import { APIContext } from "./context/api";
import "../i18n";

const IssueLinksHierarchy = () => {
  return (
    <Suspense fallback="loading i18n">
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
