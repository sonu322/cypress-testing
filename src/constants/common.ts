import i18n from "../../i18n";
import { IssueTreeFilter } from "../types/api";

export const treeFilterDropdowns = [
  { key: "priorities", label: i18n.t("otpl.lxp.common.issue.priority") },
  { key: "linkTypes", label: i18n.t("otpl.lxp.toolbar.link-type.text") },
  { key: "issueTypes", label: i18n.t("otpl.lxp.toolbar.issue-type.text") },
];

export const lastSavedReportConfigKey = "lastSavedReportConfig";
export const lastSavedTreeConfigKey = "lastSavedTreeConfig";

export const emptyTreeFilter: IssueTreeFilter = {
  priorities: [],
  issueTypes: [],
  linkTypes: [],
};

export const EXPAND_ALL_LEVEL = 3;

export const NOT_SET = "NOT_SET";