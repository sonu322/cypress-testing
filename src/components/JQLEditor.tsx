import React from "react";
import Button from "@atlaskit/button";
import { jqlDialogOptions } from "../constants/traceabilityReport";
import { useTranslation } from "react-i18next";
// @ts-expect-error
const _AP: any = typeof AP !== "undefined" ? AP : null;

interface Props {
  selectedFilterId: string;
  setSelectedFilterId: React.Dispatch<React.SetStateAction<string>>;
  showCustomJQLEditor?: () => void;
}

export const JQLEditor = ({
  selectedFilterId,
  setSelectedFilterId,
  showCustomJQLEditor
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const options = { ...jqlDialogOptions };
  if (Boolean(selectedFilterId) && selectedFilterId !== null) {
    options.jql = selectedFilterId;
  }
  const callback = function ({ jql }: { jql: string }): void {
    setSelectedFilterId(jql);
  };
  const openJQLEditor = (): void => {
    if (showCustomJQLEditor) {
      showCustomJQLEditor(options, callback);
    } else if (_AP !== null) {
      _AP.jira.showJQLEditor(options, callback);
    }
  };
  return (
    <Button appearance="default" onClick={openJQLEditor}>
      {t("otpl.lxp.traceability-report.toolbar.usejqlbutton.name")}
    </Button>
  );
};
