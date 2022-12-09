import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LicenseContainer from "./components/common/LicenseContainer";
import { TracebilityReportModule } from "./components/TracebilityReportModule/TracebilityReportModule";
import { APIContext } from "./context/api";

const TracebilityReport = () => {
  const { i18n } = useTranslation();
  const api = useContext(APIContext);
  useEffect(() => {
    const handleLocale = async () => {
      const locale = await api.getLocale();
      console.log("LOCALe");
      console.log(locale);
      if (locale !== i18n.language) {
        console.log("i18", i18n.language, "locale", locale);
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
