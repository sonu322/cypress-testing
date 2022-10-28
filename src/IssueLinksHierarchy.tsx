import React from "react";
import LicenseContainer from "./components/common/LicenseContainer";
import { IssueTreeModule } from "./components/IssueTreeModule/IssueTreeModule";
import { APIContext } from "./context/api";

const IssueLinksHierarchy = () => {
  return (
    <APIContext.Consumer>
      {
        (api) => {
          return api.hasValidLicense() ? <IssueTreeModule /> : <LicenseContainer />;
        }
      }
    </APIContext.Consumer>
  );
};

export default IssueLinksHierarchy;