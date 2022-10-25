import React, { useContext } from "react";
import LicenseContainer from "./components/LicenseContainer";
import { TracebilityReportModule } from "./components/TracebilityReportModule/TracebilityReportModule";
import { APIContext } from "./context/api";

const TracebilityReport = () => {
  const api = useContext(APIContext);
  if (api.hasValidLicense()) {
    return <TracebilityReportModule></TracebilityReportModule>;
  }
  return <LicenseContainer></LicenseContainer>;
};

export default TracebilityReport;
