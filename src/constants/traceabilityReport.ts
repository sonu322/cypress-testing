import i18n from "../../i18n";

const { t } = i18n;
export const jqlDialogOptions = {
  header: t("otpl.lxp.traceability-report.toolbar.jqlDialogOptions.header"),
  descriptionText: t(
    "otpl.lxp.traceability-report.toolbar.jqlDialogOptions.descriptionText"
  ),
  submitText: t(
    "otpl.lxp.traceability-report.toolbar.jqlDialogOptions.submitText"
  ),
  cancelText: t(
    "otpl.lxp.traceability-report.toolbar.jqlDialogOptions.cancelText"
  ),
  jql: "order by status ASC",
};
export const displayAllIssueCardsId = "Display All issue cards";
export const autoHideEmptyColumnsId = "Auto hide empty columns";
export const reportCellOptions = [
  {
    id: displayAllIssueCardsId,
    name: t(
      "otpl.lxp.traceability-report.toolbar.settingsDropdown.displayAllIssueCards"
    ),
    description: t(
      "otpl.lxp.traceability-report.toolbar.settingsDropdown.displayAllIssueCards.Description"
    ),
  },
  {
    id: autoHideEmptyColumnsId,
    name: t(
      "otpl.lxp.traceability-report.toolbar.settingsDropdown.autoHideEmptyColumns"
    ),
    description: t(
      "otpl.lxp.traceability-report.toolbar.settingsDropdown.autoHideEmptyColumns.Description"
    ),
  },
];
export const exportCurrentPageId = "Export the current page";
export const exportAllRecordsId = "Export all records";
export const exportTabularReportOptions = [
  {
    id: exportCurrentPageId,
    name: t(
      "otpl.lxp.traceability-report.toolbar.exportDropdown.exportCurrentPage"
    ),
  },
  {
    id: exportAllRecordsId,
    name: t(
      "otpl.lxp.traceability-report.toolbar.exportDropdown.exportAllRecords"
    ),
  },
];

export const exportTreeReportOptions = [
  {
    id: exportCurrentPageId,
    name: t(
      "otpl.lxp.traceability-report.toolbar.exportDropdown.exportCurrentPage"
    ),
  },
];

export const viewTabs = {
  id: "view-tabs",
  tabs: [
    {
      id: "issuetype-view",
      name: t("otpl.lxp.traceability-report.issuetype-view.name"),
      description: t("otpl.lxp.traceability-report.issuetype-view.description"),
    },
    {
      id: "linktype-view",
      name: t("otpl.lxp.traceability-report.linktype-view.name"),
      description: t("otpl.lxp.traceability-report.linktype-view.description"),
    },
    {
      id: "tree-view",
      name: t("otpl.lxp.traceability-report.tree-view.name"),
      description: t("otpl.lxp.traceability-report.tree-view.description"),
    },
  ],
};

export const orphansTreeBranchName = t(
  "otpl.lxp.traceability-report.tree-view.orphans-tree-branch-name"
);
export const loadMoreOrphansButtonName = t(
  "otpl.lxp.traceability-report.tree-view.orphans-load-more-button-name"
);
export const orphansMaxResults = 20;
