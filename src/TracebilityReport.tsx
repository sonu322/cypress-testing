import React, { useContext } from "react";
import LicenseContainer from "./components/LicenseContainer";
import { APIContext } from "./context/api";

const TracebilityReport = () => {
  const api = useContext(APIContext);
  if (api.hasValidLicense()) {
    return <div>Tracebility module</div>;
  }
  return <LicenseContainer></LicenseContainer>;
};

export default TracebilityReport;
