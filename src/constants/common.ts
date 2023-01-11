import i18n from "../../i18n";
import { IssueTreeFilter } from "../types/api";

export const treeFilterDropdowns = [
  { key: "priorities", label: i18n.t("lxp.common.issue.priority") },
  { key: "linkTypes", label: i18n.t("lxp.toolbar.link-type.text") },
  { key: "issueTypes", label: i18n.t("lxp.toolbar.issue-type.text") },
];
export const linkTypeTreeNodeName = "linkTypeNode";
export const buttonTypeTreeNodeName = "buttonTypeNode";
export const issueTypeTreeNodeName = "issueTypeNode";

export const emptyTreeFilter: IssueTreeFilter = {
  priorities: [],
  issueTypes: [],
  linkTypes: [],
};
