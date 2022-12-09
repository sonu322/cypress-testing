import React, { Suspense, useEffect, useContext } from "react";
import LicenseContainer from "./components/common/LicenseContainer";
import { IssueTreeModule } from "./components/IssueTreeModule/IssueTreeModule";
import { APIContext } from "./context/api";
import { useTranslation } from "react-i18next";
import "../i18n";

const IssueLinksHierarchy = () => {
  const api = useContext(APIContext);
  const { i18n, t } = useTranslation();
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
  return (
    <Suspense fallback={t("lxp.common.loading")}>
      {api.hasValidLicense() ? <IssueTreeModule /> : <LicenseContainer />}
    </Suspense>
  );
};

export default IssueLinksHierarchy;
