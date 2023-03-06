import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LicenseContainer from "./components/common/LicenseContainer";
import { TreeFilterContextProvider } from "./components/common/TreeFilterContextProvider";
import { TracebilityReportModule } from "./components/TracebilityReportModule/TracebilityReportModule";
import { APIContext } from "./context/api";

interface Props {
  showCustomJQLEditor?: any;
}

const TracebilityReport = ({ showCustomJQLEditor }: Props): JSX.Element => {
  const { i18n } = useTranslation();
  const api = useContext(APIContext);
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
  if (api.hasValidLicense()) {
    return (
      <TreeFilterContextProvider>
        <TracebilityReportModule
          showCustomJQLEditor={showCustomJQLEditor}
        ></TracebilityReportModule>
      </TreeFilterContextProvider>
    );
  } else {
    return <LicenseContainer></LicenseContainer>;
    // return (
    //   <TreeFilterContextProvider>
    //     <TracebilityReportModule
    //       showCustomJQLEditor={showCustomJQLEditor}
    //     ></TracebilityReportModule>
    //   </TreeFilterContextProvider>
    // );
  }
};

export default TracebilityReport;
