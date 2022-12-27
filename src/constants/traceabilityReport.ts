import i18n from "../../i18n";

const { t } = i18n;
export const jqlDialogOptions = {
  header: t("traceability-report.toolbar.jqlDialogOptions.header"),
  descriptionText: t(
    "traceability-report.toolbar.jqlDialogOptions.descriptionText"
  ),
  submitText: t("traceability-report.toolbar.jqlDialogOptions.submitText"),
  cancelText: t("traceability-report.toolbar.jqlDialogOptions.cancelText"),
  jql: "order by status ASC",
};
