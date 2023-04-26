import i18n from "../../i18n";

const { t } = i18n;
export const noIssueKeyError = t(
  "otpl.lxp.tree-gadget.configure-form.errors.no-issue-key"
);
export const badIssueKeyError = t(
  "otpl.lxp.tree-gadget.configure-form.errors.bad-issue-key"
);
export const badHeightError = t(
  "otpl.lxp.gadget-common.configure-form.errors.bad-height"
);
export const DASHBOARD_GADGET_CONFIG_KEY = "config";
export const DEFAULT_GADGET_TITLE = "LXP";
export const DEFAULT_GADGET_HEIGHT = 500;
export const MIN_GADGET_HEIGHT = 200;

export const ISSUE_KEY_FIELD_NAME = "issueKey";
export const HEIGHT_FIELD_NAME = "height";

export const defaultGadgetConfig = {
  [ISSUE_KEY_FIELD_NAME]: "",
  [HEIGHT_FIELD_NAME]: DEFAULT_GADGET_HEIGHT,
};
