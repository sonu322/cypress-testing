import React, { useContext, useEffect } from "react";
import LicenseContainer from "./components/common/LicenseContainer";
import { TracebilityReportModule } from "./components/TracebilityReportModule/TracebilityReportModule";
import { APIContext } from "./context/api";

const TracebilityReport = () => {
  const api = useContext(APIContext);
  useEffect(() => {
    const handleLocale = async () => {
      const locale = await api.getLocale();
      if (locale !== i18n.language) {
        console.log(i18n.language, locale);
        await i18n.changeLanguage(locale);
      }
    };
    console.log("called use eff");
    handleLocale();
  }, []);
  if (api.hasValidLicense()) {
    return <TracebilityReportModule></TracebilityReportModule>;
  }
  return <LicenseContainer></LicenseContainer>;
};

export default TracebilityReport;
