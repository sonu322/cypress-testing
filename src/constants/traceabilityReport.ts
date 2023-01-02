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
export const viewTabs = {
  id: "view-tabs",
  tabs: [
    {
      id: "issuetype-view",
      name: t("traceability-report.issuetype-view.name"),
      description: t("traceability-report.issuetype-view.description"),
    },
    {
      id: "linktype-view",
      name: t("traceability-report.linktype-view.name"),
      description: t("traceability-report.linktype-view.description"),
    },
    {
      id: "tree-view",
      name: t("traceability-report.tree-view.name"),
      description: t("traceability-report.tree-view.description"),
    },
  ],
};

export const orphansTreeBranchName = "Orphan Issues";