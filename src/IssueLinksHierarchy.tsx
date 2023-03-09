import React, { Suspense, useEffect, useContext } from "react";
import LicenseContainer from "./components/common/LicenseContainer";
import { IssueTreeModule } from "./components/IssueTreeModule/IssueTreeModule";
import { APIContext } from "./context/api";
import { useTranslation } from "react-i18next";
import "../i18n";
import { TreeFilterContextProvider } from "./components/common/TreeFilterContextProvider";
import { lastSavedTreeConfigKey } from "./constants/common";

const IssueLinksHierarchy = () => {
  const api = useContext(APIContext);
  const { i18n, t } = useTranslation();
  useEffect(() => {
    if (api !== undefined && i18n?.language !== undefined) {
      const handleLocale = async (): Promise<void> => {
        const locale = await api.getLocale();
        if (locale !== i18n.language) {
          await i18n.changeLanguage(locale);
        }
      };
      void handleLocale();
    }
  }, [api, i18n]);
  return (
    <Suspense fallback={t("otpl.lxp.common.loading")}>
      {api.hasValidLicense() ? (
        <TreeFilterContextProvider localStorageKey={lastSavedTreeConfigKey}>
          <IssueTreeModule />
        </TreeFilterContextProvider>
      ) : (
        // <LicenseContainer />
        <TreeFilterContextProvider localStorageKey={lastSavedTreeConfigKey}>
          <IssueTreeModule />
        </TreeFilterContextProvider>
      )}
    </Suspense>
  );
};

export default IssueLinksHierarchy;
